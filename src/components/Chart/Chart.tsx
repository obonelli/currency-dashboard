import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format } from "date-fns";

interface ChartProps {
  currencyId: string;
}

interface ChartData {
  date: string;
  high: string;
}

const fetchHistoricData = async (currencyId: string) => {
  const response = await fetch(
    `http://67.205.189.142:8000/historic-data/${currencyId}`
  );
  const data = await response.json();
  return data;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return format(date, "MMM dd");
};

const Chart: React.FC<ChartProps> = ({ currencyId }) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartWidth, setChartWidth] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHistoricData(currencyId);
      const timeSeries = data["Time Series FX (Daily)"];
    
      const chartData: ChartData[] = [];
    
      for (const date in timeSeries) {
        const dailyData = timeSeries[date];
    
        chartData.push({
          date,
          high: dailyData["2. high"],
        });
      }
    
      setChartData(chartData.reverse()); // Invierte el orden de las fechas en el gráfico
    };
    

    fetchData();
  }, [currencyId]);

  useEffect(() => {
    const updateChartWidth = () => {
      const newChartWidth = window.innerWidth * 0.85; // Cambia el valor 0.8 al porcentaje que desees
      setChartWidth(newChartWidth);
    };

    updateChartWidth();
    window.addEventListener("resize", updateChartWidth);

    return () => {
      window.removeEventListener("resize", updateChartWidth);
    };
  }, []);

  return (
    <LineChart
      width={chartWidth}
      height={400}
      data={chartData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
      style={{ backgroundColor: "black" }}
    >
      <CartesianGrid stroke="#FFF" /> // Cambia el color de las líneas de la
      cuadrícula a blanco y elimina la propiedad strokeDasharray
      <XAxis
        dataKey="date"
        tickFormatter={formatDate}
        data-testid="recharts-x-axis"
        tick={({ x, y, payload, index }) => (
          <text
            data-testid="recharts-cartesian-axis-ticks"
            className="recharts-cartesian-axis-ticks"
            x={x}
            y={y + 15}
            textAnchor="middle"
            fill="#FFF"
          >
            {index % 3 === 0 ? formatDate(payload.value) : ""}
          </text>
        )}
        stroke="#FFF"
      />
      <YAxis orientation="right" stroke="#FFF" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="high"
        stroke="#978030"
        strokeWidth={2}
        activeDot={{ r: 8 }}
      />
    </LineChart>
  );
};

export default Chart;
