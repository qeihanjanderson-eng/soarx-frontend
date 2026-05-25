'use client';

import React from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function Chat({ messages, onSendMessage, isLoading }: ChatProps) {
  const [message, setMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const resizeTextarea = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  };

  React.useEffect(() => {
    scrollToBottom();
    resizeTextarea();
  }, [messages, message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="chat-history flex-1 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-white mb-3">Welcome to SoarX</h2>
              <p className="text-sm text-white/70">
                Start by uploading a file or asking a question for finance insights.
              </p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-bubble ${
              message.role === 'user' ? 'chat-message-user self-end' : 'chat-message-ai self-start'
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
            <div className="chat-meta">{message.role === 'user' ? 'You' : 'SoarX'}</div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-bubble chat-message-ai self-start">
            <p className="text-sm leading-relaxed">Thinking through your request...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-footer sticky bottom-0 z-10 flex items-end gap-3 bg-slate-950/95 px-4 py-4 shadow-[0_-18px_50px_rgba(0,0,0,0.24)] sm:px-6">
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="input-glass min-h-[44px] max-h-36 w-full resize-none overflow-hidden rounded-full px-4 py-3 text-sm leading-6"
        />
        <button type="submit" disabled={isLoading || !message.trim()} className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}
