import { db } from "@/lib/db";
import { proyectoSchema } from '@/lib/zod';
import { Status, StatusPeriodo } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try { 
        const session = await auth();
        const esFuncional = session?.user.role?.name === "Analista Funcional";                        

        const periodo = await db.periodo.findFirst({             
            where: {
                statusPeriodo: StatusPeriodo.vigente    
            },
        });

        const whereClause: any = {
            AND: [
                { status: Status.activo },
                { presupuesto: { idPeriodo: periodo?.id } }
            ],
        };
                
        if (esFuncional && session?.user?.idUser) {
            whereClause.AND.push({ users: { some: { idUser: session.user.idUser } } });
        }        

        const data = await db.proyecto.findMany({ 
            include: {
                tipoProyecto: true,                
                proceso: true,
                presupuesto: true,
                estadoProyecto: true,
                users: {
                    include: { 
                        user: true,
                        proyecto: true,
                    },                                                          
                },
            }, 
            where: whereClause,                                             
            orderBy: {
                createdAt: 'asc',
            },
        });                  
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = proyectoSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;        

        const sanitize = (val?: string) => (val && val.trim() !== "" ? val : undefined);

        //Obtener estado pendiente
        const estadoProyectoId = sanitize(data.idEstadoProyecto)
            || (await db.estadoProyecto.findFirst({ where: { name: "Pendiente" } }))?.id;                 

        //Crear el proyecto
        const newProyecto = await db.proyecto.create({
            data: {
              idGerencia: sanitize(data.idGerencia),
              nombre: data.nombre,
              acronimo: data.acronimo,
              correlativo: data.correlativo,
              codigo: data.codigo,
              idTipoProyecto: sanitize(data.idTipoProyecto),
              idPresupuesto: sanitize(data.idPresupuesto),
              idProceso: sanitize(data.idProceso),
              idEstadoProyecto: estadoProyectoId,
              status: "activo",
              statusCodigo: "activo",
            },
        });      

        //Luego, crear las relaciones en `UserProyecto`
        if (data.users && data.users.length > 0) {
            await db.userProyecto.createMany({
                data: data.users.map((u: any) => ({
                    idUser: u.idUser,
                    idProyecto: newProyecto.id, // Ahora sí tenemos el ID del proyecto
                    cargo: u.cargo,
                })),
            });
        }      

        return NextResponse.json(newProyecto, { status: 201 });
    } catch (error) { 
        console.log(error);       
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Proyecto es requerido.' }, { status: 400 });
        }

        //Eliminar primero las relaciones en UserProyecto
        await db.userProyecto.deleteMany({
            where: { idProyecto: id }
        });

        //Ahora eliminar el proyecto
        const deleted = await db.proyecto.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Proyecto no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Proyecto eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;                   

        if (!id) {
            return NextResponse.json({ message: 'Proyecto ID es requerido' }, { status: 400 });
        }

        // Obtener los IDs actuales en la BD
        const existingUsers = await db.userProyecto.findMany({
            where: { idProyecto: id },
            select: { idUser: true }
        });

        const existingUserIds = new Set(existingUsers.map(u => u.idUser));
        const newUserIds = new Set(body.users.map((u: any) => u.idUser));

        // Usuarios a eliminar (los que ya no están en la nueva lista)
        const usersToDelete = existingUsers.filter(u => !newUserIds.has(u.idUser));

        // Usuarios a agregar (los que no están en la BD)
        const usersToCreate = body.users.filter((u: any) => !existingUserIds.has(u.idUser));       

        // Actualizar el proyecto
        const updated = await db.proyecto.update({
            where: { id },
            data: {   
                idGerencia: body.idGerencia,                                               
                nombre: body.nombre,
                acronimo: body.acronimo,                
                correlativo: body.correlativo,
                codigo: body.codigo,
                idTipoProyecto: body.idTipoProyecto,  
                idPresupuesto: body.idPresupuesto,               
                idProceso: body.idProceso,                                  
                status: body.idStatus == "0" ? Status.activo : Status.inactivo,                                                    
            },
        });

        await db.userProyecto.deleteMany({
            where: { idUser: { in: usersToDelete.map(u => u.idUser) } }
        });

        if (usersToCreate && usersToCreate.length > 0) {
            await db.userProyecto.createMany({
                data: usersToCreate.map((u: any) => ({
                    idUser: u.idUser,
                    idProyecto: id,
                    cargo: u.cargo,
                })),
            });
        };        

        if (!updated) {
            return NextResponse.json({ message: 'Proyecto no válido' }, { status: 404 });
        }

        return NextResponse.json(true, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}