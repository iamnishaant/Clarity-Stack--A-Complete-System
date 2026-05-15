// services/prompts/decompose.js — v4 Decomposition prompts for Llama 3.1 70B

const DECOMPOSE_SYSTEM = `You are a semantic decomposition engine for project intelligence cards.

Your job: split a single chat message into INDEPENDENT semantic fragments.
Each fragment maps to exactly ONE category. You MUST prioritize specific actionable categories over generic "insight".

CATEGORY DEFINITIONS & PRIORITY:
1. [decision] - A specific choice made, technology selection, or agreed-upon approach (e.g., "We use PostgreSQL").
2. [architecture] - System design patterns, component boundaries, and high-level structural integrations.
3. [risk] - Potential problems, security threats, performance bottlenecks, or future blockers.
4. [conflict] - Contradictions, abnormalities, missing requirements, or detected inconsistencies (replaces "abnormality").
5. [action] - A specific task, unit of work, or next step to be executed (replaces "task").
6. [insight] - A general observation or learning (Use only if others do not apply).
7. [progress] - Status updates on ongoing work or milestone achievements.
8. [question] - Unresolved queries or missing information that needs clarification.
9. [general] - Relevant information that does not fit into specific semantic buckets.

STRICT RULES:
1. You MUST self-split the entire message into distinct semantic fragments. Ignore structural markdown like headers if they group unrelated items.
2. One fragment per distinct semantic unit. Do not merge a task and a risk into one fragment.
3. GRANULARITY MANDATE: You MUST be exhaustively atomic. Extract as many distinct fragments as possible. Aim for at least 5-7 fragments for substantial messages. Every individual risk, choice, observation, or task MUST be its own independent card. NEVER consolidate distinct points even if they share a category.
4. If someone says "We will use MongoDB (decision) so you need to write the schema (action) and monitor performance (risk)", create THREE distinct fragments.
5. Extract verbatim relevant text as "raw_text".
6. Set confidence 0.0–1.0.
7. Output ONLY valid JSON. No preamble.
8. EFFICIENCY RULE: Be concise but accurate. Generate ONLY valid JSON. Aim for high semantic precision.

OUTPUT SCHEMA:
{
  "fragments": [
    {
      "id": "f1",
      "category": "decision",
      "raw_text": "exact substring from the message",
      "summary": "one sentence synthesis",
      "confidence": 0.92,
      "kg_nodes_affected": [],
      "key_changes": ["tag1", "tag2"]
    }
  ],
  "total_fragments": 1,
  "dominant_category": "decision"
}`;

function buildDecomposePrompt(message, projectContext, previousCards, thresholdChanges) {
  const projectBlock = projectContext
    ? `PROJECT: ${projectContext.name || "Unknown Project"}\nSTACK: ${(projectContext.techStack || []).join(", ") || "N/A"}`
    : "PROJECT: Unknown";

  const cardsBlock =
    previousCards && previousCards.length > 0
      ? previousCards
          .map((c) => `[${c.category} v${c.version}] ${c.title} — ${c.summary}`)
          .join("\n")
      : "None";

  const thresholdBlock =
    thresholdChanges && thresholdChanges.length > 0
      ? `CONFIG CHANGES SINCE LAST RUN:\n${thresholdChanges.map((c) => `- ${c.key}: ${c.oldValue} → ${c.newValue}`).join("\n")}\nConsider if these changes affect how you classify or score fragments.\n`
      : "";

  const messageText = typeof message === "string" ? message : message.text || message.content || "";

  return `${projectBlock}

ACTIVE CARDS IN THIS CHAT (for conflict context):
${cardsBlock}

${thresholdBlock}MESSAGE TO DECOMPOSE:
"${messageText}"

Decompose exhaustively. Do not merge distinct concerns.`;
}

module.exports = { DECOMPOSE_SYSTEM, buildDecomposePrompt };
