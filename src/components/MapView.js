import React, { useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

export default function MapView({ droneData = [], heatmapOn = true }) {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const trailRef = useRef([]);
  const heatLayerRef = useRef(null);

  // ---- INIT MAP ONCE ----
  useEffect(() => {
    if (!mapDivRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [13.0827, 80.2707],
      zoom: 12,
      preferCanvas: true, 
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    // FIX: Resize observer to prevent zero-width canvas
    new ResizeObserver(() => {
      map.invalidateSize(false);
    }).observe(mapDivRef.current);

    return () => map.remove();
  }, []);

  // ---- UPDATE MARKERS, TRAIL, HEATMAP ----
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Wait until map container has REAL width/height  
    const container = map.getContainer();
    if (!container || container.clientWidth === 0 || container.clientHeight === 0) return;

    // -------- SAFETY: CLEAN OLD LAYERS FIRST --------
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    trailRef.current.forEach((l) => map.removeLayer(l));
    trailRef.current = [];

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    // -------- STOP IF NO DATA --------
    if (!Array.isArray(droneData) || droneData.length < 2) return;

    // -------- MARKERS --------
    droneData.forEach((d) => {
      const m = L.circleMarker([d.latitude, d.longitude], {
        radius: 6,
        color: "cyan",
        fillColor: "#00FFFF",
        fillOpacity: 0.9,
      }).addTo(map);

      markersRef.current.push(m);
    });

    // -------- TRAIL --------
    const trailPoints = droneData.map((d) => [d.latitude, d.longitude]);
    const poly = L.polyline(trailPoints, {
      color: "#00e0ff",
      weight: 3,
      opacity: 0.7,
    }).addTo(map);
    trailRef.current.push(poly);

    // -------- HEATMAP (FULLY SAFE) --------
    if (heatmapOn && droneData.length >= 3) {
      const heatPoints = droneData.map((d) => [
        d.latitude,
        d.longitude,
        Math.max(0.1, d.battery_percent / 100),
      ]);

      // FINAL GUARD: Ensure no zero dimension issue
      if (map.getSize().x > 0 && map.getSize().y > 0) {
        heatLayerRef.current = L.heatLayer(heatPoints, {
          radius: 25,
          blur: 35,
          maxZoom: 17,
        }).addTo(map);
      }
    }

    // -------- FIT VIEW --------
    if (markersRef.current.length > 1) {
      const group = new L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.4));
    }

  }, [droneData, heatmapOn]);

  return (
    <div
      ref={mapDivRef}
      style={{ width: "100%", height: "100%", borderRadius: 12 }}
    />
  );
}
