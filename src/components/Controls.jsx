export default function Controls({
  mode,
  setMode,
  randomize,
  onOptimize,
  clear,
}) {
  return (
    <div style={{ padding: "10px", display: "flex", gap: "10px" }}>
      
      <button
        onClick={() => setMode("city")}
        style={{ background: mode === "city" ? "#3b82f6" : "#334155" }}
      >
        Cities
      </button>

      <button
        onClick={() => setMode("salesman")}
        style={{ background: mode === "salesman" ? "#10b981" : "#334155" }}
      >
        Salesmen
      </button>

      <button onClick={randomize} style={{ background: "#f59e0b" }}>
        Random
      </button>

      <button onClick={onOptimize} style={{ background: "#22c55e" }}>
        Optimize
      </button>

      <button onClick={clear} style={{ background: "#ef4444" }}>
        Clear
      </button>
    </div>
  );
}