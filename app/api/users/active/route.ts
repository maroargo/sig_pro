import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { Status } from "@prisma/client";

export async function GET() {
    try {
        const data = await db.user.findMany({ 
            include: {                
                subgerencia: {                
                    include: {                
                        gerencia: {                
                            include: {                
                                organization: true                                                        
                            },
                        },                                                        
                    },    
                },
                role: true,                                
            }, 
            where: {
                status: Status.activo,
                role: {
                    NOT: {
                        name: "Administrador"
                    },
                },
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