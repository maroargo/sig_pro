import { db } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const role = await db.role.findFirst({ where: { name: 'Analista Funcional' } })         

        const data = await db.user.findMany({               
            where: {
                idRole: role?.id,
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