import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try { 
        const idProyecto = request.nextUrl.searchParams.get('idProyecto');

        const data = await db.fase.findMany({              
            where: {
                idProyecto: idProyecto                
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
