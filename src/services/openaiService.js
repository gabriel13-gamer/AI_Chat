import axios from 'axios'

const OPENAI_API_URL = '/api/chat'

export async function sendMessage(messages, username = 'User') {
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
        model: 'gpt-4o-mini',
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
    console.error('OpenAI API Error:', error)
    
    // Better error handling with fallback responses
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return `Hi ${username}! I'm having trouble connecting to the AI service right now. Please make sure the API server is running on port 3001. You can start it with: node server.cjs`
    } else if (error.response?.status === 401) {
      return `Hi ${username}! There's an authentication issue with the AI service. Please check the API key configuration.`
    } else if (error.response?.status === 429) {
      return `Hi ${username}! The AI service is currently rate-limited. Please try again in a moment.`
    } else if (error.response?.status >= 500) {
      return `Hi ${username}! The AI service is experiencing server issues. Please try again later.`
    } else {
      return `Hi ${username}! I'm having trouble processing your request right now. Please try again or check if the server is running.`
    }
  }
} 