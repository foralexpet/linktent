import React, { useState } from 'react';
import { IntentProvider, IntentLink } from 'linktent';

export default function App() {
  const [logs, setLogs] = useState<string[]>(['System initialized. Swipe mouse towards links...']);
  const [prefetched, setPrefetched] = useState<Record<string, boolean>>({});

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
          This live page is driven directly by <strong>linktent</strong> imported from the repository source!
          Sweep your cursor towards a box to trigger prefetching <em>before</em> hover.
        </p>
      </header>

      <div style={styles.contentLayout}>
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

        <div style={styles.sidebar}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Operations</h2>
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
  grid: {
    backgroundColor: '#161b22',
    border: '1px solid #30363d',
    borderRadius: '8px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '24px',
    padding: '24px',
    height: '550px',
    boxSizing: 'border-box'
  },
  card: {
    backgroundColor: 'rgba(22, 27, 34, 0.8)',
    border: '1px dashed #30363d',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justify-content: 'center',
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
    paddingBottom: '8px'
  },
  button: {
    backgroundColor: '#21262d',
    border: '1px solid #30363d',
    color: '#c9d1d9',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    fontWeight: 600
  },
  logBox: {
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '4px',
    padding: '8px',
    height: '280px',
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
