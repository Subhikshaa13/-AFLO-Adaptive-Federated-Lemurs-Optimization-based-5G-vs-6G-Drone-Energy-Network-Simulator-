import React, { useState, useEffect } from "react";
import Papa from "papaparse";

import ControlPanel from "./components/ControlPanel";
import MapView from "./components/MapView";
import ChartsPanel from "./components/ChartsPanel";
import ComparisonPanel from "./components/ComparisonPanel";

import { runSimulation } from "./sim/SimulationEngine";
import "./styles/global.css";

export default function App() {

  const [config, setConfig] = useState({
    numDrones: 5,
    areaSize: 1000,
    nodeDensity: 0.002,
    algorithm: "AFLO",
    network: "6G",
  });

  const [rawData, setRawData] = useState([]);
  const [droneData, setDroneData] = useState([]);
  const [compare, setCompare] = useState(null);
  const [heatOn, setHeatOn] = useState(true);

  const [simulationRunning, setSimulationRunning] = useState(false);

  // Load CSV once
  useEffect(() => {
    Papa.parse("/drone_telemetry_10000.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: (res) => {
        const cleaned = res.data
          .filter((d) => d.latitude && d.longitude)
          .map((d) => ({
            ...d,
            battery_percent: d.battery_percent ?? 0,
            signal_strength_dbm: d.signal_strength_dbm ?? -100,
            network_load_mbps: d.network_load_mbps ?? 0,
            x: d.longitude,
            y: d.latitude,
            z: 0,
          }));
        setRawData(cleaned);
      },
    });
  }, []);

  // animate only AFTER simulation is run
  useEffect(() => {
    if (!simulationRunning) return;
    if (!rawData.length) return;

    let index = 0;
    const interval = setInterval(() => {
      setDroneData((prev) => {
        if (index >= rawData.length) {
          clearInterval(interval);
          return prev;
        }
        const next = rawData[index];
        index++;
        return [...prev, next].slice(-50);
      });
    }, 500);

    return () => clearInterval(interval);
  }, [simulationRunning, rawData]);

  // RUN SIMULATION
  const run = (newCfg) => {
    setConfig(newCfg);
    setSimulationRunning(true);

    const cmp = {
      "5G": runSimulation({ ...newCfg, network: "5G" }),
      "6G": runSimulation({ ...newCfg, network: "6G" }),
    };

    setCompare(cmp);
  };

  return (
    <div className="app">

      <div className="card topbar">
        <h2>AFLO — Drone Energy Simulator (5G vs 6G)</h2>
        <div>Adaptive Federated Lemurs Optimization Research Panel</div>
      </div>

      <div className="card panel">
        <ControlPanel initial={config} onRun={run} />
        <div className="toggle">
          <input
            type="checkbox"
            checked={heatOn}
            onChange={(e) => setHeatOn(e.target.checked)}
          />
          <span>Show Heatmap</span>
        </div>
      </div>

      <div className="card map-card">
        <MapView droneData={droneData} heatmapOn={heatOn} />
      </div>

      <div className="card charts-card">
        <ChartsPanel droneData={droneData} />
      </div>

      <div className="card comparison-card">
        <ComparisonPanel compare={compare} />
      </div>

    </div>
  );
}
