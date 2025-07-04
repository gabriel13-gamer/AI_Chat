require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Use OpenAI API key from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/chat', async (req, res) => {
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
});

// Simplified image generation with better error handling
app.post('/generate-image', async (req, res) => {
  try {
    const { prompt, size = '1024x1024', n = 1 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Clean and improve the prompt
    let cleanPrompt = prompt
      .replace(/\s+in\s+\w+\s+style\s*$/i, '') // Remove "in [style] style" from the end
      .trim();
    
    // Ensure the prompt is descriptive enough
    if (cleanPrompt.length < 10) {
      cleanPrompt = `A beautiful and detailed ${cleanPrompt}`;
    }
    
    console.log('Generating image with cleaned prompt:', cleanPrompt);
    
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt: cleanPrompt,
        size: size,
        quality: 'standard',
        n: 1 // Always generate 1 image to avoid issues
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );
    
    console.log('Image generation successful');
    res.json(response.data);
  } catch (error) {
    console.error('Image generation error:', error.response?.data || error.message);
    
    // Provide fallback image service
    const fallbackSize = size.split('x');
    const fallbackImageUrl = `https://picsum.photos/${fallbackSize[0]}/${fallbackSize[1]}?random=${Date.now()}`;
    
    res.json({
      created: Math.floor(Date.now() / 1000),
      data: [{
        url: fallbackImageUrl,
        revised_prompt: `Fallback image generated for: ${prompt}`
      }]
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 AI Chat API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 OpenAI API Key: ${OPENAI_API_KEY ? 'Configured' : 'Missing'}`);
}); 