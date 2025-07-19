"use client";
import "chart.js/auto";
import React, { JSX } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
  LineElement,
} from "chart.js";
import { pl } from "zod/v4/locales";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
  LineElement
);

function BarChart({
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
        text: "Bar Chart",
      },
    },
  };
  return (
    <div className="w-full max-w-2xl">
      <Bar options={options} data={data} />
    </div>
  );
}

export default BarChart;
