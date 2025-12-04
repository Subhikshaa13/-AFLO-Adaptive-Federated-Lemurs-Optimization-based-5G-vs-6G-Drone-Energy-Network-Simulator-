import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

export default function HeatmapLayer({ points = [], intensityProp = "coverage" }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // transform points -> [lat, lng, intensity]
    // mapping same as MapView: center offset conversion
    const center = [13.0827, 80.2707];

    const heatPoints = (points || []).map(p => {
      const lat = center[0] + (p.y / 10000);
      const lng = center[1] + (p.x / 10000);
      // intensity normalized (0..1)
      const intensity = Math.min(1, (p[intensityProp] || 100) / 200);
      return [lat, lng, intensity];
    });

    const heat = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 40,
      maxZoom: 17,
      gradient: { 0.2: 'blue', 0.4: 'cyan', 0.6: 'lime', 0.8: 'orange', 1.0: 'red' }
    }).addTo(map);

    return () => {
      heat.remove();
    };
  }, [map, points, intensityProp]);

  return null;
}
