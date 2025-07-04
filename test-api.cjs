const axios = require('axios');

const OPENAI_API_KEY = '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';

async function testImageGeneration() {
  try {
    console.log('Testing OpenAI API key...');
    
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt: 'A beautiful sunset over mountains',
        size: '1024x1024',
        quality: 'hd',
        n: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error details:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
  }
}

testImageGeneration(); 