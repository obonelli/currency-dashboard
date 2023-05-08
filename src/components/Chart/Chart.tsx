import React, { useEffect, useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchHistoricData(currencyId);
      const timeSeries = data["Time Series FX (Daily)"];

      const chartData: ChartData[] = [];

      for (const date in timeSeries) {
        const dailyData = timeSeries[date];

        chartData.unshift({
          date,
          high: dailyData["2. high"],
        });
      }

      setChartData(chartData);
    };

    fetchData();
  }, [currencyId]);

  return (
    <div
      style={{
        width: "95%",
        height: 400,
        background: "black",
        marginBottom: "2rem",
      }}
      data-testid="chart-container"
    >
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 40, // Incrementar el margen izquierdo
            bottom: 20,
          }}
        >
          <CartesianGrid stroke="white" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            data-testid="recharts-x-axis"
            interval={Math.floor(chartData.length / 6)}
            tick={({ x, y, payload }) => (
              <text
                data-testid="recharts-cartesian-axis-ticks"
                className="recharts-cartesian-axis-ticks"
                x={x}
                y={y + 15}
                textAnchor="middle"
                fill="white"
              >
                {formatDate(payload.value)}
              </text>
            )}
          />
          <YAxis
            orientation="right"
            stroke="white"
            data-testid="chart-y-axis"
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="high"
            stroke="#978030"
            strokeWidth={2}
            data-testid="chart-line"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
