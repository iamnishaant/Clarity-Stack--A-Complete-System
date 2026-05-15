// scripts/migrate_categories.js — P2.5 historical card re-classification
require("dotenv").config();
const mongoose = require("mongoose");
const TemporalCard = require("../models/TemporalCard");

const HEURISTICS = [
  {
    category: "decision",
    keywords: ["we will", "we use", "decided", "selected", "chosen", "approach", "must use"],
  },
  {
    category: "architecture",
    keywords: ["architecture", "component", "integration", "boundary", "pattern", "structural"],
  },
  {
    category: "conflict",
    keywords: ["mismatch", "contradiction", "anomaly", "abnormality", "inconsistency", "incorrect"],
  },
  {
    category: "action",
    keywords: ["todo", "task", "action", "write", "implement", "deploy", "fix"],
  },
  {
    category: "risk",
    keywords: ["risk", "threat", "vulnerability", "bottleneck", "potential", "blocker"],
  },
  {
    category: "question",
    keywords: ["question", "clarify", "unresolved", "missing information", "query"],
  },
];

async function migrate() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("MONGO_URI not found");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected.");

  const insightCards = await TemporalCard.find({ category: "insight" });
  console.log(`Found ${insightCards.length} insight cards to examine.`);

  let migratedCount = 0;

  for (const card of insightCards) {
    const text = (card.summary + " " + (card.title || "")).toLowerCase();
    let newCategory = null;

    // Apply heuristics
    for (const h of HEURISTICS) {
      if (h.keywords.some((k) => text.includes(k))) {
        newCategory = h.category;
        break;
      }
    }

    if (newCategory) {
      console.log(`[Migrate] Card "${card.title}" (${card._id}): insight -> ${newCategory}`);
      card.category = newCategory;
      await card.save();
      migratedCount++;
    }
  }

  console.log("──────────────────────────────────────────────");
  console.log(`Migration complete. Re-classified ${migratedCount} cards.`);
  console.log("──────────────────────────────────────────────");
  
  await mongoose.connection.close();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
