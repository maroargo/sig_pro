import { db } from "@/lib/db";
import { Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {         
        const session = await auth();              

        const esUsuario = session?.user.role?.name == "Usuario";
        const esCoordinador = session?.user.role?.name == "Coordinador";
        const esComite = session?.user.role?.name == "Comité de Gobierno y Transformación Digital";

        const registrado = await db.estadoSolicitud.findFirst({ where: { name: 'Registrado' } })
        const estimacion = await db.estadoSolicitud.findFirst({ where: { name: 'Estimacion' } })
        const pendiente = await db.estadoSolicitud.findFirst({ where: { name: 'Pendiente' } })
        //const aprobado = await db.estadoSolicitud.findFirst({ where: { name: 'Aprobado' } })
        //const rechazado = await db.estadoSolicitud.findFirst({ where: { name: 'Rechazado' } })        

        const data = await db.solicitud.findMany({
            include: {
                prospecto: true,
                estadoSolicitud: true,
                user: {
                    include: {
                        subgerencia: {
                            include: {
                                gerencia: true,
                            }
                        },
                    },
                },
                tipoRequerimiento: true,
                tipoAlcance: true,
                objetivos: true,
                niveles: true,
                hitos: true,   
                resultados: true,             
            },
            where: {
                AND: [                    
                    { user: { idSubgerencia: session?.user.gerencia?.idSubgerencia } },
                    esUsuario ? { idEstadoSolicitud: registrado?.id } : {},
                    esCoordinador ? { idEstadoSolicitud: estimacion?.id } : {},
                    esComite ? { idEstadoSolicitud: pendiente?.id } : {},
                ]                
            },                                                                       
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
        const session = await auth(); 

        const body = await request.json();        

        // Buscar el estado "Registrado"
        const estadoSolicitud = await db.estadoSolicitud.findFirst({ 
            where: { name: 'Registrado' } 
        });

        if (!estadoSolicitud) {
            return NextResponse.json({ message: 'Estado "Registrado" no encontrado' }, { status: 400 });
        }

        // Crear la solicitud
        const solicitud = await db.solicitud.create({
            data: {
                correlativo: body.correlativo, 
                nombre: body.nombre,
                noexiste: body.noexiste,
                siglas: body.siglas, 
                nombrePropuesto: body.nombrePropuesto, 
                objetivo: body.objetivo,                
                resumen: body.resumen,
                idProspecto: body.idProspecto || null,
                fechaSolicitud: body.fechaSolicitud || "",
                liderUsuario: body.liderUsuario,
                patrocinador: body.patrocinador,
                idTipoRequerimiento: body.idTipoRequerimiento,
                alcance: body.alcance,
                idTipoAlcance: body.idTipoAlcance,
                objetivoGeneral: body.objetivoGeneral,
                beneficio: body.beneficio,
                beneficioCualitativo: body.beneficioCualitativo,
                beneficioCuantitativo: body.beneficioCuantitativo,
                terminos: body.terminos,
                directivas: body.directivas,
                idEstadoSolicitud: estadoSolicitud.id,
                idUser: session?.user.idUser,
            },
        });

        // Función para insertar datos si hay registros
        const insertIfNotEmpty = async (table: any, data: any[], fields: string[]) => {
            if (data?.length > 0) {
                await table.createMany({
                    data: data.map((item) => ({
                        ...fields.reduce((acc, field) => ({ ...acc, [field]: item[field] }), {}),
                        idSolicitud: solicitud.id,
                    })),
                });
            }
        };

        // Inserción de objetivos, niveles e hitos en paralelo
        await Promise.all([
            insertIfNotEmpty(db.objetivo, body.objetivos, ["objetivo"]),
            insertIfNotEmpty(db.nivel, body.niveles, ["nivel"]),
            insertIfNotEmpty(db.hito, body.hitos, ["hito", "fecha"]),
            insertIfNotEmpty(db.resultado, body.resultados, ["nombre", "descripcion"]),
        ]);

        return NextResponse.json(solicitud, { status: 201 });

    } catch (error) {            
        return NextResponse.json({ message: 'Error interno en el servidor' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Solicitud es requerido.' }, { status: 400 });
        }

        const deleted = await db.solicitud.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Solicitud no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Solicitud eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;        

        const updated = await db.solicitud.update({
            where: { id },
            data: { 
                nombre: body.nombre, 
                noexiste: body.noexiste,
                siglas: body.siglas, 
                nombrePropuesto: body.nombrePropuesto,                              
                objetivo: body.objetivo,                
                resumen: body.resumen,
                idProspecto: body.idProspecto,                

                fechaSolicitud: body.fechaSolicitud,
                liderUsuario: body.liderUsuario,
                patrocinador: body.patrocinador,
                idTipoRequerimiento: body.idTipoRequerimiento,
                
                alcance: body.alcance,
                idTipoAlcance: body.idTipoAlcance,

                objetivoGeneral: body.objetivoGeneral,
                beneficio: body.beneficio,
                beneficioCualitativo: body.beneficioCualitativo,
                beneficioCuantitativo: body.beneficioCuantitativo,

                terminos: body.terminos,
                directivas: body.directivas,
                
                status: body.idStatus == "0" ? Status.activo : Status.inactivo,
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Solicitud no válida' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}