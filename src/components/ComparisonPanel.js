import React from "react";

export default function ComparisonPanel({ compare }) {

  if (!compare) {
    return <div className="placeholder">Run simulation to generate comparison.</div>;
  }

  const g5 = compare["5G"];
  const g6 = compare["6G"];

  const improvement = ((g5.batteryDrain - g6.batteryDrain) / g5.batteryDrain * 100).toFixed(1);
  const latencyGain = ((g5.latency - g6.latency) / g5.latency * 100).toFixed(1);
  const throughputGain = ((g6.throughput - g5.throughput) / g5.throughput * 100).toFixed(1);

  return (
    <div className="comparison-wrapper">
      <h3 className="title">📡 5G vs 6G Network Comparison Summary</h3>

      <div className="comparison-grid">

        <div className="metric-card">
          <h4>🔋 Battery Drain</h4>
          <p>{g5.batteryDrain.toFixed(2)} J → {g6.batteryDrain.toFixed(2)} J</p>
          <span className="highlight">6G is {improvement}% more energy efficient</span>
        </div>

        <div className="metric-card">
          <h4>⚡ Energy Efficiency</h4>
          <p>{g5.energyEfficiency.toFixed(2)}% → {g6.energyEfficiency.toFixed(2)}%</p>
        </div>

        <div className="metric-card">
          <h4>📶 Throughput</h4>
          <p>{g5.throughput} Mbps → {g6.throughput} Mbps</p>
          <span className="highlight">{throughputGain}% higher throughput</span>
        </div>

        <div className="metric-card">
          <h4>⏱ Latency</h4>
          <p>{g5.latency} ms → {g6.latency} ms</p>
          <span className="highlight">{latencyGain}% faster communication</span>
        </div>

      </div>

      <p className="summary-text">
        📘 <b>Summary:</b> 6G provides superior energy efficiency, lower latency, higher throughput, 
        and significantly optimized battery consumption when paired with AFLO.
      </p>
    </div>
  );
}
