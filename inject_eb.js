const fs = require('fs');

const errorBoundaryCode = `
import React from 'react';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("ErrorBoundary caught an error", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'white', background: 'red' }}>
          <h2>Oops, the app crashed!</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12 }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: 12, marginTop: 10 }}>
            {this.state.info && this.state.info.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
`;

let app = fs.readFileSync('crm/src/App.jsx', 'utf8');
if (!app.includes('class ErrorBoundary')) {
    app = app.replace(
        "import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';",
        errorBoundaryCode + "\nimport { HashRouter, Routes, Route, Navigate } from 'react-router-dom';"
    );
    app = app.replace(
        "<AuthProvider>",
        "<ErrorBoundary>\n    <AuthProvider>"
    );
    app = app.replace(
        "</AuthProvider>",
        "</AuthProvider>\n    </ErrorBoundary>"
    );
    fs.writeFileSync('crm/src/App.jsx', app, 'utf8');
}

// And let's fix the badge properly so I can prove the update works.
let overview = fs.readFileSync('crm/src/pages/Overview.jsx', 'utf8');
overview = overview.replace(
    "<h1 style={{ color: 'var(--ouro)', marginBottom: 30 }}>Dashboard Executivo</h1>",
    "<h1 style={{ color: 'var(--ouro)', marginBottom: 30 }}>Dashboard Executivo <span style={{ fontSize: 12, color: 'var(--cinza)' }}>v1.0.4</span></h1>"
);
fs.writeFileSync('crm/src/pages/Overview.jsx', overview, 'utf8');

console.log('ErrorBoundary injected and badge updated to v1.0.4');
