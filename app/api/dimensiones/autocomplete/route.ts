import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const idSolicitud = request.nextUrl.searchParams.get('idSolicitud');
        
        //Eliminar las que puedan existir
        await db.dimension.deleteMany({
            where: { idSolicitud },
        });

        // Obtener todos los tipos de dimensión
        const tiposDimension = await db.tipoDimension.findMany(); 

        const dimensiones = await db.dimension.createMany({
            data: tiposDimension.map((tipo) => ({
                idSolicitud, // ID de la solicitud a la que pertenecen
                idTipoDimension: tipo.id, // Asignar el ID del tipo de dimensión
                tarea: `Tarea para ${tipo.name}`, // Puedes personalizar esto
                requerimiento: `Requerimiento para ${tipo.name}`,
            })),
        });        

        return NextResponse.json(dimensiones, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}