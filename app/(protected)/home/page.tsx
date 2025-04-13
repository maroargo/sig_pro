
import { auth } from "@/auth";
import { BarComponent } from "@/charts/bar";
import EstadoSolicitudChart from "@/charts/estadoSolicitud";
import { LineComponent } from "@/charts/line";
import { PieComponent } from "@/charts/pie";
import { ProyectosComponent } from "@/charts/proyectos";
import { RadarComponent } from "@/charts/radar";

export default async function Home() {
  const session = await auth();

  /*return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>        
    </div>
  ); */

  return (    
    <div className="flex flex-wrap w-full gap-4">
      {/* Cada elemento ocupa ~50% - gap (gap-4 = 1rem → calc(50% - 0.5rem)) */}
      <div className="flex-1 min-w-[calc(50%-0.5rem)] h-full min-h-0">
        <ProyectosComponent />
      </div>
      <div className="flex-1 min-w-[calc(50%-0.5rem)] h-full min-h-0">
        <LineComponent />
      </div>
      
      <div className="flex-1 min-w-[calc(50%-0.5rem)] h-full min-h-0">
        <RadarComponent />
      </div>
      <div className="flex-1 min-w-[calc(50%-0.5rem)] h-full min-h-0">
        <BarComponent />
      </div>
    </div>

    
  );
}

