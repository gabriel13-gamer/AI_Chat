import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Code, Send, Download, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import useChatStore from '../store/chatStore'
import { sendMessage as sendOpenAIMessage } from '../services/openaiService'

const CodeChat = () => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const { codeChatMessages: messages, addCodeChatMessage: addMessage, user } = useChatStore()

  const languages = [
    'javascript', 'typescript', 'python', 'java', 'cpp', 'c', 'html', 'css',
    'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'csharp', 'sql'
  ]

  const handleCodeReview = async () => {
    if (!code.trim() || isProcessing) return

    const userMessage = {
      role: 'user',
      content: `Please review this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``,
      timestamp: new Date(),
      isCode: true,
      language
    }

    addMessage(userMessage)
    setIsProcessing(true)

    try {
      const prompt = `Please review this ${language} code and provide feedback on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance improvements
4. Security considerations
5. Suggestions for better readability

Code:
\`\`\`${language}
${code}
\`\`\``

      const aiResponse = await sendOpenAIMessage([
        { role: 'user', content: prompt }
      ], user?.name || 'User')
      
      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      }

      addMessage(aiMessage)
    } catch (error) {
      console.error('Code review error:', error)
      toast.error('Failed to review code')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success('Code copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto w-full space-y-6"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-chat-text mb-2">Code Chat 2025</h1>
          <p className="text-chat-muted">Advanced code review with GPT-4.1 and o1 reasoning models</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Input */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-chat-text">Code Editor</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="chat-input text-sm"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Enter your ${language} code here...`}
                className="chat-input w-full h-96 font-mono text-sm"
              />
              
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={copyCode}
                  className="p-2 bg-chat-surface rounded hover:bg-chat-border transition-colors"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={downloadCode}
                  className="p-2 bg-chat-surface rounded hover:bg-chat-border transition-colors"
                  title="Download code"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleCodeReview}
              disabled={!code.trim() || isProcessing}
              className="btn-primary w-full mt-4"
            >
              <Code className="w-4 h-4 mr-2" />
              {isProcessing ? 'Reviewing...' : 'Get Code Review'}
            </button>
          </div>

          {/* Messages */}
          <div className="card">
            <h2 className="text-xl font-semibold text-chat-text mb-4">Review Results</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`message-bubble ${message.role === 'user' ? 'message-user' : 'message-ai'}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      {message.isCode && (
                        <Code className="w-4 h-4" />
                      )}
                      <span className="text-xs font-medium">
                        {message.isCode ? `${message.language} Code` : 'AI Review'}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    <p className="text-xs text-chat-muted mt-2">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default CodeChat 