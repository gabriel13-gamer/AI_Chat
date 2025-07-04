export default async function handler(req, res) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  res.json({
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none',
    timestamp: new Date().toISOString()
  });
} 