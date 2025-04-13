import { db } from "@/lib/db";
import { Status } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
    try {

        const data = await db.organization.findMany({             
            where: {
                status: Status.activo                
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