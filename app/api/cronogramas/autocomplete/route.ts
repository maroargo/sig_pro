import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { idFase } = body;

    if (!idFase) {
      return NextResponse.json({ message: "idFase es requerido" }, { status: 400 });
    }

    // Eliminar las cronogramas anteriores de esa fase
    await db.cronograma.deleteMany({
      where: {
        idFase,
      },
    });

    const DESARROLLO = await db.etapa.findFirst({ where: { name: "DESARROLLO" } });
    const QA = await db.etapa.findFirst({ where: { name: "QA" } });
    const PRODUCCION = await db.etapa.findFirst({ where: { name: "PRODUCCIÓN" } });

    const INDUCCION = await db.subetapa.findFirst({ where: { name: "INDUCCIÓN" } });
    const AEGP = await db.subetapa.findFirst({ where: { name: "AEGP" } });
    const PASCC = await db.subetapa.findFirst({ where: { name: "PASCC" } });
    const PASPRO = await db.subetapa.findFirst({ where: { name: "PASPRO" } });

    const fechaBase = new Date();
    const fechaDocumento = new Date(fechaBase);
    fechaDocumento.setDate(fechaDocumento.getDate() + 5);
    const fechaQa = new Date(fechaBase);
    fechaQa.setDate(fechaDocumento.getDate() + 20);
    const fechaProd = new Date(fechaBase);
    fechaProd.setDate(fechaDocumento.getDate() + 30);

    // Crear nuevas cronogramas para la fase
    const cronogramas = await db.cronograma.createMany({
      data: [
        {
          tarea: "FM36 Acta de Constitución",
          fecha: fechaBase,
          idFase,
          idEtapa: DESARROLLO?.id,
          idSubetapa: AEGP?.id,
        },
        {
          tarea: "FM37 Alcance y Cronograma",
          fecha: fechaDocumento,
          idFase,
          idEtapa: DESARROLLO?.id,
          idSubetapa: AEGP?.id,
        },
        {
          tarea: "FM38 Plan de Gestión",
          fecha: fechaDocumento,
          idFase,
          idEtapa: DESARROLLO?.id,
          idSubetapa: AEGP?.id,
        },
        {
          tarea: "FM39 Reglas de Negocio",
          fecha: fechaDocumento,
          idFase,
          idEtapa: DESARROLLO?.id,
          idSubetapa: AEGP?.id,
        },
        {
          tarea: "FM 40 Requerimientos del Software",
          fecha: fechaDocumento,
          idFase,
          idEtapa: DESARROLLO?.id,
          idSubetapa: AEGP?.id,
        },
        {
          tarea: "FM41 Arquitectura del Sistema",
          fecha: fechaDocumento,
          idFase,
          idEtapa: DESARROLLO?.id,
          idSubetapa: AEGP?.id,
        },
        {
          tarea: "Reunión de Inducción QA",
          fecha: fechaQa,
          idFase,
          idEtapa: QA?.id,
          idSubetapa: INDUCCION?.id,
        },
        {
          tarea: "Pase a QA",
          fecha: fechaQa,
          idFase,
          idEtapa: QA?.id,
          idSubetapa: PASCC?.id,
        },
        {
          tarea: "Pase a Producción",
          fecha: fechaProd,
          idFase,
          idEtapa: PRODUCCION?.id,
          idSubetapa: PASPRO?.id,
        }
      ],
    });    

    return NextResponse.json(cronogramas, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Ocurrió un error" }, { status: 500 });
  }
}
