import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"

// GLOBAL ERROR TRAP for debugging blank screens.
//
// IMPORTANT: This must NOT touch the #root element. React's createRoot owns
// #root and keeps an internal fiber tree referencing its live DOM nodes.
// Overwriting root.innerHTML here destroys those nodes, and React then crashes
// during its commit/unmount phase with:
//   "NotFoundError: Failed to execute 'removeChild' on 'Node'"
// which masks the real error. Instead we render the overlay into a separate,
// detached container appended to <body>, leaving React's tree intact.
const OVERLAY_ID = "cs-boot-error-overlay";

function showBootError(message: string, detail: string, stack?: string) {
  // Only show the first error — avoid stacking overlays for cascading errors.
  if (document.getElementById(OVERLAY_ID)) return;

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:2147483647;overflow:auto;background:rgba(10,10,15,0.85);";

  const panel = document.createElement("div");
  panel.style.cssText =
    "padding:20px;color:#ff4d4d;background:#1a1a1a;font-family:monospace;border:2px solid #ff4d4d;margin:20px;border-radius:8px;";

  const h1 = document.createElement("h1");
  h1.style.marginTop = "0";
  h1.textContent = "🚀 ClarityStack Boot Error";

  const msg = document.createElement("p");
  msg.innerHTML = "<strong>Message:</strong> ";
  msg.appendChild(document.createTextNode(message));

  const src = document.createElement("p");
  src.innerHTML = "<strong>Source:</strong> ";
  src.appendChild(document.createTextNode(detail));

  const pre = document.createElement("pre");
  pre.style.cssText =
    "background:#000;padding:10px;border-radius:4px;overflow:auto;white-space:pre-wrap;";
  pre.textContent = stack || "No stack trace";

  const btn = document.createElement("button");
  btn.textContent = "Reload Application";
  btn.style.cssText =
    "padding:10px 20px;background:#ff4d4d;color:white;border:none;border-radius:4px;cursor:pointer;";
  btn.addEventListener("click", () => window.location.reload());

  panel.append(h1, msg, src, pre, btn);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

window.onerror = function (message, source, lineno, colno, error) {
  showBootError(String(message), `${source}:${lineno}:${colno}`, error?.stack);
  return false;
};

// Log unhandled promise rejections for debugging, but do NOT show the full-screen
// overlay — these are often benign (aborted fetches, etc.) and were silent before,
// so surfacing them as a boot error would be too aggressive and change working behavior.
window.addEventListener("unhandledrejection", (event) => {
  console.error("[ClarityStack] Unhandled promise rejection:", event.reason);
});

createRoot(document.getElementById("root")!).render(<App />)
