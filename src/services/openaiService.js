import axios from 'axios'

const OPENAI_API_URL = '/api/chat'

export async function sendMessage(messages, username = 'User') {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Add system message with username
      const systemMessage = {
        role: 'system',
        content: `You are a helpful AI assistant. The user's name is ${username}. Address them by their name when appropriate and be friendly and conversational. Current date is ${new Date().toLocaleDateString()}.`
      }
      
      const messagesWithSystem = [systemMessage, ...messages]
      
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: messagesWithSystem,
          temperature: 0.7,
          max_tokens: 1024,
        },
        {
          timeout: 30000, // 30 second timeout
        }
      )
    
      if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].message.content
      } else {
        throw new Error('Invalid response format from OpenAI')
      }
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed:`, error);
      
      // If it's a rate limit error and we have more attempts, wait and retry
      if (error.response?.status === 429 && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
        console.log(`Rate limited, waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // If it's not a rate limit error or we're out of attempts, break
      break;
    }
  }
  
  // If we get here, all attempts failed
  console.error('All retry attempts failed:', lastError);
  console.error('OpenAI API Error:', lastError);
  console.error('Error details:', {
    message: lastError.message,
    status: lastError.response?.status,
    statusText: lastError.response?.statusText,
    data: lastError.response?.data,
    url: lastError.config?.url
  })
  
  // Better error handling with fallback responses
  if (lastError.code === 'ECONNREFUSED' || lastError.code === 'ENOTFOUND') {
    return `Hi ${username}! I'm having trouble connecting to the AI service right now. The API endpoint might not be available.`
  } else if (lastError.response?.status === 401) {
    return `Hi ${username}! There's an authentication issue with the AI service. Please check the API key configuration.`
  } else if (lastError.response?.status === 429) {
    return `Hi ${username}! The AI service is currently rate-limited. I've tried multiple times. Please try again in a few minutes.`
  } else if (lastError.response?.status >= 500) {
    return `Hi ${username}! The AI service is experiencing server issues. Please try again later.`
  } else if (lastError.response?.status === 404) {
    return `Hi ${username}! The AI service endpoint was not found. This might be a deployment issue.`
  } else {
    return `Hi ${username}! I'm having trouble processing your request right now. Error: ${lastError.message}`
  }
} 