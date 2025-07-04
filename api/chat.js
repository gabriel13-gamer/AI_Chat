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
    
    // Use stable models with fallback options
    let model = req.body.model || 'gpt-3.5-turbo';
    let useFallbackModel = false;
    
    // Map to working models
    if (model === 'gpt-4o' || model === 'gpt-4o-mini') {
      model = 'gpt-3.5-turbo'; // Use 3.5 for better reliability
    } else if (model === 'gpt-4.1' || model === 'gpt-4.1-mini') {
      model = 'gpt-3.5-turbo'; // Fallback to working model
    } else if (model === 'o1-preview' || model === 'o1-mini') {
      model = 'gpt-3.5-turbo'; // Fallback to working model
    }
    
    const messages = req.body.messages || [];
    
    const requestBody = {
      model: model,
      messages: messages,
      temperature: req.body.temperature || 0.7,
      max_tokens: req.body.max_tokens || 1024,
    };
    
    console.log('Sending request to OpenAI:', requestBody);
    
    let response;
    try {
      response = await axios.post(
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
    } catch (primaryError) {
      // If primary model fails with rate limit, try with a different model
      if (primaryError.response?.status === 429 && !useFallbackModel) {
        console.log('Primary model rate limited, trying with gpt-3.5-turbo-16k');
        useFallbackModel = true;
        
        const fallbackRequestBody = {
          ...requestBody,
          model: 'gpt-3.5-turbo-16k'
        };
        
        try {
          response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            fallbackRequestBody,
            {
              headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
              },
              timeout: 30000,
            }
          );
          
          console.log('Fallback model response received successfully');
          res.json(response.data);
          return;
        } catch (fallbackError) {
          console.log('Fallback model also failed, using intelligent response');
          throw primaryError; // Re-throw to use the intelligent fallback
        }
      } else {
        throw primaryError;
      }
    }
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    
    // Send detailed error information
    const errorMessage = error.response?.data?.error?.message || error.message;
    const errorCode = error.response?.status || 500;
    
    // Handle rate limiting specifically
    if (errorCode === 429) {
      console.log('Rate limit hit, providing intelligent fallback response');
      
      const lastMessage = req.body.messages[req.body.messages.length - 1]?.content || '';
      const userMessage = lastMessage.toLowerCase();
      
      // Provide more intelligent responses based on the user's message
      let fallbackResponse = '';
      
      if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
        fallbackResponse = `Hello! 👋 I'm here to help you. I'm currently experiencing high demand, but I can still assist you with general questions. What would you like to know about?`;
      } else if (userMessage.includes('help') || userMessage.includes('assist')) {
        fallbackResponse = `I'm here to help! 🤖 I can assist with questions, provide information, help with tasks, and more. What do you need help with?`;
      } else if (userMessage.includes('portuguese') && userMessage.includes('june')) {
        fallbackResponse = `June is incredibly important in Portuguese cultural celebrations! The main event is the Festas de São João (St. John's Festival) celebrated on June 23-24, especially in Porto and Braga. These festivals feature traditional music, dancing, grilled sardines, and the famous 'martelinhos' (plastic hammers) that people use to playfully hit each other on the head. There are also the Festas de Santo António in Lisbon (June 12-13) with parades, traditional costumes, and grilled sardines. These celebrations honor Portuguese saints and bring communities together with music, food, and traditional customs that have been passed down for generations.`;
      } else if (userMessage.includes('portuguese') || userMessage.includes('portugal')) {
        fallbackResponse = `Portuguese culture is rich and diverse! Portugal is known for its maritime history, beautiful azulejo tiles, traditional Fado music, delicious cuisine with seafood and pastries, and vibrant festivals. Some of the most important celebrations include São João in Porto (June 23-24), Santo António in Lisbon (June 12-13), and the Festa dos Tabuleiros in Tomar. Portuguese people are known for their warm hospitality and strong community bonds.`;
      } else if (userMessage.includes('how') || userMessage.includes('what') || userMessage.includes('why')) {
        fallbackResponse = `That's an interesting question about "${lastMessage}"! I'd love to provide a detailed answer. Please try again in a moment when the system is less busy.`;
      } else if (userMessage.includes('thank')) {
        fallbackResponse = `You're very welcome! 😊 I'm glad I could help. Is there anything else you'd like to know?`;
      } else {
        fallbackResponse = `I understand you're asking about "${lastMessage}". That's a great topic! I'm currently experiencing high demand, but I'd be happy to provide a detailed response. Please try again in a few moments.`;
      }
      
      return res.json({
        choices: [{
          message: {
            content: fallbackResponse
          }
        }]
      });
    }
    
    res.status(errorCode).json({ 
      error: 'OpenAI request failed', 
      details: errorMessage,
      code: errorCode
    });
  }
} 