import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '24px',
          background: '#090d16',
          color: '#f43f5e',
          fontFamily: 'monospace',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            maxWidth: '600px',
            background: 'rgba(9, 13, 26, 0.8)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(244, 63, 94, 0.15)'
          }}>
            <h1 style={{ margin: '0 0 12px 0', fontSize: '18px', borderBottom: '1px solid rgba(244, 63, 94, 0.2)', paddingBottom: '8px' }}>
              ⚠️ Application Render Failure
            </h1>
            <p style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: 'bold' }}>
              Error: {this.state.error?.toString()}
            </p>
            <pre style={{
              background: '#04060e',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '11px',
              overflow: 'auto',
              maxHeight: '300px',
              color: '#94a3b8',
              border: '1px solid #1e293b'
            }}>
              {this.state.error?.stack}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                marginTop: '16px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Force Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

