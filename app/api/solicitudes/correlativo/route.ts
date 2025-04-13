import { db } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET() {
    try { 
        
        // Obtener el año actual
        const currentYear = new Date().getFullYear();

        // Obtener el último correlativo registrado en el año actual
        const lastSolicitud = await db.solicitud.findFirst({
            where: {
                correlativo: {
                    endsWith: `-${currentYear}` // Buscar correlativos del año actual
                }
            },
            orderBy: {
                correlativo: "desc" // Ordenar en orden descendente
            },
            select: {
                correlativo: true
            }
        });

        // Determinar el nuevo número correlativo
        let nextNumber = 1;
        if (lastSolicitud?.correlativo) {
            const lastNumber = parseInt(lastSolicitud.correlativo.split("-")[0], 10);
            nextNumber = lastNumber + 1;
        }

        // Formatear el número a cuatro dígitos
        const newCorrelativo = `${nextNumber.toString().padStart(4, "0")}-${currentYear}`;                  
        
        return NextResponse.json(newCorrelativo);
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}