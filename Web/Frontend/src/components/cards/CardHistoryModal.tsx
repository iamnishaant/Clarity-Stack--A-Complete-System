import { useEffect, useState } from "react";
import { getCardHistory } from "@/lib/api";
import { KnowledgeCardData } from "./KnowledgeCard";
import { X, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryEntry {
  id: string;
  version: string;
  title: string;
  summary: string;
  created_at: string;
  status: string;
}

interface CardHistoryModalProps {
  card: KnowledgeCardData;
  onClose: () => void;
}

export function CardHistoryModal({ card, onClose }: CardHistoryModalProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    getCardHistory(card.project_id, card.id)
      .then(setHistory)
      .catch((err: any) => setError(err.message ?? "Failed to load history."))
      .finally(() => setLoading(false));
  }, [card.id, card.project_id]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-md p-6 flex flex-col gap-4 max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-neon-cyan" />
            <h2 className="text-sm font-semibold text-foreground">Version History</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground truncate">{card.title}</p>

        {/* Timeline */}
        <div className="overflow-y-auto flex flex-col gap-0 pr-1">
          {loading && (
            <p className="text-xs text-muted-foreground py-4 text-center">Loading…</p>
          )}
          {error && (
            <p className="text-xs text-destructive py-4 text-center">{error}</p>
          )}
          {!loading && !error && history.length === 0 && (
            <p className="text-xs text-muted-foreground py-4 text-center">No history found.</p>
          )}
          {history.map((entry, idx) => {
            const isOpen = expanded === entry.id;
            const isLatest = idx === 0;
            return (
              <div key={entry.id} className="flex gap-3">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full mt-1 shrink-0 border",
                    isLatest
                      ? "bg-neon-cyan border-neon-cyan"
                      : "bg-muted border-muted-foreground/40"
                  )} />
                  {idx < history.length - 1 && (
                    <div className="w-px flex-1 bg-muted-foreground/20 my-1" />
                  )}
                </div>

                {/* Entry */}
                <div className="flex-1 pb-4">
                  <button
                    className="w-full text-left flex items-center justify-between group"
                    onClick={() => setExpanded(isOpen ? null : entry.id)}
                  >
                    <div>
                      <span className={cn(
                        "text-xs font-mono font-semibold",
                        isLatest ? "text-neon-cyan" : "text-muted-foreground"
                      )}>
                        {entry.version}
                      </span>
                      {isLatest && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                          current
                        </span>
                      )}
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {new Date(entry.created_at).toLocaleString()}
                      </p>
                    </div>
                    {isOpen
                      ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                      : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                  </button>

                  {isOpen && (
                    <div className="mt-2 p-3 rounded-lg bg-muted/20 border border-muted/30 flex flex-col gap-2">
                      <p className="text-xs font-medium text-foreground">{entry.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{entry.summary}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
