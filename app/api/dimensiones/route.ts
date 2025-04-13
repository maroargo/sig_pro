import { db } from "@/lib/db";
import { dimensionSchema } from '@/lib/zod';
import { Dimension } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {         
        const idSolicitud = request.nextUrl.searchParams.get('idSolicitud');
        
        const data = await db.dimension.findMany({ 
            include: {
                tipoDimension: true,
            }, 
            where : {
                idSolicitud: idSolicitud,
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
        const result = dimensionSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.dimension.create({
            data: {
                idSolicitud: data.idSolicitud,
                idTipoDimension: data.idTipoDimension,
                tarea: data.tarea,
                requerimiento: data.requerimiento
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
            return NextResponse.json({ message: 'ID Dimensión es requerido.' }, { status: 400 });
        }

        const deleted = await db.dimension.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Dimensión no válida' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Dimensión eliminada.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = dimensionSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Dimension;

        if (!id) {
            return NextResponse.json({ message: 'Dimensión ID es requerido' }, { status: 400 });
        }

        const updated = await db.dimension.update({
            where: { id },
            data: {                
                idTipoDimension: data.idTipoDimension,
                tarea: data.tarea,
                requerimiento: data.requerimiento           
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Dimensión no válida' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}