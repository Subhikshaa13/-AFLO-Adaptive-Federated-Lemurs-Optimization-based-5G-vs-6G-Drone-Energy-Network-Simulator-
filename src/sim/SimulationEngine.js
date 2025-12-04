export function runSimulation(cfg) {
  const { numDrones, areaSize, nodeDensity, algorithm, network } = cfg;

  // base constants
  const baseBattery = 5000; // mAh
  const baseEnergyJ = 7200; // Joules baseline per mission

  // network factors
  const net = {
    "5G": {
      latency: 15,
      throughput: 300,
      energyFactor: 1.0,
    },
    "6G": {
      latency: 4,
      throughput: 1100,
      energyFactor: 0.62,    // 38% more energy efficient
    }
  }[network];

  // algorithm factors
  const algoFactor = {
    Baseline: 1.0,
    QOBLO: 0.85,
    AFLO: 0.68, // AFLO saves ~32% energy
  }[algorithm];

  const batteryDrain = baseEnergyJ * net.energyFactor * algoFactor;

  const efficiency = (1 - (batteryDrain / baseEnergyJ)) * 100;

  return {
    batteryDrain,
    energyEfficiency: efficiency,
    latency: net.latency,
    throughput: net.throughput
  };
}
