"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export default function EstadoSolicitudChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/reportes/solicitudes")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error al obtener datos", error));
  }, []);

  return (
    <Card className="shadow-lg border border-gray-200 rounded-2xl">
      <CardHeader>
        <CardTitle>Solicitudes</CardTitle>
        <CardDescription>Distribución de solicitudes pendientes, aprobadas y rechazadas.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center">
          <BarChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis dataKey="estado" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis />
            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
            <Bar dataKey="cantidad" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Tendencia positiva este mes <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-muted-foreground">Datos basados en las solicitudes registradas</div>
      </CardFooter>
    </Card>
  );
}
