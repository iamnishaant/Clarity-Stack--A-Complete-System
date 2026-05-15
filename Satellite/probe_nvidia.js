require('dotenv').config();
const axios = require('axios');

const NVIDIA_MODELS = [
  'meta/llama-3.1-405b',
  'meta/llama3-70b-instruct',
  'meta/llama3-8b-instruct',
  'nvidia/nemotron-4-340b-instruct',
  'mistralai/mixtral-8x22b-instruct-v0.1'
];

async function testNvidia(modelId) {
  try {
    const res = await axios.post('https://integrate.api.nvidia.com/v1/chat/completions', {
      model: modelId,
      messages: [{ role: 'user', content: 'say hi' }],
      max_tokens: 10
    }, {
      headers: { Authorization: `Bearer ${process.env.NVIDIA_API_KEY}` },
      timeout: 10000
    });
    return { status: 'OK', latency: res.headers['x-runtime'] || 'unknown' };
  } catch (err) {
    return { status: 'FAIL', error: err.response?.status || err.message };
  }
}

async function run() {
  console.log("Testing alternative NVIDIA model names...");
  for (const m of NVIDIA_MODELS) {
    const res = await testNvidia(m);
    console.log(`- ${m}: ${res.status} (${res.error || ''})`);
  }
}

run();
