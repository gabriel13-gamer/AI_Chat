import React from 'react'

const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="message-bubble message-ai">
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot" style={{ animationDelay: '0.2s' }}></div>
        <div className="typing-dot" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
)

export default TypingIndicator 