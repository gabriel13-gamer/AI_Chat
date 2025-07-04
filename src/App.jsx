import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from './components/Layout'
import ChatInterface from './components/ChatInterface'
import LiveChat from './components/LiveChat'
import Settings from './components/Settings'
import DocumentChat from './components/DocumentChat'
import CodeChat from './components/CodeChat'
import History from './components/History'
import ImageGenerator from './components/ImageGenerator'

function App() {
  useEffect(() => {
    // Always set dark mode
    document.body.classList.remove('light')
    document.body.classList.add('dark')
  }, [])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ChatInterface />} />
        <Route path="/live-chat" element={<LiveChat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/documents" element={<DocumentChat />} />
        <Route path="/code" element={<CodeChat />} />
        <Route path="/images" element={<ImageGenerator />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Layout>
  )
}

export default App 