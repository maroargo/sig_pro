import { db } from "@/lib/db";
import { prospectoSchema } from '@/lib/zod';
import { Prospecto, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {          
        const data = await db.prospecto.findMany({ 
            include: {
                tipoProyecto: true,                
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = prospectoSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.prospecto.create({
            data: {
                nombre: data.nombre,
                acronimo: data.acronimo,
                idTipoProyecto: data.idTipoProyecto,
            },
        });

        return NextResponse.json(newData, { status: 201 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'ID Prospecto es requerido.' }, { status: 400 });
        }

        const deleted = await db.prospecto.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Prospecto no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Prospecto eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = prospectoSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Prospecto;

        if (!id) {
            return NextResponse.json({ message: 'Prospecto ID es requerido' }, { status: 400 });
        }

        const updated = await db.prospecto.update({
            where: { id },
            data: {                                
                nombre: data.nombre,
                acronimo: data.acronimo,
                idTipoProyecto: data.idTipoProyecto,                
                status: rest.idStatus == "0" ? Status.activo : Status.inactivo,
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Prospecto no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}