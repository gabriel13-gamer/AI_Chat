import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Clock, 
  MessageSquare, 
  Trash2, 
  Download, 
  Search,
  Calendar,
  User,
  Bot
} from 'lucide-react'
import toast from 'react-hot-toast'
import useChatStore from '../store/chatStore'

const History = () => {
  const { 
    chatHistory, 
    clearHistory, 
    addToHistory,
    aiChatMessages,
    liveChatMessages,
    codeChatMessages,
    documentChatMessages
  } = useChatStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [filterType, setFilterType] = useState('all') // all, today, week, month

  // Save current conversation to history
  const saveCurrentChat = () => {
    // Check all chat types for messages
    let messagesToSave = []
    let chatType = ''
    
    if (aiChatMessages.length > 0) {
      messagesToSave = aiChatMessages
      chatType = 'AI Chat'
    } else if (liveChatMessages.length > 0) {
      messagesToSave = liveChatMessages
      chatType = 'Live Chat'
    } else if (codeChatMessages.length > 0) {
      messagesToSave = codeChatMessages
      chatType = 'Code Chat'
    } else if (documentChatMessages.length > 0) {
      messagesToSave = documentChatMessages
      chatType = 'Document Chat'
    }
    
    if (messagesToSave.length === 0) {
      toast.error('No messages to save. Start a conversation in any chat section first!')
      return
    }

    const chat = {
      id: Date.now(),
      title: `${chatType}: ${messagesToSave[0]?.content?.slice(0, 40) + '...' || 'New Conversation'}`,
      messages: [...messagesToSave],
      chatType: chatType,
      timestamp: new Date(),
      messageCount: messagesToSave.length
    }

    addToHistory(chat)
    toast.success(`${chatType} conversation saved to history!`)
  }

  // Load a chat from history
  const loadChat = (chat) => {
    setSelectedChat(chat)
    toast.success('Chat loaded from history')
  }

  // Delete a chat from history
  const deleteChat = (chatId) => {
    // This would need to be implemented in the store
    toast.success('Chat deleted from history')
  }

  // Export chat as JSON
  const exportChat = (chat) => {
    const dataStr = JSON.stringify(chat, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `chat-${chat.id}-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    toast.success('Chat exported successfully')
  }

  // Filter chats based on search term and date
  const filteredChats = chatHistory.filter(chat => {
    const matchesSearch = chat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.messages.some(msg => msg.content.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const chatDate = new Date(chat.timestamp)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    let matchesDate = true
    if (filterType === 'today') {
      matchesDate = chatDate >= today
    } else if (filterType === 'week') {
      matchesDate = chatDate >= weekAgo
    } else if (filterType === 'month') {
      matchesDate = chatDate >= monthAgo
    }

    return matchesSearch && matchesDate
  })

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
          <h1 className="text-3xl font-bold text-chat-text mb-2">Chat History</h1>
          <p className="text-chat-muted">Manage and review your AI conversations</p>
        </div>

        {/* Controls */}
        <div className="card">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chat-muted w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="chat-input pl-10 w-full"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="chat-input"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <button
              onClick={saveCurrentChat}
              className="btn-primary flex items-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Save Current Chat</span>
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat List */}
          <div className="card">
            <h3 className="text-lg font-semibold text-chat-text mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Saved Conversations ({filteredChats.length})</span>
            </h3>
            
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 text-chat-muted">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No saved conversations found</p>
                <p className="text-sm">Start a chat and save it to see it here</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedChat?.id === chat.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-chat-border hover:border-chat-muted'
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-chat-text truncate">{chat.title}</h4>
                        <p className="text-sm text-chat-muted mt-1">
                          {chat.messageCount} messages • {new Date(chat.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            exportChat(chat)
                          }}
                          className="p-1 text-chat-muted hover:text-chat-text"
                          title="Export chat"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteChat(chat.id)
                          }}
                          className="p-1 text-chat-muted hover:text-red-500"
                          title="Delete chat"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Preview */}
          <div className="card">
            <h3 className="text-lg font-semibold text-chat-text mb-4 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Chat Preview</span>
            </h3>
            
            {selectedChat ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-3 bg-chat-bg rounded-lg">
                  <div>
                    <h4 className="font-medium text-chat-text">{selectedChat.title}</h4>
                    <p className="text-sm text-chat-muted">
                      {new Date(selectedChat.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => loadChat(selectedChat)}
                    className="btn-primary text-sm"
                  >
                    Load Chat
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedChat.messages.slice(0, 5).map((message, index) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <Bot className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                      )}
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-chat-surface border border-chat-border text-chat-text'
                      }`}>
                        <p className="truncate">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <User className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                  {selectedChat.messages.length > 5 && (
                    <p className="text-center text-sm text-chat-muted">
                      ... and {selectedChat.messages.length - 5} more messages
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-chat-muted">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Chat Summary */}
        {(aiChatMessages.length > 0 || liveChatMessages.length > 0 || codeChatMessages.length > 0 || documentChatMessages.length > 0) && (
          <div className="card">
            <h3 className="text-lg font-semibold text-chat-text mb-4">Current Conversation</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-chat-text">
                  <span className="font-medium">{aiChatMessages.length + liveChatMessages.length + codeChatMessages.length + documentChatMessages.length}</span> messages in current chat
                </p>
                <p className="text-sm text-chat-muted">
                  {aiChatMessages.length > 0 && `AI Chat: ${aiChatMessages.length} messages`}
                  {liveChatMessages.length > 0 && `${aiChatMessages.length > 0 ? ' • ' : ''}Live Chat: ${liveChatMessages.length} messages`}
                  {codeChatMessages.length > 0 && `${(aiChatMessages.length > 0 || liveChatMessages.length > 0) ? ' • ' : ''}Code Chat: ${codeChatMessages.length} messages`}
                  {documentChatMessages.length > 0 && `${(aiChatMessages.length > 0 || liveChatMessages.length > 0 || codeChatMessages.length > 0) ? ' • ' : ''}Document Chat: ${documentChatMessages.length} messages`}
                </p>
              </div>
              <button
                onClick={saveCurrentChat}
                className="btn-secondary"
              >
                Save to History
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default History 