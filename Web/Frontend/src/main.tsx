import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

// GLOBAL ERROR TRAP for debugging blank screens
window.onerror = function(message, source, lineno, colno, error) {
  const root = document.getElementById("root");
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; color: #ff4d4d; background: #1a1a1a; font-family: monospace; border: 2px solid #ff4d4d; margin: 20px; border-radius: 8px;">
        <h1 style="margin-top: 0;">🚀 ClarityStack Boot Error</h1>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Source:</strong> ${source}:${lineno}:${colno}</p>
        <pre style="background: #000; padding: 10px; border-radius: 4px; overflow: auto;">${error?.stack || 'No stack trace'}</pre>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #ff4d4d; color: white; border: none; border-radius: 4px; cursor: pointer;">Reload Application</button>
      </div>
    `;
  }
  return false;
};

createRoot(document.getElementById("root")!).render(<App />)
