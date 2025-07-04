import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  MessageSquare,
  File,
  Image,
  Table
} from 'lucide-react'
import toast from 'react-hot-toast'
import useChatStore from '../store/chatStore'
import { sendMessage as sendOpenAIMessage } from '../services/openaiService'
import { processDocument, validateFile, createFilePreview, getFileType, formatFileSize } from '../utils/fileUtils'

const DocumentChat = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [question, setQuestion] = useState('')
  const fileInputRef = useRef(null)
  
  const { documents, addDocument, removeDocument, documentChatMessages: messages, addDocumentChatMessage: addMessage, user } = useChatStore()

  const handleFileUpload = async (files) => {
    for (const file of files) {
      const validation = validateFile(file)
      
      if (!validation.isValid) {
        toast.error(validation.errors[0])
        continue
      }

      try {
        setIsProcessing(true)
        toast.loading(`Processing ${file.name}...`, { id: file.name })
        
        const content = await processDocument(file)
        const preview = await createFilePreview(file)
        
        const document = {
          id: Date.now(),
          name: file.name,
          content,
          type: getFileType(file.name),
          size: file.size,
          preview,
          uploadedAt: new Date()
        }

        addDocument(document)
        toast.success(`Successfully uploaded ${file.name}`, { id: file.name })
      } catch (error) {
        console.error('Error processing file:', error)
        toast.error(`Failed to process ${file.name}: ${error.message}`, { id: file.name })
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleAskQuestion = async () => {
    if (!selectedDocument || !question.trim() || isProcessing) return

    const userMessage = {
      role: 'user',
      content: `Question about "${selectedDocument.name}": ${question}`,
      timestamp: new Date(),
      documentId: selectedDocument.id
    }

    addMessage(userMessage)
    setQuestion('')
    setIsProcessing(true)

    try {
      const prompt = `Based on the following document content, please answer this question: "${question}"

Document: ${selectedDocument.name}
Content:
${selectedDocument.content}

Please provide a comprehensive answer based on the document content.`

      const aiResponse = await sendOpenAIMessage([
        { role: 'user', content: prompt }
      ], user?.name || 'User')
      
      const aiMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        documentId: selectedDocument.id
      }

      addMessage(aiMessage)
    } catch (error) {
      console.error('Error asking question:', error)
      toast.error('Failed to get answer')
    } finally {
      setIsProcessing(false)
    }
  }

  const getFileIcon = (type) => {
    switch (type) {
      case 'DOCUMENT':
        return <FileText className="w-5 h-5" />
      case 'IMAGE':
        return <Image className="w-5 h-5" />
      case 'SPREADSHEET':
        return <Table className="w-5 h-5" />
      default:
        return <File className="w-5 h-5" />
    }
  }

  const downloadDocument = (document) => {
    const blob = new Blob([document.content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = document.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const documentMessages = messages.filter(msg => msg.documentId === selectedDocument?.id)

  return (
    <div className="h-full flex flex-col p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-chat-text mb-2">Document Chat 2025</h1>
          <p className="text-chat-muted">Advanced document analysis with latest GPT models</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document List */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-chat-text">Documents</h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="btn-primary"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedDocument?.id === doc.id
                      ? 'border-primary-500 bg-primary-500 bg-opacity-10'
                      : 'border-chat-border hover:border-chat-muted'
                  }`}
                  onClick={() => setSelectedDocument(doc)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-chat-muted">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-chat-text truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-chat-muted">
                        {formatFileSize(doc.size)} • {doc.type}
                      </p>
                      <p className="text-xs text-chat-muted">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadDocument(doc)
                        }}
                        className="p-1 text-chat-muted hover:text-chat-text"
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeDocument(doc.id)
                          if (selectedDocument?.id === doc.id) {
                            setSelectedDocument(null)
                          }
                        }}
                        className="p-1 text-red-500 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {documents.length === 0 && (
                <div className="text-center py-8 text-chat-muted">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No documents uploaded yet</p>
                  <p className="text-sm">Upload a document to start chatting about it</p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => handleFileUpload(Array.from(e.target.files))}
              className="hidden"
              accept=".txt,.md,.pdf,.docx,.xlsx,.csv,.json"
            />
          </div>

          {/* Document Content */}
          <div className="card">
            <h2 className="text-xl font-semibold text-chat-text mb-4">
              {selectedDocument ? selectedDocument.name : 'Document Content'}
            </h2>

            {selectedDocument ? (
              <div className="space-y-4">
                {selectedDocument.preview && (
                  <div className="mb-4">
                    <img 
                      src={selectedDocument.preview} 
                      alt={selectedDocument.name}
                      className="max-w-full h-auto rounded border border-chat-border"
                    />
                  </div>
                )}
                
                <div className="max-h-96 overflow-y-auto">
                  <pre className="text-sm text-chat-text whitespace-pre-wrap bg-chat-bg p-3 rounded border border-chat-border">
                    {selectedDocument.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-chat-muted">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a document to view its content</p>
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="card">
            <h2 className="text-xl font-semibold text-chat-text mb-4">Chat</h2>

            {selectedDocument ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 space-y-4 max-h-64 overflow-y-auto mb-4">
                  {documentMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`message-bubble ${message.role === 'user' ? 'message-user' : 'message-ai'}`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-chat-muted mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about this document..."
                    className="chat-input w-full resize-none"
                    rows={3}
                  />
                  <button
                    onClick={handleAskQuestion}
                    disabled={!question.trim() || isProcessing}
                    className="btn-primary w-full"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Asking...' : 'Ask Question'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-chat-muted">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Select a document to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default DocumentChat 