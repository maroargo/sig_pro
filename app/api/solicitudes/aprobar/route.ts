import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function PUT(request: NextRequest) {
    try {
        const session = await auth(); 

        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Solicitud es requerido.' }, { status: 400 });
        }

        //Obtener info de la Solicitud
        const solicitud = await db.solicitud.findFirst({
            include: {
                prospecto: true,
                user: {
                    include: {
                        subgerencia: {
                            include: {
                                gerencia: true,
                            },
                        },
                    },
                },
            },
            where: {
                id: id
            },
        }); 
        
        // Obtener el año actual
        const currentYear = new Date().getFullYear();

        //Generar el CODIGO DEL PROYECTO        
        const lastProy = await db.proyecto.aggregate({
            _max: {
              correlativo: true
            }
        });
          
        const maxCorrelativo = lastProy._max.correlativo || 0;
        const nextNumber = maxCorrelativo + 1;
        
        // Formatear el número a cuatro dígitos
        const gerenciaSigla = solicitud?.user?.subgerencia?.gerencia?.siglas;
        const gerencia = await db.gerencia.findFirst({where: { id: session?.user.gerencia?.idGerencia }});
        const subgerencia = await db.subgerencia.findFirst({where: { id: session?.user.gerencia?.idSubgerencia }});
        //session
        const newCodigo = `${gerenciaSigla}-${nextNumber.toString().padStart(4, "0")}-${currentYear}-${gerencia?.siglas}-${subgerencia?.siglas}/ONPE`;

        //Obtener estado pendiente
        const estadoProyecto = await db.estadoProyecto.findFirst({ where: { name: "Pendiente" }});         

        const nombreProy = solicitud?.noexiste ? solicitud?.nombrePropuesto : solicitud?.prospecto?.nombre;
        const acronProy = solicitud?.noexiste ? solicitud?.siglas : solicitud?.prospecto?.acronimo;

        //Crea el Proyecto
        await db.proyecto.create({
            data: {
                nombre: nombreProy || "",
                acronimo: acronProy || "",
                correlativo: nextNumber,
                codigo: newCodigo,                                         
                idEstadoProyecto: estadoProyecto?.id
            },
        });        

        // Buscar el estado "Aprobado"
        const estadoSolicitud = await db.estadoSolicitud.findFirst({ where: { name: 'Aprobado' } })         
        
        const updated = await db.solicitud.update({
            where: { id },
            data: {                 
                idEstadoSolicitud: estadoSolicitud?.id,                
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Solicitud no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Solicitud aprobada.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}