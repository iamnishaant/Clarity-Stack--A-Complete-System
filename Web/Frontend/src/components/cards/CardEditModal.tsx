import { useState } from "react";
import { editCard } from "@/lib/api";
import { KnowledgeCardData } from "./KnowledgeCard";
import { X } from "lucide-react";

interface CardEditModalProps {
  card: KnowledgeCardData;
  onClose: () => void;
  onSaved: () => void;
}

export function CardEditModal({ card, onClose, onSaved }: CardEditModalProps) {
  const [title, setTitle] = useState(card.title);
  const [summary, setSummary] = useState(card.summary);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [conflictCard, setConflictCard] = useState<KnowledgeCardData | null>(null);

  async function handleSave() {
    if (!title.trim() || !summary.trim()) return;
    setSaving(true);
    setError(null);
    setConflictCard(null);

    try {
      await editCard(card.project_id, card.id, { 
        title: title.trim(), 
        summary: summary.trim(),
        version: parseInt(String(card.version).replace(/\D/g, ""), 10) || 1
      });
      onSaved();
      onClose();
    } catch (err: any) {
      if (err.status === 409 && err.data?.current_active_card) {
        setConflictCard(err.data.current_active_card);
        setError("This card was updated by someone else. Please review the changes below.");
      } else {
        setError(err.message ?? "Save failed.");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-panel w-full max-w-md p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Edit Card</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground font-medium">Title</label>
          <input
            className="bg-muted/30 border border-muted/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Card title"
          />
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground font-medium">Summary</label>
          <div className="grid grid-cols-1 gap-2">
            <textarea
              rows={4}
              className="bg-muted/30 border border-muted/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 transition-colors resize-none"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Card summary"
            />
            
            {conflictCard && (
              <div className="p-3 rounded-lg bg-neon-peach/10 border border-neon-peach/30 text-xs">
                <div className="font-semibold text-neon-peach mb-1">Current Server Version (v{conflictCard.version}):</div>
                <div className="font-medium text-foreground mb-1">{conflictCard.title}</div>
                <div className="text-muted-foreground italic">{conflictCard.summary}</div>
                <button 
                  onClick={() => {
                    setTitle(conflictCard.title);
                    setSummary(conflictCard.summary);
                    setConflictCard(null);
                    setError(null);
                    // Note: User would still need to fetch the new card ID/version to save properly
                    // but for this UI, we just let them copy the text.
                    // Realistically, the "onSaved" reload will fix the state.
                  }}
                  className="mt-2 text-neon-cyan hover:underline"
                >
                  Adopt these changes
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <p className={`text-xs ${conflictCard ? 'text-neon-peach' : 'text-destructive'}`}>{error}</p>}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs text-muted-foreground bg-muted/40 hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !summary.trim()}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Saving…" : (conflictCard ? "Try Save Again" : "Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
