import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try { 
        const session = await auth(); 
        
        const esFuncional = session?.user.role?.name == "Analista Funcional";

        const whereClause: any = {
            AND: [],
        };

        if (esFuncional && session?.user?.idUser) {
            whereClause.AND.push({ idUser: session?.user?.idUser });
        }

        // Traer todos los proyectos del usuario
        const userProyectos = await db.userProyecto.findMany({              
            where: whereClause,                                
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
