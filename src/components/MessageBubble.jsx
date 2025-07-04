import React from 'react'
import { Bot, User, Paperclip, Copy, Check, Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

const MessageBubble = ({ message, onCopy, onDownload, copied, features }) => {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`message-bubble ${isUser ? 'message-user' : 'message-ai'} max-w-3xl`}>
        <div className="flex items-start space-x-3">
          {!isUser && (
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            {message.file && (
              <div className="mb-3 p-3 bg-chat-bg rounded border border-chat-border">
                <div className="flex items-center space-x-2 mb-2">
                  <Paperclip className="w-4 h-4 text-chat-muted" />
                  <span className="text-sm font-medium">{message.file.name}</span>
                </div>
                {message.file.preview && (
                  <img 
                    src={message.file.preview} 
                    alt={message.file.name}
                    className="max-w-full h-auto rounded"
                  />
                )}
              </div>
            )}
            
            <div className="prose prose-invert max-w-none">
              {features.markdownRendering ? (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={tomorrow}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-chat-muted">
              <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onCopy(message.content, message.id)}
                  className="p-1 hover:text-chat-text transition-colors"
                  title="Copy message"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => onDownload(message.content, `message-${message.id}.txt`)}
                  className="p-1 hover:text-chat-text transition-colors"
                  title="Download message"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
          
          {isUser && (
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble 