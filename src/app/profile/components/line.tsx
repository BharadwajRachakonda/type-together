"use client";
import "chart.js/auto";
import React, { JSX } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { main } from "motion/react-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

function LineChart({
  data,
}: {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}): JSX.Element {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "left" as const,
      },
      title: {
        display: true,
        text: "last 10 records",
      },
    },
  };
  return (
    <div className="h-76 w-full max-w-svw overflow-hidden">
      <Line options={options} data={data} />
    </div>
  );
}

export default LineChart;
