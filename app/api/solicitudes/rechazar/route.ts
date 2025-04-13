import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Solicitud es requerido.' }, { status: 400 });
        }

        // Buscar el estado "Estimacion"
        const estadoSolicitud = await db.estadoSolicitud.findFirst({ where: { name: 'Rechazado' } }) 

        const updated = await db.solicitud.update({
            where: { id },
            data: {                 
                idEstadoSolicitud: estadoSolicitud?.id,                
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Solicitud no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Solicitud rechazada.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}