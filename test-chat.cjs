const axios = require('axios');

const OPENAI_API_KEY = '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';

async function testChatAPI() {
  try {
    console.log('Testing OpenAI Chat API...');
    
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: 'Hello, can you respond with just "API key works"?' }
        ],
        max_tokens: 10
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Chat API Success:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('Chat API Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testChatAPI(); 