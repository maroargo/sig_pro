import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { StatusPeriodo } from "@prisma/client";

export async function GET() {
  try {
    const periodo = await db.periodo.findFirst({             
      where: {
          statusPeriodo: StatusPeriodo.vigente    
      },
    });

    const proyectos = await db.proyecto.findMany({
      where: {
        presupuesto: {
          idPeriodo: periodo?.id,
        },
      },
      select: {
        nombre: true,
        presupuesto: {
          select: {
            tipoPresupuesto: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Formateamos los datos para el gráfico
    const agrupados: Record<string, number> = {};
    for (const proyecto of proyectos) {
      const tipo = proyecto.presupuesto?.tipoPresupuesto?.name || "No definido";
      agrupados[tipo] = (agrupados[tipo] || 0) + 1;
    }

    const data = Object.entries(agrupados).map(([tipoPresupuesto, cantidad]) => ({
      tipoPresupuesto,
      cantidad,
    }));    

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API /api/reportes/proyectos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}