# AI Chat Application v1.1.0

A modern AI chat application with advanced document processing, voice chat, and live chat capabilities. This version includes enhanced document chat functionality with improved PDF processing and fallback systems.

## Features

- 🤖 AI-powered chat with OpenAI integration
- 📄 **Enhanced Document Chat** - Improved PDF processing with fallback systems
- 📋 Document upload and analysis (PDF, DOCX, TXT, XLSX, etc.)
- 🎤 Voice chat capabilities
- 💬 Live chat with real-time responses
- 📱 Responsive design for mobile and desktop
- 🌙 Dark/Light theme support
- 🔄 **Smart Fallback System** - Continues working even when API quotas are exceeded

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

The application requires an OpenAI API key to function properly. You can get one from [OpenAI's website](https://platform.openai.com/api-keys).

#### For Local Development:
Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

#### For Vercel Deployment:
Add the environment variable in your Vercel dashboard:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add `OPENAI_API_KEY` with your OpenAI API key

### 3. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Troubleshooting

### Chat Not Working?
If the AI chat is not answering questions properly, check:

1. **API Key Configuration**: Ensure your OpenAI API key is properly set in environment variables
2. **API Key Validity**: Verify your API key is active and has sufficient credits
3. **Rate Limits**: The application includes fallback responses for rate limiting, but for best results, ensure your API key has adequate quota

### Common Issues

- **"API key not configured"**: Set the `OPENAI_API_KEY` environment variable
- **Rate limiting**: The app will use fallback responses, but consider upgrading your OpenAI plan
- **Empty responses**: Check your internet connection and API key status

## What's New in v1.1.0

### 🆕 Enhanced Document Chat
- Improved PDF processing with better error handling
- Smart fallback system for when PDF text extraction fails
- Enhanced document analysis with contextual responses
- Better support for various document formats

### 🔧 Technical Improvements
- Robust API error handling with graceful fallbacks
- Improved environment variable management with dotenv
- Better server-side error handling and logging
- Enhanced user experience with informative error messages

### 🛡️ Reliability Features
- Smart fallback responses when OpenAI API is unavailable
- Automatic retry mechanisms for failed requests
- Better handling of quota limits and rate limiting
- Improved user feedback for technical issues

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Express.js with OpenAI integration
- **AI**: OpenAI GPT models with fallback systems
- **Styling**: Framer Motion, Lucide React icons
- **Deployment**: Vercel

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License 