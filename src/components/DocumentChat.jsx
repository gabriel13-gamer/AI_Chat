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
      let prompt
      
      if (selectedDocument.name.toLowerCase().endsWith('.pdf')) {
        // Special handling for PDF documents
        prompt = `I have a PDF document called "${selectedDocument.name}" (${formatFileSize(selectedDocument.size)}) that I uploaded, but I couldn't extract the text content due to technical limitations.

The user is asking: "${question}"

Please help them with this question. If they're asking about the content of the PDF, explain that you can't see the actual content but can help them with:
1. Converting the PDF to other formats
2. General PDF-related questions
3. Alternative ways to work with the document
4. Technical support for PDF processing

If they're asking about the document itself (file size, format, etc.), you can answer based on the file information provided.

Please be helpful and provide practical solutions.`
      } else {
        // Normal document processing
        prompt = `Based on the following document content, please answer this question: "${question}"

Document: ${selectedDocument.name}
Content:
${selectedDocument.content}

Please provide a comprehensive answer based on the document content.`
      }

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
                  {selectedDocument.name.toLowerCase().endsWith('.pdf') ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-blue-600 dark:text-blue-400">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                            PDF Document: {selectedDocument.name}
                          </h3>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                            This PDF has been uploaded successfully. While text extraction is currently limited, 
                            you can still ask questions about the document and I'll help you work with it.
                          </p>
                          <div className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                            <p><strong>File Details:</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                              <li>Size: {formatFileSize(selectedDocument.size)}</li>
                              <li>Type: PDF document</li>
                              <li>Uploaded: {new Date(selectedDocument.uploadedAt).toLocaleDateString()}</li>
                            </ul>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                              Quick Actions:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => setQuestion("How can I convert this PDF to text?")}
                                className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                              >
                                Convert to Text
                              </button>
                              <button
                                onClick={() => setQuestion("What are the best tools to extract text from this PDF?")}
                                className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                              >
                                Text Extraction Tools
                              </button>
                              <button
                                onClick={() => setQuestion("Can you help me work with this PDF document?")}
                                className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-700 transition-colors"
                              >
                                Get Help
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <pre className="text-sm text-chat-text whitespace-pre-wrap bg-chat-bg p-3 rounded border border-chat-border">
                      {selectedDocument.content}
                    </pre>
                  )}
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
                    placeholder={
                      selectedDocument.name.toLowerCase().endsWith('.pdf') 
                        ? "Ask about this PDF document, request help with conversion, or ask general questions..."
                        : "Ask a question about this document..."
                    }
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