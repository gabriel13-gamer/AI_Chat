import axios from 'axios';

// Use environment variable for API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  console.log('API route called:', req.method, req.url);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return res.status(500).json({ error: 'API key not configured' });
  }

  console.log('API key configured:', OPENAI_API_KEY ? 'Yes' : 'No');
  console.log('API key length:', OPENAI_API_KEY ? OPENAI_API_KEY.length : 0);

  try {
    console.log('Received chat request:', req.body);
    
    // Use stable models
    let model = req.body.model || 'gpt-4o-mini';
    
    // Map to working models
    if (model === 'gpt-4o') {
      model = 'gpt-4o-mini'; // Use mini for better reliability
    } else if (model === 'gpt-4.1' || model === 'gpt-4.1-mini') {
      model = 'gpt-4o-mini'; // Fallback to working model
    } else if (model === 'o1-preview' || model === 'o1-mini') {
      model = 'gpt-4o-mini'; // Fallback to working model
    }
    
    const messages = req.body.messages || [];
    
    const requestBody = {
      model: model,
      messages: messages,
      temperature: req.body.temperature || 0.7,
      max_tokens: req.body.max_tokens || 1024,
    };
    
    console.log('Sending request to OpenAI:', requestBody);
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );
    
    console.log('OpenAI response received successfully');
    res.json(response.data);
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    
    // Send detailed error information
    const errorMessage = error.response?.data?.error?.message || error.message;
    const errorCode = error.response?.status || 500;
    
    res.status(errorCode).json({ 
      error: 'OpenAI request failed', 
      details: errorMessage,
      code: errorCode
    });
  }
} 