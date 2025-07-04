import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  MessageSquare, 
  Settings, 
  FileText, 
  Code, 
  Clock, 
  Bot,
  Sparkles,
  Image,
  Mic
} from 'lucide-react'
import useChatStore from '../store/chatStore'

const Layout = ({ children }) => {
  const location = useLocation()
  const { user } = useChatStore()

  const navigation = [
    { name: 'AI Chat', href: '/', icon: MessageSquare, description: 'GPT-4o & GPT-4.1 chat' },
    { name: 'Live Chat', href: '/live-chat', icon: Mic, description: 'Voice chat with AI' },
    { name: 'Code Chat', href: '/code', icon: Code, description: 'o1 reasoning models' },
    { name: 'Document Chat', href: '/documents', icon: FileText, description: 'Advanced analysis' },
    { name: 'Image Generator', href: '/images', icon: Image, description: 'DALL-E 3 image creation' },
    { name: 'History', href: '/history', icon: Clock, description: 'Chat history & saved conversations' },
    { name: 'Settings', href: '/settings', icon: Settings, description: '2025 features' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-chat-bg dark:bg-chat-dark-bg">
      {/* Sidebar */}
      <div className="w-80 bg-chat-surface border-r border-chat-border dark:bg-chat-dark-surface dark:border-chat-dark-border overflow-y-auto shadow-xl flex-shrink-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-6 border-b border-chat-border">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-100">AI Chat 2025</h1>
                <p className="text-sm text-blue-200">Latest GPT Models & Multi-modal AI</p>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-chat-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-chat-text">{user.name}</p>
                <p className="text-xs text-chat-muted">Online</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 group ${
                  isActive(item.href)
                    ? 'bg-primary-600 text-white'
                    : 'text-chat-muted hover:bg-chat-border hover:text-chat-text'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs opacity-75">{item.description}</p>
                </div>
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="w-1 h-6 bg-white rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-chat-border">
            <div className="flex items-center space-x-2 text-xs text-chat-muted">
              <Sparkles className="w-4 h-4" />
              <span>Powered by GPT-4.1 & o1 Models • Updated January 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white dark:bg-black">
        {/* Content area */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout 