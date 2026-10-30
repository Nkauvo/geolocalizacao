import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary capturou:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', color: '#f87171', background: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2>Ops! Ocorreu um erro ao renderizar:</h2>
          <pre style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', overflow: 'auto', marginTop: '12px', color: '#fca5a5' }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '16px', padding: '10px 18px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
