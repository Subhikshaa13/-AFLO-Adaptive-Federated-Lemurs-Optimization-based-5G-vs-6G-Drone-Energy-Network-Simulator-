import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function ChartsPanel({ droneData }) {
  const MAX_POINTS = 50;

  const [history, setHistory] = useState({
    battery: [],
    signal: [],
    load: [],
    time: [],
  });

  useEffect(() => {
    if (!droneData || !droneData.length) return;

    const d = droneData.at(-1);

    setHistory((prev) => ({
      battery: [...prev.battery, d.battery_percent ?? 0].slice(-MAX_POINTS),
      signal: [...prev.signal, d.signal_strength_dbm ?? -100].slice(-MAX_POINTS),
      load: [...prev.load, d.network_load_mbps ?? 0].slice(-MAX_POINTS),
      time: [...prev.time, d.timestamp ?? ""].slice(-MAX_POINTS),
    }));
  }, [droneData]);

  const data = {
    labels: history.time,
    datasets: [
      {
        label: "Battery %",
        data: history.battery,
        borderColor: "#10B981",
        tension: 0.3,
        yAxisID: "y1",
      },
      {
        label: "Signal (dBm)",
        data: history.signal,
        borderColor: "#3B82F6",
        tension: 0.3,
        yAxisID: "y2",
      },
      {
        label: "Network Load (Mbps)",
        data: history.load,
        borderColor: "#F59E0B",
        tension: 0.3,
        yAxisID: "y3",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 0 },
    plugins: { legend: { position: "top" } },
    scales: {
      x: { type: "category" },
      y1: { min: 0, max: 100, type: "linear", position: "left" },
      y2: { min: -120, max: 0, type: "linear", position: "right", grid: { drawOnChartArea: false } },
      y3: { min: 0, max: 100, type: "linear", position: "right", grid: { drawOnChartArea: false } },
    },
  };

  return (
    <div style={{ padding: 20, height: 400 }}>
      <h3>📊 Live Drone Telemetry</h3>
      <Line data={data} options={options} />
    </div>
  );
}
