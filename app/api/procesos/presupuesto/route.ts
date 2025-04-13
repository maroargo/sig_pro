import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';
import { Status } from "@prisma/client";

export async function GET(request: NextRequest) {
    try { 
        const idPresupuesto = request.nextUrl.searchParams.get('idPresupuesto'); 
        
        const data = await db.proceso.findMany({                          
            where: {
                AND: [
                    { status: Status.activo },
                    { idPresupuesto: idPresupuesto }                  
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