import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  Mic, 
  StopCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import useChatStore from '../store/chatStore'
import { processDocument, validateFile, createFilePreview, getFileType } from '../utils/fileUtils'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import { sendMessage as sendOpenAIMessage } from '../services/openaiService'

const ChatInterface = () => {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  
  const {
    aiChatMessages: messages,
    addAiChatMessage: addMessage,
    setTyping,
    features,
    addDocument,
    user
  } = useChatStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    addMessage(userMessage)
    setInput('')
    setIsProcessing(true)
    setTyping(true)

    // Prepare last 10 messages as context for OpenAI
    const conversationHistory = messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }))
    conversationHistory.push({ role: 'user', content: userMessage.content })

    // Get AI response from OpenAI with username
    const aiContent = await sendOpenAIMessage(conversationHistory, user?.name || 'User')
    const aiMessage = {
      role: 'assistant',
      content: aiContent,
      timestamp: new Date()
    }
    addMessage(aiMessage)
    setIsProcessing(false)
    setTyping(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileUpload = async (files) => {
    for (const file of files) {
      const validation = validateFile(file)
      
      if (!validation.isValid) {
        toast.error(validation.errors[0])
        continue
      }

      try {
        setIsProcessing(true)
        
        const preview = await createFilePreview(file)
        const content = await processDocument(file)
        
        const fileMessage = {
          role: 'user',
          content: `Uploaded file: ${file.name}`,
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            preview,
            content
          },
          timestamp: new Date()
        }

        addMessage(fileMessage)

        if (['DOCUMENT', 'SPREADSHEET', 'TEXT'].includes(getFileType(file.name))) {
          addDocument({
            id: Date.now(),
            name: file.name,
            content,
            type: getFileType(file.name),
            uploadedAt: new Date()
          })
        }

        const prompt = `Please analyze this document (${file.name.split('.').pop()} format) and provide insights about its content:

${content}

Please provide a comprehensive analysis including:
1. Main topics and themes
2. Key information and insights
3. Important details or data points
4. Any notable patterns or observations`

        const aiResponse = await sendOpenAIMessage([
          { role: 'user', content: prompt }
        ], user?.name || 'User')
        
        const aiMessage = {
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date()
        }

        addMessage(aiMessage)
        
        toast.success(`Successfully processed ${file.name}`)
      } catch (error) {
        console.error('Error processing file:', error)
        toast.error(`Failed to process ${file.name}: ${error.message}`)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleVoiceRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error('Voice recording not supported')
      return
    }
    toast.info('Voice chat is now available in the Live Chat section! Click on "Live Chat" in the sidebar.')
  }

  const copyMessage = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      toast.success('Message copied to clipboard')
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      toast.error('Failed to copy message')
    }
  }

  const downloadMessage = (content, filename = 'message.txt') => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      {messages.length === 0 && (
        <div className="p-8 text-center">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3">AI Chat 2025</h3>
            <p className="text-base text-blue-600 dark:text-blue-300">
              Updated with latest GPT-4.1 & o1 models • January 2025
            </p>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble
                message={message}
                onCopy={copyMessage}
                onDownload={downloadMessage}
                copied={copiedMessageId === message.id}
                features={features}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isProcessing && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-chat-border p-6">
        <div className="flex items-end space-x-4 max-w-4xl mx-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="p-2 text-chat-muted hover:text-chat-text disabled:opacity-50"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <button
            onClick={handleVoiceRecording}
            disabled={isProcessing}
            className={`p-2 rounded-full transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white' 
                : 'text-chat-muted hover:text-chat-text'
            } disabled:opacity-50`}
            title={isRecording ? 'Stop recording' : 'Voice message'}
          >
            {isRecording ? (
              <StopCircle className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isProcessing}
              className="chat-input w-full resize-none min-h-[44px] max-h-32"
              rows={1}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileUpload(Array.from(e.target.files))}
          className="hidden"
          accept=".txt,.md,.pdf,.docx,.xlsx,.csv,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.html,.css,.json"
        />
      </div>
    </div>
  )
}

export default ChatInterface 