import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {          
        const data = await db.cronograma.findMany({ 
            include: {
                fase: {
                    include: {
                        proyecto: {
                            include: {
                                proceso: true,
                                users: {
                                    include: {
                                        user: true,                                                      
                                    },
                                },               
                            },
                        },               
                    },
                },
                etapa: true, 
                subetapa: true,
                estadoCronograma: true,               
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

        const estadoCronograma = await db.estadoCronograma.findFirst({            
            where: {
                value: '1',
            },
        });         

        const cronograma = await db.cronograma.create({
            data: {
                tarea: body.tarea,
                fecha: body.fecha,  
                idFase: body.idFase,                
                idEtapa: body.idEtapa,
                idSubetapa: body.idSubetapa,            
                idEstadoCronograma: estadoCronograma?.id,
            },
        });               

        return NextResponse.json(cronograma, { status: 201 });
    } catch (error) {               
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Cronograma es requerido.' }, { status: 400 });
        }

        const deleted = await db.cronograma.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Cronograma no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Cronograma eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        const body = await request.json();
        const { id, ...rest } = body;        

        if (!id) {
            return NextResponse.json({ message: 'Cronograma ID es requerido' }, { status: 400 });
        }

        const updated = await db.cronograma.update({
            where: { id },
            data: {                                
                tarea: body.tarea,
                fecha: body.fecha,  
                idFase: body.idFase,                
                idEtapa: body.idEtapa,
                idSubetapa: body.idSubetapa,                                         
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Cronograma no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}