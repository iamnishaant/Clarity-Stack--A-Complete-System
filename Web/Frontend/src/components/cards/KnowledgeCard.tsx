import { useState } from "react";
import { cn } from '@/lib/utils';
import { CheckCircle, Lightbulb, FileText, Code, AlertTriangle, HelpCircle, Pencil, Trash2, Clock } from 'lucide-react';
import { deleteTemporalCard } from '@/lib/api';
import { CardEditModal } from './CardEditModal';
import { CardHistoryModal } from './CardHistoryModal';

export type CardType = 'decision' | 'insight' | 'action' | 'conflict' | 'risk' | 'architecture' | 'progress' | 'question' | 'general' | 'unknown';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface KnowledgeCardData {
  id: string;
  chat_id: string;
  chat_title: string;
  project_id: string;
  type: CardType;
  title: string;
  summary: string;
  tags: string[];
  confidence: ConfidenceLevel;
  version: string;
  status?: string;           // "active" | "superseded"
  previousCardId?: string;   // links to prior version
  created_at: string;
  updated_at: string;
}

const typeConfig: Record<CardType, { icon: typeof CheckCircle; color: string; bg: string; border: string; glow: string; label: string }> = {
  decision: {
    icon: CheckCircle,
    color: 'text-neon-cyan',
    bg: 'bg-neon-cyan/10',
    border: 'border-neon-cyan/50',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]',
    label: 'Decision',
  },
  insight: {
    icon: Lightbulb,
    color: 'text-neon-violet',
    bg: 'bg-neon-violet/10',
    border: 'border-neon-violet/50',
    glow: 'shadow-[0_0_15px_rgba(176,38,255,0.2)] group-hover:shadow-[0_0_25px_rgba(176,38,255,0.4)]',
    label: 'Insight',
  },
  action: {
    icon: FileText,
    color: 'text-neon-mint',
    bg: 'bg-neon-mint/10',
    border: 'border-neon-mint/50',
    glow: 'shadow-[0_0_15px_rgba(45,248,197,0.2)] group-hover:shadow-[0_0_25px_rgba(45,248,197,0.4)]',
    label: 'Action',
  },
  conflict: {
    icon: AlertTriangle,
    color: 'text-neon-peach',
    bg: 'bg-neon-peach/10',
    border: 'border-neon-peach/50',
    glow: 'shadow-[0_0_15px_rgba(255,122,89,0.2)] group-hover:shadow-[0_0_25px_rgba(255,122,89,0.4)]',
    label: 'Conflict',
  },
  risk: {
    icon: AlertTriangle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/50',
    glow: 'shadow-[0_0_15px_rgba(255,0,0,0.2)] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]',
    label: 'Risk',
  },
  architecture: {
    icon: Code,
    color: 'text-neon-cyan',
    bg: 'bg-neon-cyan/10',
    border: 'border-neon-cyan/50',
    glow: 'shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.4)]',
    label: 'Architecture',
  },
  progress: {
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/50',
    glow: 'shadow-[0_0_15px_rgba(74,222,128,0.2)] group-hover:shadow-[0_0_25px_rgba(74,222,128,0.4)]',
    label: 'Progress',
  },
  question: {
    icon: HelpCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/50',
    glow: 'shadow-[0_0_15px_rgba(251,191,36,0.2)] group-hover:shadow-[0_0_25px_rgba(251,191,36,0.4)]',
    label: 'Question',
  },
  general: {
    icon: FileText,
    color: 'text-slate-400',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/50',
    glow: 'shadow-none',
    label: 'General',
  },
  unknown: {
    icon: HelpCircle,
    color: 'text-muted-foreground',
    bg: 'bg-muted/20',
    border: 'border-muted/30',
    glow: 'shadow-none',
    label: 'Unknown',
  },
};

const confidenceColors: Record<ConfidenceLevel, string> = {
  high: 'text-neon-mint',
  medium: 'text-neon-peach',
  low: 'text-destructive',
};

interface KnowledgeCardProps {
  card: KnowledgeCardData;
  onClick?: (card: KnowledgeCardData) => void;
}

export function KnowledgeCard({ card, onClick }: KnowledgeCardProps) {
  const config = typeConfig[card.type] || typeConfig.general;
  const Icon = config.icon || FileText;

  const [showEdit, setShowEdit] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  function handleSaved() {
    window.location.reload();
  }

  return (
    <>
      <div
        onClick={() => onClick?.(card)}
        className={cn(
          "glass-panel p-4 cursor-pointer group relative transition-all duration-300",
          "animate-fade-in w-full",
          config.glow
        )}
      >
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          {/* History */}
          <button
            className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            onClick={(e) => { e.stopPropagation(); setShowHistory(true); }}
          >
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {/* Edit */}
          <button
            className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
            onClick={(e) => { e.stopPropagation(); setShowEdit(true); }}
          >
            <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {/* Delete */}
          <button
            className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-destructive/20 hover:text-destructive transition-colors"
            onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm("Delete this card?")) {
                try {
                  await deleteTemporalCard(card.id);
                  window.location.reload();
                } catch (err) {
                  console.error(err);
                }
              }
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

      {/* Type badge and source */}
      <div className="flex items-center gap-2 mb-2 pr-8">
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full border font-medium",
          config.bg,
          config.border,
          config.color
        )}>
          {config.label}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          from {card.chat_title}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground mb-2 text-sm leading-tight">
        {card.title}
      </h3>

      {/* Summary */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {card.summary}
      </p>

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {card.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground"
          >
            #{tag}
          </span>
        ))}
        {card.tags.length > 3 && (
          <span className="text-xs text-muted-foreground">+{card.tags.length - 3}</span>
        )}
      </div>

      {/* Footer - Confidence & Version */}
      <div className="flex items-center justify-between text-xs">
        <span className={cn("font-medium", confidenceColors[card.confidence])}>
          Confidence: {card.confidence.charAt(0).toUpperCase() + card.confidence.slice(1)}
        </span>
        <span className="text-muted-foreground font-mono">
          {card.version}
        </span>
      </div>
      </div>

      {showEdit && (
        <CardEditModal card={card} onClose={() => setShowEdit(false)} onSaved={handleSaved} />
      )}
      {showHistory && (
        <CardHistoryModal card={card} onClose={() => setShowHistory(false)} />
      )}
    </>
  );
}
