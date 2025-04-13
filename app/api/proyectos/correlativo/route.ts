import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try { 
        const session = await auth(); 
        
        // Obtener el año actual
        const currentYear = new Date().getFullYear();        

        // Generar el CODIGO DEL PROYECTO        
        const lastProy = await db.proyecto.aggregate({
            _max: {
              correlativo: true
            }
        });
          
        const maxCorrelativo = lastProy._max.correlativo || 0;
        const nextNumber = maxCorrelativo + 1;

        // Formatear el número a cuatro dígitos        
        const gerencia = await db.gerencia.findFirst({
            where: { id: session?.user.gerencia?.idGerencia }
        });
        const subgerencia = await db.subgerencia.findFirst({
            where: { id: session?.user.gerencia?.idSubgerencia }
        });

        // Crear el string formateado
        const formattedCorrelativo = `${nextNumber.toString().padStart(4, "0")}-${currentYear}-${gerencia?.siglas}-${subgerencia?.siglas}/ONPE`;                
        
        // Retornar objeto con ambos valores
        return NextResponse.json({
            codigo: formattedCorrelativo,
            correlativo: nextNumber
        });
    } catch (error) {        
        return NextResponse.json(
            { message: 'Ocurrió un error' }, 
            { status: 500 }
        );
    }
}