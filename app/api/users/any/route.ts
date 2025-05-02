import { db } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Buscamos los IDs de los roles "Analista Funcional" y "Coordinador"
    const rolesToExclude = await db.role.findMany({
      where: {
        name: {
          in: ["Administrador", "Coordinador", "Supervisor", "Analista Funcional"],
        },
      },
      select: {
        id: true,
      },
    });

    const excludedRoleIds = rolesToExclude.map(role => role.id);

    const data = await db.user.findMany({
      where: {
        idRole: {
          notIn: excludedRoleIds,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Ocurrió un error' }, { status: 500 });
  }
}
