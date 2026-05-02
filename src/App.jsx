import { useState, useRef } from "react";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import Graph from "./components/Graph";
import { optimize } from "./api";
import "./App.css";

// ── Improved random placement ─────────────────────────────────────
// Stratified scatter across India's bounding box so points are
// spread out rather than clustered. Counts are randomised within
// min/max with a ~3-4:1 city-to-salesman ratio enforced.
function buildRandomPlacements() {
  // India rough bounding box
  const LAT_MIN = 8.5,  LAT_MAX = 35.5;
  const LNG_MIN = 68.5, LNG_MAX = 97.5;

  // Randomise counts within sensible ranges
  const numCities   = Math.floor(Math.random() * 8) + 5;   // 5–12
  const numSalesmen = Math.max(
    2,
    Math.min(4, Math.round(numCities / (Math.random() * 1.5 + 2.5))) // ratio 2.5–4
  );

  // Stratified grid scatter: divide the bbox into a grid, pick one
  // point per cell with a small jitter so they can't overlap.
  function stratifiedPoints(n, latMin, latMax, lngMin, lngMax) {
    const cols  = Math.ceil(Math.sqrt(n * ((lngMax - lngMin) / (latMax - latMin))));
    const rows  = Math.ceil(n / cols);
    const cellH = (latMax - latMin) / rows;
    const cellW = (lngMax - lngMin) / cols;

    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        cells.push({ r, c });
      }
    }
    // Shuffle cells and pick n
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    return cells.slice(0, n).map(({ r, c }) => [
      latMin + r * cellH + Math.random() * cellH * 0.8 + cellH * 0.1,
      lngMin + c * cellW + Math.random() * cellW * 0.8 + cellW * 0.1,
    ]);
  }

  // Use slightly different sub-regions so salesmen aren't co-located with cities
  const cities   = stratifiedPoints(numCities,   LAT_MIN, LAT_MAX, LNG_MIN, LNG_MAX);
  const salesmen = stratifiedPoints(numSalesmen, LAT_MIN + 2, LAT_MAX - 2, LNG_MIN + 2, LNG_MAX - 2);

  return { cities, salesmen };
}

export default function App() {
  const [cities,       setCities]       = useState([]);
  const [salesmen,     setSalesmen]     = useState([]);
  const [routes,       setRoutes]       = useState([]);
  const [history,      setHistory]      = useState([]);
  const [mode,         setMode]         = useState("city");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error,        setError]        = useState(null);

  const mapRef = useRef(null);   // gives access to mapRef.current.flyTo(coord)

  // ── Handlers ───────────────────────────────────────────────────
  const handleMapClick = (coord) => {
    if (routes.length > 0) return; // Disallow placing pins after optimization
    if (mode === "city") setCities((p) => [...p, coord]);
    else                 setSalesmen((p) => [...p, coord]);
  };

  const removeCity     = (i) => setCities((p)   => p.filter((_, j) => j !== i));
  const removeSalesman = (i) => setSalesmen((p) => p.filter((_, j) => j !== i));

  const flyToCity     = (coord) => mapRef.current?.flyTo(coord, 9);
  const flyToSalesman = (coord) => mapRef.current?.flyTo(coord, 9);

  const clear = () => {
    setCities([]); setSalesmen([]); setRoutes([]); setHistory([]); setError(null);
  };

  const randomize = () => {
    const { cities: c, salesmen: s } = buildRandomPlacements();
    setCities(c); setSalesmen(s); setRoutes([]); setHistory([]); setError(null);
    // Zoom to fit India
    mapRef.current?.flyTo([22, 82], 5);
  };

  const runOptimization = async () => {
    if (cities.length === 0 || salesmen.length === 0) return;
    setIsOptimizing(true);
    setError(null);
    try {
      const res = await optimize({
        salesmen: salesmen.map((s) => ({ x: s[0], y: s[1] })),
        cities:   cities.map((c)   => ({ x: c[0], y: c[1] })),
        generations:     80,
        population_size: 40,
      });
      setRoutes(res.data.routes  || []);
      setHistory(res.data.history || []);
    } catch (err) {
      console.error(err);
      setError("Optimization failed — is the backend running?");
    } finally {
      setIsOptimizing(false);
    }
  };

  const canOptimize = cities.length > 0 && salesmen.length > 0 && !isOptimizing;

  return (
    <>
      <Sidebar
        cities={cities}
        salesmen={salesmen}
        removeCity={removeCity}
        removeSalesman={removeSalesman}
        flyToCity={flyToCity}
        flyToSalesman={flyToSalesman}
        mode={mode}
        setMode={setMode}
        randomize={randomize}
        clear={clear}
        hasRoutes={routes.length > 0}
      />

      <div className="main-area">
        <div className="map-wrapper">
          <MapView
            ref={mapRef}
            cities={cities}
            salesmen={salesmen}
            routes={routes}
            onMapClick={handleMapClick}
            removeCity={removeCity}
            removeSalesman={removeSalesman}
          />
        </div>

        <div className="bottom-bar">
          <div className="graph-container">
            <div className="graph-heading">
              <span className="graph-heading-dot" />
              Fitness Curve
            </div>
            <Graph data={history} />
          </div>

          <div className="optimize-section">
            <div className="optimize-stats">
              <div className="stat-item">
                <span className="stat-dot city-dot" />
                {cities.length} {cities.length === 1 ? "City" : "Cities"}
              </div>
              <div className="stat-item">
                <span className="stat-dot salesman-dot" />
                {salesmen.length} {salesmen.length === 1 ? "Salesman" : "Salesmen"}
              </div>
              {error && (
                <div className="error-msg">⚠ {error}</div>
              )}
            </div>

            <button
              className={`btn-optimize ${isOptimizing ? "optimizing" : ""}`}
              onClick={runOptimization}
              disabled={!canOptimize}
            >
              {isOptimizing ? (
                <><span className="spinner" /> Optimizing…</>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Optimize Routes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}