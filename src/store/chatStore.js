import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useChatStore = create(
  persist(
    (set, get) => ({
      // User data (persists across sessions)
      user: {
        id: 'user-default',
        name: 'User',
        email: null,
        avatar: null
      },

      // Separate message arrays for each chat type (do NOT persist - clear on restart)
      aiChatMessages: [],
      liveChatMessages: [],
      codeChatMessages: [],
      documentChatMessages: [],
      
      // Legacy messages array (for backward compatibility)
      messages: [],
      
      // UI state
      isTyping: false,
      
      // App features
      features: {
        voiceChat: true,
        fileUpload: true,
        codeReview: true,
        imageGeneration: true,
        documentAnalysis: true,
        multiModal: true,
        chatHistory: true
      },
      
      // Documents
      documents: [],
      
      // Chat history (do NOT persist - clear on restart)
      chatHistory: [],
      
      // Theme - Always dark mode
      theme: 'dark',
      
      // Actions for separate chat types
      addAiChatMessage: (message) => {
        set((state) => ({
          aiChatMessages: [...state.aiChatMessages, { ...message, id: Date.now(), timestamp: new Date() }]
        }))
      },
      
      addLiveChatMessage: (message) => {
        set((state) => ({
          liveChatMessages: [...state.liveChatMessages, { ...message, id: Date.now(), timestamp: new Date() }]
        }))
      },
      
      addCodeChatMessage: (message) => {
        set((state) => ({
          codeChatMessages: [...state.codeChatMessages, { ...message, id: Date.now(), timestamp: new Date() }]
        }))
      },
      
      addDocumentChatMessage: (message) => {
        set((state) => ({
          documentChatMessages: [...state.documentChatMessages, { ...message, id: Date.now(), timestamp: new Date() }]
        }))
      },
      
      // Clear functions for each chat type
      clearAiChatMessages: () => set({ aiChatMessages: [] }),
      clearLiveChatMessages: () => set({ liveChatMessages: [] }),
      clearCodeChatMessages: () => set({ codeChatMessages: [] }),
      clearDocumentChatMessages: () => set({ documentChatMessages: [] }),
      
      // Legacy actions (for backward compatibility)
      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, { ...message, id: Date.now(), timestamp: new Date() }]
        }))
      },
      
      updateMessage: (messageId, updates) => {
        set((state) => ({
          messages: state.messages.map(msg => 
            msg.id === messageId ? { ...msg, ...updates } : msg
          )
        }))
      },
      
      clearMessages: () => set({ messages: [] }),
      
      setTyping: (isTyping) => set({ isTyping }),
      
      setUser: (user) => set({ user }),
      
      updateFeatures: (features) => {
        set((state) => ({
          features: { ...state.features, ...features }
        }))
      },
      
      addDocument: (document) => {
        set((state) => ({
          documents: [...state.documents, document]
        }))
      },
      
      removeDocument: (documentId) => {
        set((state) => ({
          documents: state.documents.filter(doc => doc.id !== documentId)
        }))
      },
      
      addToHistory: (chat) => {
        set((state) => ({
          chatHistory: [chat, ...state.chatHistory.slice(0, 49)] // Keep last 50 chats
        }))
      },
      
      // Chat memory
      clearHistory: () => set({ chatHistory: [] }),
      
      // Theme - Always dark mode
      setTheme: () => set({ theme: 'dark' }),
    }),
    {
      name: 'ai-chat-storage',
      partialize: (state) => ({
        // Only persist user data and theme - NOT chat messages or history
        user: state.user,
        features: state.features,
        documents: state.documents,
        theme: state.theme,
      }),
    }
  )
)

export default useChatStore 