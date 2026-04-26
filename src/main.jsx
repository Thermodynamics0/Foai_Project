import React, { Component } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          height:'100vh', background:'#060910', color:'#c2a072', fontFamily:'monospace', gap:16, padding:32, textAlign:'center'
        }}>
          <div style={{ fontSize:'3rem', opacity:0.3 }}>⚠</div>
          <h2 style={{ fontSize:'1rem', letterSpacing:'0.1em', textTransform:'uppercase' }}>Something went wrong</h2>
          <p style={{ fontSize:'0.75rem', color:'rgba(194,160,114,0.5)', maxWidth:400 }}>{this.state.error.message}</p>
          <button onClick={() => window.location.reload()}
            style={{ marginTop:8, padding:'8px 20px', background:'linear-gradient(135deg,#d6bb80,#c2a072)', color:'#060910',
              border:'none', borderRadius:6, cursor:'pointer', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em' }}>
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
