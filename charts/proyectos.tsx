"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

type ChartConfigEntry = {
  label: string;
  color: string;
};

type ProyectoData = {  
  tipoPresupuesto: string;
  cantidad: number;
};

export function ProyectosComponent() {  
  const [data, setData] = useState<ProyectoData[]>([]);

  const chartConfig: Record<string, ChartConfigEntry> = data.reduce(
    (acc: Record<string, ChartConfigEntry>, item, index) => {
      const key = item.tipoPresupuesto || `Tipo ${index + 1}`;
      acc[key] = {
        label: key,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
      return acc;
    },
    {}
  );
  
  useEffect(() => {
    fetch("/api/reportes/proyectos")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error al obtener datos", error));
  }, []);

  const totalProyectos = data.reduce((acc, curr) => acc + curr.cantidad, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Proyectos</CardTitle>
        <CardDescription>Cantidad de proyectos registrados</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="cantidad"
              nameKey="tipoPresupuesto"
              innerRadius={60}
              strokeWidth={5}
            >
              {data.map((entry, index) => {
                const key = entry.tipoPresupuesto || `Tipo ${index + 1}`;
                const fill = chartConfig[key]?.color ?? `hsl(var(--chart-${(index % 5) + 1}))`;
                return <Cell key={`cell-${index}`} fill={fill} />;
              })}

              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalProyectos.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Proyectos
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>

          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Proyectos en tendencia <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Proyectos registrados en el periodo vigente
        </div>
      </CardFooter>
    </Card>
  )
}
