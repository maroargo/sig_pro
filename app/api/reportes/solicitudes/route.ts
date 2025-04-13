import { db } from "@/lib/db";
import { NextResponse } from 'next/server';
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();     

        const solicitudes = await db.solicitud.findMany({
            include: {
                estadoSolicitud: true, // Incluimos la relación con EstadoSolicitud
            },
            where: {
                user: { idSubgerencia: session?.user.gerencia?.idSubgerencia }     
            }
        });
      
        // Transformamos los datos para el gráfico
        const estados = {
            Pendientes: 0,
            Aprobadas: 0,
            Rechazadas: 0,            
        };

        solicitudes.forEach((solicitud) => {
            switch (solicitud.estadoSolicitud?.value) {
                case "4":
                    estados.Aprobadas++;
                    break;
                case "5":
                    estados.Rechazadas++;
                    break;
                default:
                    estados.Pendientes++;
                    break;
            }
        });
  
        // Convertimos el objeto en un array para Recharts
        const data = Object.entries(estados).map(([estado, cantidad]) => ({
            estado,
            cantidad,
        }));
  
        return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: "Error obteniendo datos" }, { status: 500 });
    }
  }