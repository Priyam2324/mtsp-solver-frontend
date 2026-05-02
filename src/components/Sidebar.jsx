export default function Sidebar({
  cities, salesmen,
  removeCity, removeSalesman,
  flyToCity, flyToSalesman,
  mode, setMode,
  randomize, clear,
  hasRoutes,
}) {
  const isCity = mode === "city";

  return (
    <div className="sidebar">

      {/* ── Branding ── */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                 stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83
                       M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
          <div>
            <div className="sidebar-title">MTSP Solver</div>
            <div className="sidebar-subtitle">Route Optimizer</div>
          </div>
        </div>
      </div>

      {/* ── Placement Mode ── */}
      <div className="mode-section">
        <div className="section-heading">
          <span className="sh-dot"/>
          <span className="sh-label">Placement Mode</span>
          <span className="sh-line"/>
        </div>

        <div className="mode-toggle">
          <button
            id="mode-city"
            className={`mode-btn${isCity ? " mode-btn--city" : ""}`}
            onClick={() => setMode("city")}
          >
            <span className="mode-swatch mode-swatch--city"/>
            City
          </button>
          <button
            id="mode-salesman"
            className={`mode-btn${!isCity ? " mode-btn--salesman" : ""}`}
            onClick={() => setMode("salesman")}
          >
            <span className="mode-swatch mode-swatch--salesman"/>
            Salesman
          </button>
        </div>

        <div className={`mode-hint mode-hint--${isCity ? "city" : "salesman"}`}>
          {!hasRoutes && <span className="hint-pulse"/>}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {hasRoutes 
            ? "Clear all to place more pins" 
            : `Click map to add ${isCity ? "a city (C)" : "a salesman (S)"}`
          }
        </div>
      </div>

      {/* ── Lists ── */}
      <div className="sidebar-lists">

        {/* Cities */}
        <div className="list-section">
          <div className="section-heading">
            <span className="sh-dot sh-dot--city"/>
            <span className="sh-label">Cities</span>
            <span className="sh-line"/>
            <span className="count-badge count-badge--city">{cities.length}</span>
          </div>
          <div className="pin-list">
            {cities.length === 0
              ? <div className="empty-state">No cities placed yet</div>
              : cities.map((c, i) => (
                <div key={i} className="pin-item"
                     onClick={() => flyToCity(c)} title="Click to fly to">
                  <span className="pin-badge pin-badge--city">C{i + 1}</span>
                  <span className="pin-coords">
                    {c[0].toFixed(2)}°&nbsp;&nbsp;{c[1].toFixed(2)}°
                  </span>
                  <button className="pin-remove" title="Remove"
                          onClick={e => { e.stopPropagation(); removeCity(i); }}>
                    ×
                  </button>
                </div>
              ))
            }
          </div>
        </div>

        {/* Salesmen */}
        <div className="list-section">
          <div className="section-heading">
            <span className="sh-dot sh-dot--salesman"/>
            <span className="sh-label">Salesmen</span>
            <span className="sh-line"/>
            <span className="count-badge count-badge--salesman">{salesmen.length}</span>
          </div>
          <div className="pin-list">
            {salesmen.length === 0
              ? <div className="empty-state">No salesmen placed yet</div>
              : salesmen.map((s, i) => (
                <div key={i} className="pin-item"
                     onClick={() => flyToSalesman(s)} title="Click to fly to">
                  <span className="pin-badge pin-badge--salesman">S{i + 1}</span>
                  <span className="pin-coords">
                    {s[0].toFixed(2)}°&nbsp;&nbsp;{s[1].toFixed(2)}°
                  </span>
                  <button className="pin-remove" title="Remove"
                          onClick={e => { e.stopPropagation(); removeSalesman(i); }}>
                    ×
                  </button>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="sidebar-actions">
        <div className="section-heading">
          <span className="sh-dot"/>
          <span className="sh-label">Actions</span>
          <span className="sh-line"/>
        </div>

        <button id="btn-random" className="btn-action btn-random" onClick={randomize}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>
          </svg>
          Random Placement
        </button>

        <button id="btn-clear" className="btn-action btn-clear" onClick={clear}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
          </svg>
          Clear All
        </button>
      </div>
    </div>
  );
}