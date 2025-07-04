import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Mic, 
  StopCircle,
  Volume2,
  VolumeX,
  Settings,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'
import useChatStore from '../store/chatStore'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import { sendMessage as sendOpenAIMessage } from '../services/openaiService'
import { getSmartResponse } from './LiveChatKnowledge'

const LiveChat = () => {
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState(null)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('')
  const [availableVoices, setAvailableVoices] = useState([])
  const [showVoiceSettings, setShowVoiceSettings] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')
  const [selectedGender, setSelectedGender] = useState('female')
  
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)
  
  const {
    liveChatMessages: messages,
    addLiveChatMessage: addMessage,
    clearLiveChatMessages: clearMessages,
    setTyping,
    features,
    user
  } = useChatStore()

  // Language options
  const languages = [
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' }
  ]

  // Voice gender options
  const voiceGenders = [
    { value: 'female', label: 'Female Voice', icon: '👩' },
    { value: 'male', label: 'Male Voice', icon: '👨' }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis
      
      // Load available voices
      const loadVoices = () => {
        const voices = synthesisRef.current.getVoices()
        setAvailableVoices(voices)
        
        if (voices.length > 0) {
          // Find the best voice based on selected language and gender
          const bestVoice = findBestVoice(voices, selectedLanguage, selectedGender)
          setSelectedVoice(bestVoice?.name || voices[0]?.name || '')
        }
      }

      loadVoices()
      synthesisRef.current.onvoiceschanged = loadVoices
    }

    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = selectedLanguage
      
      recognitionRef.current.onstart = () => {
        setIsListening(true)
        toast.success('Listening...')
      }
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        handleSendMessage(transcript)
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        toast.error('Speech recognition error')
        setIsListening(false)
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthesisRef.current && synthesisRef.current.speaking) {
        synthesisRef.current.cancel()
      }
    }
  }, [selectedLanguage, selectedGender])

  // Find the best voice based on language and gender preferences
  const findBestVoice = (voices, language, gender) => {
    const langCode = language.split('-')[0]
    
    // Filter voices by language
    const languageVoices = voices.filter(voice => 
      voice.lang.startsWith(langCode) || voice.lang.startsWith(language)
    )
    
    if (languageVoices.length === 0) {
      return voices.find(voice => voice.lang.startsWith('en')) || voices[0]
    }
    
    // Filter by gender preference
    const genderVoices = languageVoices.filter(voice => {
      const name = voice.name.toLowerCase()
      if (gender === 'female') {
        return name.includes('female') || name.includes('woman') || 
               name.includes('samantha') || name.includes('zira') || 
               name.includes('susan') || name.includes('karen') ||
               !name.includes('male') && !name.includes('man')
      } else {
        return name.includes('male') || name.includes('man') || 
               name.includes('david') || name.includes('mark') ||
               name.includes('daniel') || name.includes('george')
      }
    })
    
    return genderVoices[0] || languageVoices[0]
  }

  // Update speech recognition language when language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage
    }
  }, [selectedLanguage])

  // Update selected voice when language or gender changes
  useEffect(() => {
    if (availableVoices.length > 0) {
      const bestVoice = findBestVoice(availableVoices, selectedLanguage, selectedGender)
      if (bestVoice) {
        setSelectedVoice(bestVoice.name)
      }
    }
  }, [selectedLanguage, selectedGender, availableVoices])

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || input.trim()
    if (!textToSend || isProcessing) return

    const userMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    }

    addMessage(userMessage)
    setInput('')
    setIsProcessing(true)
    setTyping(true)

    try {
      // Try OpenAI first
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      conversationHistory.push({ role: 'user', content: textToSend })

      const aiContent = await sendOpenAIMessage(conversationHistory, user?.name || 'User')
      
      let responseText
      if (aiContent.includes('having trouble connecting') || aiContent.includes('authentication issue') || !aiContent) {
        // Use local response if OpenAI fails
        responseText = getSmartResponse(textToSend)
      } else {
        responseText = aiContent
      }
      
      const aiMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      }
      
      addMessage(aiMessage)
      
      // Speak the response
      setTimeout(() => {
        speakText(responseText)
      }, 100)
      
    } catch (error) {
      console.error('Error getting AI response:', error)
      
      // Use local response as fallback
      const responseText = getSmartResponse(textToSend)
      
      const aiMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      }
      
      addMessage(aiMessage)
      
      // Speak the response
      setTimeout(() => {
        speakText(responseText)
      }, 100)
    } finally {
      setIsProcessing(false)
      setTyping(false)
    }
  }

  const speakText = (text) => {
    if (!synthesisRef.current) {
      toast.error('Speech synthesis not supported')
      return
    }

    // Stop any current speech
    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Find the selected voice
    const voice = availableVoices.find(voice => voice.name === selectedVoice)
    if (voice) {
      utterance.voice = voice
    }
    
    utterance.rate = 0.9
    utterance.pitch = 1.0
    utterance.volume = 1
    utterance.lang = 'en-US'

    utterance.onstart = () => {
      setIsSpeaking(true)
      toast.success('AI is speaking...')
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      setIsSpeaking(false)
      toast.error('Speech error')
    }

    synthesisRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthesisRef.current && synthesisRef.current.speaking) {
      synthesisRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const startVoiceRecording = async () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser')
      return
    }
    
    if (isListening) {
      recognitionRef.current.stop()
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      recognitionRef.current.start()
    } catch (error) {
      console.error('Microphone error:', error)
      toast.error('Microphone access denied. Please allow microphone access.')
    }
  }

  const testSpeech = () => {
    const testMessage = "Hello! This is a test of the voice chat system. I'm your AI assistant and I'm ready to have a conversation with you!"
    speakText(testMessage)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
      {/* Voice Settings Panel */}
      <AnimatePresence>
        {showVoiceSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="max-w-2xl mx-auto space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Voice Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Voice Type
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    {voiceGenders.map((gender) => (
                      <option key={gender.value} value={gender.value}>
                        {gender.icon} {gender.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Current voice: {selectedVoice || 'Loading...'}
                </div>
                <button
                  onClick={testSpeech}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Test Voice
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.length === 0 && (
        <div className="p-8 text-center">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-3">🎤 Live Voice Chat</h3>
            <p className="text-base text-green-600 dark:text-green-300 mb-4">
              Talk naturally with AI using your voice • No sign-in required
            </p>
            
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={startVoiceRecording}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isListening ? (
                  <>
                    <StopCircle className="w-4 h-4" />
                    <span>Stop Listening</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4" />
                    <span>Start Voice Chat</span>
                  </>
                )}
              </button>
              
              <button
                onClick={testSpeech}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Volume2 className="w-4 h-4" />
                <span>Test Voice</span>
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-left">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">How to use:</h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Click "Start Voice Chat" and allow microphone access</li>
                <li>• Speak clearly and the AI will respond with voice</li>
                <li>• You can also type messages normally</li>
              </ul>
            </div>
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
          {/* Voice Settings Toggle */}
          <button
            onClick={() => setShowVoiceSettings(!showVoiceSettings)}
            className="p-2 text-chat-muted hover:text-chat-text"
            title="Voice settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Clear Chat */}
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="p-2 text-chat-muted hover:text-red-500"
              title="Clear live chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}

          {/* Voice Recording */}
          <button
            onClick={startVoiceRecording}
            disabled={isProcessing}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'text-chat-muted hover:text-chat-text'
            } disabled:opacity-50`}
            title={isListening ? 'Stop recording' : 'Voice message'}
          >
            {isListening ? (
              <StopCircle className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {/* Speech Control */}
          <button
            onClick={isSpeaking ? stopSpeaking : testSpeech}
            disabled={isProcessing}
            className={`p-2 rounded-full transition-colors ${
              isSpeaking 
                ? 'bg-orange-500 text-white' 
                : 'text-chat-muted hover:text-chat-text'
            } disabled:opacity-50`}
            title={isSpeaking ? 'Stop speaking' : 'Test speech'}
          >
            {isSpeaking ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice chat..."
              disabled={isProcessing}
              className="chat-input w-full resize-none min-h-[44px] max-h-32"
              rows={1}
            />
          </div>

          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isProcessing}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LiveChat
