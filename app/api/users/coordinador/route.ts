import { db } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const role = await db.role.findFirst({ where: { name: 'Coordinador' } })         

        const data = await db.user.findMany({ 
            include: {
                role: true,
            },              
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