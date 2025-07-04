import axios from 'axios';

// Use environment variable for API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';

export default async function handler(req, res) {
  console.log('Image generation API route called:', req.method, req.url);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request for image generation');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    console.log('Invalid method for image generation:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
} 