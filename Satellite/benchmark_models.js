require('dotenv').config();
const axios = require('axios');

/**
 * benchmark_models.js
 * Discovers and tests LLM availability, speed, and JSON capability across providers.
 */

const PROVIDERS = {
  NVIDIA: {
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    key: process.env.NVIDIA_API_KEY,
    models: [
      'meta/llama-3.1-405b-instruct',
      'meta/llama-3.1-70b-instruct',
      'meta/llama-3.1-8b-instruct',
      'nvidia/llama-3.1-nemotron-70b-instruct',
      'mistralai/mixtral-8x22b-instruct-v0.1'
    ]
  },
  GROQ: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    key: process.env.GROQ_API_KEY,
    models: [
      'llama-3.1-70b-versatile',
      'llama-3.1-8b-instant',
      'llama3-70b-8192',
      'llama3-8b-8192',
      'mixtral-8x7b-32768'
    ]
  },
  HF: {
    url: 'https://router.huggingface.co/v1/chat/completions',
    key: process.env.HF_TOKEN,
    models: [
      'meta-llama/Llama-3.3-70B-Instruct',
      'meta-llama/Meta-Llama-3.1-70B-Instruct',
      'mistralai/Mixtral-8x7B-Instruct-v0.1'
    ]
  }
};

const TEST_PROMPT = "Return a JSON object with keys 'status' (string 'ok') and 'intelligence_level' (integer 1-100). Output ONLY valid JSON.";

async function testModel(providerName, providerUrl, apiKey, modelId) {
  const start = Date.now();
  try {
    const res = await axios.post(providerUrl, {
      model: modelId,
      messages: [{ role: 'user', content: TEST_PROMPT }],
      temperature: 0.1,
      max_tokens: 100,
      response_format: { type: "json_object" }
    }, {
      headers: { Authorization: `Bearer ${apiKey}` },
      timeout: 30000 // 30s timeout for testing
    });

    const duration = Date.now() - start;
    const content = res.data.choices[0].message.content;
    
    let isJson = false;
    try {
      JSON.parse(content.replace(/```json|```/g, "").trim());
      isJson = true;
    } catch (e) {}

    return {
      status: 'SUCCESS',
      latency: `${duration}ms`,
      isJson,
      preview: content.substring(0, 50).replace(/\n/g, ' ')
    };
  } catch (err) {
    return {
      status: 'FAILED',
      error: err.response?.status || err.code || err.message,
      latency: `${Date.now() - start}ms`
    };
  }
}

async function runDiscovery() {
  console.log("====================================================");
  console.log("🚀 CLARITY LLM DISCOVERY & BENCHMARK");
  console.log("====================================================\n");

  const results = [];

  for (const [pName, pConfig] of Object.entries(PROVIDERS)) {
    if (!pConfig.key) {
      console.warn(`⚠️ Skipping ${pName} - No API Key`);
      continue;
    }

    console.log(`📡 Testing ${pName} models...`);
    for (const modelId of pConfig.models) {
      process.stdout.write(`   - ${modelId}: `);
      const result = await testModel(pName, pConfig.url, pConfig.key, modelId);
      
      if (result.status === 'SUCCESS') {
        console.log(`✅ [${result.latency}] JSON: ${result.isJson ? 'YES' : 'NO'}`);
      } else {
        console.log(`❌ FAILED (${result.error})`);
      }
      
      results.push({ provider: pName, model: modelId, ...result });
    }
    console.log("");
  }

  console.log("====================================================");
  console.log("📊 DISCOVERY SUMMARY (TIER RECOMMENDATIONS)");
  console.log("====================================================");

  const successModels = results.filter(r => r.status === 'SUCCESS');
  
  // Intelligence Sort (Assuming larger models or specific ones are better)
  const tier1 = successModels.filter(r => r.model.includes('405b') || r.model.includes('Llama-3.3') || r.model.includes('nemotron'));
  const tier2 = successModels.filter(r => r.model.includes('70b') && !tier1.includes(r));
  const tier3 = successModels.filter(r => r.model.includes('8b') || r.model.includes('mixtral'));

  console.log("\n💎 TIER 1 (Synthesis / Complex Reasoning):");
  tier1.forEach(m => console.log(`   - [${m.provider}] ${m.model} (${m.latency})`));
  if (tier1.length === 0) console.log("   - None available");

  console.log("\n⚡ TIER 2 (General Decomp / Speed):");
  tier2.forEach(m => console.log(`   - [${m.provider}] ${m.model} (${m.latency})`));

  console.log("\n🔋 TIER 3 (Efficiency / Simple Tasks):");
  tier3.forEach(m => console.log(`   - [${m.provider}] ${m.model} (${m.latency})`));

  console.log("\n❌ CURRENTLY OFFLINE / INACCESSIBLE:");
  results.filter(r => r.status === 'FAILED').forEach(m => console.log(`   - [${m.provider}] ${m.model} (Error: ${m.error})`));
  
  console.log("\n====================================================");
}

runDiscovery();
