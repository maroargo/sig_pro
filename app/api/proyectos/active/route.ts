import { db } from "@/lib/db";
import {  Status } from '@prisma/client';
import {  NextResponse } from 'next/server';

export async function GET() {
    try {                                 
        const data = await db.proyecto.findMany({ 
            include: {
                tipoProyecto: true,                
                proceso: true,
                presupuesto: true,
                estadoProyecto: true,
                users: {
                    include: { 
                        user: true,
                        proyecto: true,
                    },                                                          
                },
            },
            where: {
                status: Status.activo,
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