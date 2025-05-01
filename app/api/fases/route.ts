import { db } from "@/lib/db";
import { faseSchema } from '@/lib/zod';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {          
        const data = await db.fase.findMany({ 
            include: {
                proyecto: true,                
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

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Fase es requerido.' }, { status: 400 });
        }

        const deleted = await db.fase.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Fase no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Fase eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Validamos que venga correcto
    const validated = faseSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ message: 'Datos inválidos', errors: validated.error.flatten() }, { status: 400 });
    }

    const { idProyecto, fases, unico } = validated.data;

    if (!idProyecto) {
      return NextResponse.json({ message: 'ID del proyecto es requerido' }, { status: 400 });
    }

    // Eliminar fases antiguas del proyecto
    await db.fase.deleteMany({
      where: { idProyecto },
    });

    // Si "unico" está activado, dejamos sólo la primera fase
    const fasesToCreate = unico ? fases.slice(0, 1) : fases;

    // Crear las nuevas fases
    if (fasesToCreate.length > 0) {
      await db.fase.createMany({
        data: fasesToCreate.map(fase => ({
          nombre: fase.nombre,
          idProyecto,
        })),
      });
    }

    return NextResponse.json({ message: 'Fases actualizadas correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error actualizando fases:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
