import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
  try {  
    const session = await auth();

    const esCoordinador = session?.user.role?.name === "Coordinador";
    const esSupervisor = session?.user.role?.name === "Supervisor";
    const esFuncional = session?.user.role?.name === "Analista Funcional";    

    let whereClause: any = {};

    if (esFuncional) {          
        whereClause = {
            fase: {
                proyecto: {
                    users: {
                        some: {
                            idUser: session?.user?.idUser, 
                        },
                    },
                },
            },
        };
    } else if (!esCoordinador && !esSupervisor) {     
        whereClause = {
            idUser: session?.user?.idUser,
        };
    }    

    const data = await db.actividad.findMany({ 
      include: {
        user: true,
        fase: {
          include: {
            proyecto: true,
          },
        },
        etapa: true,
        estadoActividad: true,
      }, 
      where: whereClause,          
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(data);
  } catch (error) { 
    console.error(error);       
    return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try { 
        const session = await auth(); 

        const body = await request.json();                 

        const estadoActividad = await db.estadoActividad.findFirst({            
            where: {
                value: '1',
            },
        });         

        const actividad = await db.actividad.create({
            data: {  
                idFase: body.idFase,
                idUser: body.idUser,
                idEtapa: body.idEtapa,
                nombre: body.nombre,
                fechaInicio: body.fechaInicio,
                fechaFin: body.fechaFin,
                idEstadoActividad: estadoActividad?.id,
            },
        });               

        return NextResponse.json(actividad, { status: 201 });
    } catch (error) {               
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Actividad es requerido.' }, { status: 400 });
        }

        const deleted = await db.actividad.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Actividad no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Actividad eliminada.' }, { status: 200 });
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
            return NextResponse.json({ message: 'Actividad ID es requerido' }, { status: 400 });
        }

        const updated = await db.actividad.update({
            where: { id },
            data: {                                
                idFase: body.idFase,
                idUser: body.idUser,
                idEtapa: body.idEtapa,
                nombre: body.nombre,
                fechaInicio: body.fechaInicio,
                fechaFin: body.fechaFin,                                         
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Actividad no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}