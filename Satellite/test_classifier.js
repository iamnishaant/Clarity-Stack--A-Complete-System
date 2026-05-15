require('dotenv').config();
const { ModelRouter } = require('./services/modelRouter');
const { buildDecomposePrompt, DECOMPOSE_SYSTEM } = require('./services/prompts/decompose');

const testInput = `
# Decision

* We decided to use PostgreSQL for transactional consistency and ACID compliance.
* Frontend state management will use TanStack Query instead of Redux.
* Knowledge Graph nodes will be stored in SQLite for relational integrity.

# Risk

* Gemini integration is currently mocked and may reduce multi-model reliability.
* Open CORS configuration in development can become a security issue in production.
* Large SRS PDFs may increase NLP pipeline latency and memory usage.

# Abnormalities

* Contradicting database decisions detected between older and newer conversations.
* Missing requirement traceability found in uploaded SRS sections.
* Multiple AI providers returned semantically conflicting outputs for the same query.
* Some temporal cards are stale and have exceeded their expiry threshold.
`;

async function runTest() {
  const router = new ModelRouter();
  console.log("Testing decomposition pipeline with Llama 3.3 70B...");
  
  const prompt = buildDecomposePrompt(testInput, { name: "Test Project" }, [], []);
  
  try {
    const result = await router.call(DECOMPOSE_SYSTEM, prompt, { temperature: 0.1 });
    console.log("\n--- RAW LLM OUTPUT ---");
    console.log(result);
    
    console.log("\n--- PARSED CARDS ---");
    const parsed = JSON.parse(result.replace(/```json|```/g, ""));
    parsed.fragments.forEach(f => {
      console.log(`[${f.category.toUpperCase()}] Confidence: ${f.confidence}`);
      console.log(`Raw: ${f.raw_text}`);
      console.log(`Summary: ${f.summary}\n`);
    });
  } catch (err) {
    console.error("Test failed:", err);
  }
}

runTest();
