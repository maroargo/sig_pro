import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { Status, StatusPeriodo } from "@prisma/client";

export async function GET() {
    try {  
        
        const data = await db.presupuesto.findMany({
            include: {
                periodo: true,
            },                          
            where: {
                AND: [
                    { status: Status.activo },
                    { periodo: { statusPeriodo: StatusPeriodo.vigente } },                   
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