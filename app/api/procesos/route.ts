import { db } from "@/lib/db";
import { Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {  
        
        const data = await db.proceso.findMany({            
            orderBy: {
                createdAt: 'asc',
            },
        });        
        
        return NextResponse.json(data);
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try { 
        const session = await auth(); 
        const body = await request.json();                 

        const proceso = await db.proceso.create({
            data: {                
                name: body.name,
                siglas: body.siglas, 
                idPresupuesto: body.idPresupuesto                             
            },
        });               

        return NextResponse.json(proceso, { status: 201 });
    } catch (error) {       
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Proceso es requerido.' }, { status: 400 });
        }

        const deleted = await db.proceso.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Proceso no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Proceso eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth();

        const body = await request.json();
        const { id, ...rest } = body;        

        if (!id) {
            return NextResponse.json({ message: 'Proceso ID es requerido' }, { status: 400 });
        }

        const updated = await db.proceso.update({
            where: { id },
            data: {                                
                name: rest.name,
                siglas: rest.siglas,  
                idPresupuesto: rest.idPresupuesto,
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,                                         
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Proceso no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}