import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try { 
        const session = await auth(); 

        // Traer todos los proyectos del usuario
        const userProyectos = await db.userProyecto.findMany({              
            where: {
                idUser: session?.user.id,
            },                                
            orderBy: {
                createdAt: 'asc',
            },
            select: {
                idProyecto: true,
            }
        });
  
        const idProyectos = userProyectos.map(up => up.idProyecto);
    
        if (idProyectos.length === 0) {
            return NextResponse.json([]); // No tiene proyectos asignados
        }
  
        // Traer todas las fases de esos proyectos
        const fases = await db.fase.findMany({              
            where: {
            idProyecto: {
                in: idProyectos,
            }
            },                                
            orderBy: {
            createdAt: 'asc',
            },
        });                      

        return NextResponse.json(fases);
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}
