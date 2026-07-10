import React, { useState, useRef, useEffect } from 'react';
import { IntentProvider, IntentLink } from 'linktent';

export default function App() {
  const [logs, setLogs] = useState<string[]>(['System initialized. Swipe mouse towards links...']);
  const [prefetched, setPrefetched] = useState<Record<string, boolean>>({});
  const [metrics, setMetrics] = useState({ vx: 0, vy: 0, px: 0, py: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; last: number | null }>({ x: 0, y: 0, last: null });

  const addLog = (message: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 49)]);
  };

  const handlePrefetch = (id: string, name: string) => {
    if (prefetched[id]) return;
    setPrefetched((prev) => ({ ...prev, [id]: true }));
    addLog(`Predictive Trigger: Prefetching data for ${name}! 🚀`);
  };

  const handleReset = () => {
    setPrefetched({});
    setLogs(['States reset.']);
    setMetrics({ vx: 0, vy: 0, px: 0, py: 0 });
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Setup Canvas Sizing & Drawing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const now = e.timeStamp;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (mouseRef.current.last === null) {
      mouseRef.current = { x: curX, y: curY, last: now };
      return;
    }

    const dt = now - mouseRef.current.last;
    if (dt <= 0) {
      mouseRef.current.x = curX;
      mouseRef.current.y = curY;
      return;
    }

    const vx = (curX - mouseRef.current.x) / dt;
    const vy = (curY - mouseRef.current.y) / dt;
    mouseRef.current = { x: curX, y: curY, last: now };

    const px = curX + vx * 300;
    const py = curY + vy * 300;

    setMetrics({ vx, vy, px, py });

    // Render calculations to visual canvas overlay
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw prediction vector line
    ctx.beginPath();
    ctx.moveTo(curX, curY);
    ctx.lineTo(px, py);
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.stroke();

    // Draw cursor point
    ctx.beginPath();
    ctx.arc(curX, curY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#58a6ff';
    ctx.fill();

    // Draw predicted lookahead circle
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff7b72';
    ctx.fill();
  };

  const linkCards = [
    { id: '1', name: 'Product A' },
    { id: '2', name: 'Product B' },
    { id: '3', name: 'Product C' },
    { id: '4', name: 'Product D' },
    { id: '5', name: 'Product E' },
    { id: '6', name: 'Product F' },
    { id: '7', name: 'Product G' },
    { id: '8', name: 'Product H' },
    { id: '9', name: 'Product I' }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>predictive react prefetch demo 🎪</h1>
        <p style={styles.subtitle}>
          Driven directly by the local React source code. Swing your mouse to see the active trajectory line and lookahead collision points!
        </p>
      </header>

      <div style={styles.contentLayout}>
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          style={styles.gridContainer}
        >
          <canvas ref={canvasRef} style={styles.canvas} />
          <IntentProvider>
            <div style={styles.grid}>
              {linkCards.map((card) => (
                <IntentLink
                  key={card.id}
                  href={`#${card.id}`}
                  prefetchFn={() => handlePrefetch(card.id, card.name)}
                  style={{
                    ...styles.card,
                    ...(prefetched[card.id] ? styles.cardPrefetched : {})
                  }}
                >
                  <span style={{
                    ...styles.badge,
                    ...(prefetched[card.id] ? styles.badgePrefetched : {})
                  }}>
                    {prefetched[card.id] ? 'Prefetched' : 'Idle'}
                  </span>
                  <span style={styles.cardTitle}>{card.name}</span>
                </IntentLink>
              ))}
            </div>
          </IntentProvider>
        </div>

        <div style={styles.sidebar}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Metrics Simulation</h2>
            <div style={styles.statRow}>
              <span>Velocity X:</span>
              <span style={styles.statVal}>{metrics.vx.toFixed(2)} px/ms</span>
            </div>
            <div style={styles.statRow}>
              <span>Velocity Y:</span>
              <span style={styles.statVal}>{metrics.vy.toFixed(2)} px/ms</span>
            </div>
            <div style={styles.statRow}>
              <span>Projected Target:</span>
              <span style={styles.statVal}>{Math.round(metrics.px)}, {Math.round(metrics.py)}</span>
            </div>
            <button style={styles.button} onClick={handleReset}>Reset States</button>
          </div>

          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Prefetch Console Logs</h2>
            <div style={styles.logBox}>
              {logs.map((log, index) => (
                <div key={index} style={{
                  ...styles.logEntry,
                  ...(log.includes('Predictive Trigger') ? styles.logPrefetch : {})
                }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#0d1117',
    color: '#c9d1d9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minHeight: '100vh',
    padding: '24px',
    boxSizing: 'border-box'
  },
  header: {
    borderBottom: '1px solid #30363d',
    paddingBottom: '16px',
    marginBottom: '24px'
  },
  title: {
    color: '#ffffff',
    fontSize: '2rem',
    margin: 0
  },
  subtitle: {
    color: '#8b949e',
    fontSize: '1rem',
    margin: '8px 0 0'
  },
  contentLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '24px'
  },
  gridContainer: {
    position: 'relative',
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '8px',
    height: '550px',
    overflow: 'hidden'
  },
  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 10
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '24px',
    padding: '24px',
    height: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 5
  },
  card: {
    backgroundColor: 'rgba(22, 27, 34, 0.8)',
    border: '1px dashed #30363d',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    textDecoration: 'none',
    position: 'relative',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  },
  cardPrefetched: {
    borderColor: '#3fb950',
    color: '#3fb950',
    backgroundColor: 'rgba(63, 185, 80, 0.05)'
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: '1.1rem'
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    fontSize: '0.75rem',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: '#21262d',
    border: '1px solid #30363d',
    color: '#8b949e'
  },
  badgePrefetched: {
    backgroundColor: 'rgba(63, 185, 80, 0.15)',
    borderColor: '#3fb950',
    color: '#3fb950'
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  panel: {
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '8px',
    padding: '16px'
  },
  panelTitle: {
    color: '#ffffff',
    fontSize: '1.1rem',
    marginTop: 0,
    borderBottom: '1px solid #30363d',
    paddingBottom: '8px',
    marginBottom: '12px'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontFamily: 'monospace',
    fontSize: '0.9rem'
  },
  statVal: {
    color: '#58a6ff',
    fontWeight: 'bold'
  },
  button: {
    backgroundColor: '#21262d',
    border: '1px solid #30363d',
    color: '#c9d1d9',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 600,
    marginTop: '10px'
  },
  logBox: {
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '4px',
    padding: '8px',
    height: '240px',
    overflowY: 'auto',
    fontFamily: 'monospace',
    fontSize: '0.85rem'
  },
  logEntry: {
    color: '#8b949e',
    marginBottom: '6px',
    lineHeight: 1.4
  },
  logPrefetch: {
    color: '#3fb950',
    fontWeight: 'bold'
  }
};
