import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

// ── Clean flat pin — white badge label, no glow ──────────────────
function createPinIcon(label, bodyColor) {
  const isLong = label.length > 2;
  const w  = isLong ? 48 : 42;
  const h  = isLong ? 58 : 52;
  const cx = w / 2;
  const cy = h * 0.33;  // circle centre (upper third of pin)
  const r  = w * 0.30;  // badge radius

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <!-- ground shadow -->
    <ellipse cx="${cx}" cy="${h - 2}" rx="${w * 0.26}" ry="3" fill="rgba(0,0,0,0.32)"/>
    <!-- pin body (teardrop) -->
    <path d="M${cx},${h - 4}
             C${cx},${h - 4} ${w * 0.1},${cy + r * 1.5} ${w * 0.1},${cy}
             A${r * 1.3},${r * 1.3} 0 0 1 ${w * 0.9},${cy}
             C${w * 0.9},${cy + r * 1.5} ${cx},${h - 4} ${cx},${h - 4} Z"
          fill="${bodyColor}"/>
    <!-- white circle badge -->
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/>
    <!-- coloured label -->
    <text x="${cx}" y="${cy + 4.5}"
          text-anchor="middle"
          font-family="Inter,system-ui,sans-serif"
          font-size="${isLong ? 10.5 : 12}"
          font-weight="800"
          fill="${bodyColor}"
          letter-spacing="-0.5">${label}</text>
  </svg>`;

  return L.divIcon({
    className: "",
    html: `<div style="cursor:pointer">${svg}</div>`,
    iconSize:      [w, h],
    iconAnchor:    [cx, h],
    tooltipAnchor: [0, -(h + 4)],
  });
}

const ROUTE_COLORS = [
  "#a855f7", // Purple
  "#22c55e", // Green
  "#ec4899", // Pink
  "#eab308", // Yellow
  "#f97316", // Orange
  "#ef4444", // Red
  "#d946ef", // Fuchsia
];

function ClickHandler({ onMapClick }) {
  useMapEvents({ click(e) { onMapClick([e.latlng.lat, e.latlng.lng]); } });
  return null;
}

function CursorController() {
  const map = useMap();
  useEffect(() => {
    map.getContainer().style.cursor = "crosshair";
  }, [map]);
  return null;
}

// Expose flyTo to parent via ref
function FlyController({ flyRef }) {
  const map = useMap();
  useEffect(() => {
    flyRef.current = (coord, zoom = 9) => {
      map.flyTo(coord, zoom, { duration: 0.9 });
    };
  }, [map, flyRef]);
  return null;
}

// ── MapView ───────────────────────────────────────────────────────
const MapView = forwardRef(function MapView(
  { cities = [], salesmen = [], routes = [], onMapClick, removeCity, removeSalesman },
  ref
) {
  const flyRef = useRef(null);

  // Expose flyTo to parent
  useImperativeHandle(ref, () => ({
    flyTo: (coord, zoom) => flyRef.current?.(coord, zoom),
  }));

  return (
    <MapContainer
      center={[20, 78]}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
    >
      {/* CartoDB Dark All — dark background with readable white labels and borders */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        maxZoom={19}
      />

      <ClickHandler onMapClick={onMapClick} />
      <CursorController />
      <FlyController flyRef={flyRef} />

      {/* City pins */}
      {cities.map((c, i) => {
        const pinColor = "#2563eb"; // Always keep cities blue


        return (
          <Marker
            key={`c-${i}`}
            position={c}
            icon={createPinIcon(`C${i + 1}`, pinColor)}
            eventHandlers={{
              click: (e) => { L.DomEvent.stopPropagation(e); removeCity(i); },
            }}
          >
            <Tooltip direction="top" opacity={1}>
              <div style={{ minWidth: 130 }}>
                <div style={{ fontWeight: 700, color: pinColor, marginBottom: 4, fontSize: 14 }}>
                  City C{i + 1}
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>
                  {c[0].toFixed(4)}°N &nbsp;{c[1].toFixed(4)}°E
                </div>
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                  Click pin to remove
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}

      {/* Salesman pins */}
      {salesmen.map((s, i) => {
        const pinColor = ROUTE_COLORS[i % ROUTE_COLORS.length];
        return (
          <Marker
            key={`s-${i}`}
            position={s}
            icon={createPinIcon(`S${i + 1}`, pinColor)}
            eventHandlers={{
              click: (e) => { L.DomEvent.stopPropagation(e); removeSalesman(i); },
            }}
          >
            <Tooltip direction="top" opacity={1}>
              <div style={{ minWidth: 130 }}>
                <div style={{ fontWeight: 700, color: pinColor, marginBottom: 4, fontSize: 14 }}>
                  Salesman S{i + 1}
                </div>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>
                  {s[0].toFixed(4)}°N &nbsp;{s[1].toFixed(4)}°E
                </div>
                <div style={{ color: "#64748b", fontSize: 11, marginTop: 4 }}>
                  Click pin to remove
                </div>
              </div>
            </Tooltip>
          </Marker>
        );
      })}

      {/* Routes */}
      {routes.map((r, i) => {
        const sIndex = parseInt(r.salesman.substring(1)) || 0;
        const routeColor = ROUTE_COLORS[sIndex % ROUTE_COLORS.length];
        return (
          <Polyline
            key={i}
            positions={r.path.map((p) => p.coord)}
            color={routeColor}
            weight={3.5}
            opacity={0.88}
          />
        );
      })}
    </MapContainer>
  );
});

export default MapView;