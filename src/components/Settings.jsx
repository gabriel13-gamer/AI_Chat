import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  User, 
  Save,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'
import useChatStore from '../store/chatStore'

const Settings = () => {
  const { user, setUser } = useChatStore()
  const [username, setUsername] = useState(user?.name || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    document.body.classList.remove('light')
    document.body.classList.add('dark')
  }, [])

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      toast.error('Please enter a valid username')
      return
    }

    setIsSaving(true)
    try {
      const newUser = {
        id: 'user-' + Date.now(),
        name: username.trim(),
        email: null,
        avatar: null
      }
      
      setUser(newUser)
      toast.success(`Username saved! AI will now call you ${username.trim()}`)
    } catch (error) {
      console.error('Error saving username:', error)
      toast.error('Failed to save username')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveUsername()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">AI Chat Features <span className='text-green-600'>✓ Available</span></h2>
          <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">Updated: January 2025</span>
        </div>
        <ul className="list-disc pl-6 space-y-1 text-base">
          <li>Unlimited access to <b>GPT-4o</b> and <b>GPT-4o-mini</b> models</li>
          <li>Access to <b>GPT-4.1</b> and <b>GPT-4.1-mini</b> (latest 2025 models)</li>
          <li>Advanced reasoning with <b>o1-mini</b> and <b>o1-preview</b> models</li>
          <li>AI image generation with <b>DALL-E 3</b> (HD quality)</li>
          <li>Document analysis and code review capabilities</li>
          <li>Multi-modal chat support (text, images, audio)</li>
          <li>Chat history and conversation management</li>
        </ul>
      </div>

      {/* Username Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-chat-text mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Username Settings
        </h3>
        
          <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-chat-text mb-2">
              Your Name
            </label>
            <p className="text-sm text-chat-muted mb-3">
              Enter your name so the AI can address you personally in conversations.
            </p>
            <div className="flex space-x-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name..."
                className="chat-input flex-1"
                maxLength={50}
              />
              <button
                onClick={handleSaveUsername}
                disabled={isSaving || !username.trim()}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {user?.name && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>Current Name:</strong> {user.name}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                The AI will address you by this name in all conversations.
              </p>
          </div>
        )}
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Privacy & Data
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Your username is stored locally in your browser</li>
          <li>• Chat history is cleared when the server restarts</li>
          <li>• No personal data is sent to external servers</li>
          <li>• All conversations are private and temporary</li>
        </ul>
      </div>
    </div>
  )
}

export default Settings 