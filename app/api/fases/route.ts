import { db } from "@/lib/db";
import { faseSchema } from '@/lib/zod';
import { Fase, Status } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {          
        const data = await db.fase.findMany({ 
            include: {
                proyecto: true,                
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
        const result = faseSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data;

        const newData = await db.fase.create({
            data: {
                nombre: data.nombre,                
                idProyecto: data.idProyecto,
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
            return NextResponse.json({ message: 'ID Fase es requerido.' }, { status: 400 });
        }

        const deleted = await db.fase.delete({
            where: { id },
        });

        if (!deleted) {
            return NextResponse.json({ message: 'Fase no válido' }, { status: 404 });
        }     

        return NextResponse.json({ message: 'Fase eliminado.' }, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...rest } = body;
        const result = faseSchema.safeParse(rest);
        
        if (!result.success) {
            return NextResponse.json({ message: 'Invalid input', errors: result.error.errors }, { status: 400 });
        }

        const data = result.data as Fase;

        if (!id) {
            return NextResponse.json({ message: 'Fase ID es requerido' }, { status: 400 });
        }

        const updated = await db.fase.update({
            where: { id },
            data: {                                
                nombre: data.nombre,
                idProyecto: data.idProyecto,                
            },
        });

        if (!updated) {
            return NextResponse.json({ message: 'Fase no válido' }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {        
        return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
    }
}