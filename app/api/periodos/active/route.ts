import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";
import { Status, StatusPeriodo } from "@prisma/client";

export async function GET() {
    try {  
        const session = await auth();        
        const esAdmin = session?.user.role?.name == "Administrador";                
        
        const data = await db.periodo.findFirst({ 
            include: {
                organization: true,
                presupuestos: {
                    include: {
                        tipoPresupuesto: true,
                        procesos: true,
                    }, 
                },
            },             
            where: {
                AND: [
                    { status: Status.activo },
                    { statusPeriodo: StatusPeriodo.vigente },
                    ...(!esAdmin ? [{ idOrganization: session?.user.idOrganization }] : []),                                      
                ]                
            },                                
            orderBy: {
                createdAt: 'asc',
            },
        }); 
        
        console.log(data);
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}