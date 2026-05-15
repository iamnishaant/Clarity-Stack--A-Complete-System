import { useEffect, useRef, useState } from "react";
import { GitMerge, ExternalLink, RefreshCw, Wifi, WifiOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";

const UML_SERVICE_URL = "http://localhost:5175";

type ConnectionStatus = "checking" | "online" | "offline";

export default function UMLDashboard() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<ConnectionStatus>("checking");
  const [refreshKey, setRefreshKey] = useState(0);

  // Probe the UML service health every 3s until it responds
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const probe = async () => {
      try {
        const res = await fetch(`${UML_SERVICE_URL}`, {
          method: "HEAD",
          mode: "no-cors", // Vite dev server — just checking reachability
          signal: AbortSignal.timeout(2000),
        });
        setStatus("online");
        clearInterval(interval);
      } catch {
        setStatus("offline");
      }
    };

    probe();
    interval = setInterval(probe, 3000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const handleIframeLoad = () => {
    const srsContext = sessionStorage.getItem('uml_srs_context');
    if (srsContext && iframeRef.current?.contentWindow) {
      try {
        const payload = JSON.parse(srsContext);
        if (Date.now() - payload.timestamp < 3600000) { // 1 hour max
          iframeRef.current.contentWindow.postMessage({
            type: 'SRS_CONTEXT',
            payload
          }, '*');
          // Clear it so it doesn't get resent continuously on manual reloads
          sessionStorage.removeItem('uml_srs_context');
        }
      } catch (e) {
        console.error("Failed to parse uml_srs_context", e);
      }
    }
  };

  const handleRefresh = () => {
    setStatus("checking");
    setRefreshKey((k) => k + 1);
    if (iframeRef.current) {
      iframeRef.current.src = UML_SERVICE_URL;
    }
  };

  return (
    <MainLayout fullWidth={true}>
      <div className="flex flex-col h-full w-full">
        {/* ── Header Bar ── */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-glass/50 shrink-0 bg-background/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <GitMerge className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm text-foreground leading-tight">UML-Clarity</h1>
              <p className="text-[10px] text-muted-foreground">Diagram Intelligence Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/30 border border-border text-xs">
              {status === "checking" && (
                <>
                  <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">Connecting…</span>
                </>
              )}
              {status === "online" && (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-medium">Online</span>
                </>
              )}
              {status === "offline" && (
                <>
                  <WifiOff className="w-3 h-3 text-destructive" />
                  <span className="text-destructive font-medium">Offline</span>
                </>
              )}
            </div>

            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleRefresh} title="Refresh UML service">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>

            <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => window.open(UML_SERVICE_URL, "_blank")} title="Open in new tab">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* ── Main area ── */}
        <div className="flex-1 relative overflow-hidden bg-slate-950">
          {status === "offline" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-background/80 backdrop-blur-sm z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center">
                <WifiOff className="w-9 h-9 text-violet-400" />
              </div>
              <div className="text-center max-w-sm">
                <h2 className="text-xl font-bold mb-2">UML-Clarity is not running</h2>
                <p className="text-muted-foreground text-sm mb-1">
                  The UML service frontend isn't reachable at <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-violet-400">{UML_SERVICE_URL}</code>
                </p>
              </div>
              <Button onClick={handleRefresh} className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 border-0 text-white hover:opacity-90">
                <RefreshCw className="w-4 h-4" />
                Retry Connection
              </Button>
            </div>
          )}

          {status === "checking" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/60 backdrop-blur-sm z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-600/20 border border-violet-500/30 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
              </div>
              <p className="text-sm text-muted-foreground">Connecting to UML-Clarity…</p>
            </div>
          )}

          <iframe
            key={refreshKey}
            ref={iframeRef}
            src={UML_SERVICE_URL}
            onLoad={handleIframeLoad}
            className="w-full h-full border-0"
            title="UML-Clarity Diagram Engine"
            allow="clipboard-write"
            style={{ display: status === "offline" ? "none" : "block" }}
          />
        </div>
      </div>
    </MainLayout>
  );
}
