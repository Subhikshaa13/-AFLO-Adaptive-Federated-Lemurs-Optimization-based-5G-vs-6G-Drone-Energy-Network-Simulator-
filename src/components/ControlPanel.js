import React, { useState } from "react";

export default function ControlPanel({ initial, onRun }) {
  const [cfg, setCfg] = useState(initial);

  const update = (field, value) => {
    setCfg({ ...cfg, [field]: value });
  };

  return (
    <div>
      <h3>Simulation Controls</h3>

      <label>Drones</label>
      <input
        type="number"
        value={cfg.numDrones}
        onChange={(e) => update("numDrones", Number(e.target.value))}
      />

      <label>Area Size (m)</label>
      <input
        type="number"
        value={cfg.areaSize}
        onChange={(e) => update("areaSize", Number(e.target.value))}
      />

      <label>Node Density</label>
      <input
        type="number"
        step="0.0001"
        value={cfg.nodeDensity}
        onChange={(e) => update("nodeDensity", Number(e.target.value))}
      />

      <label>Algorithm</label>
      <select
        value={cfg.algorithm}
        onChange={(e) => update("algorithm", e.target.value)}
      >
        <option>Baseline</option>
        <option>QOBLO</option>
        <option>AFLO</option>
      </select>

      <label>Network</label>
      <select
        value={cfg.network}
        onChange={(e) => update("network", e.target.value)}
      >
        <option>5G</option>
        <option>6G</option>
      </select>

      <button onClick={() => onRun(cfg)}>Run Simulation</button>
    </div>
  );
}
