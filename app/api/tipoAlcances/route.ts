import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { Status } from "@prisma/client";

export async function GET() {
    try {  
        
        const data = await db.tipoAlcance.findMany({                          
            where: {
                AND: [
                    { status: Status.activo }                    
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