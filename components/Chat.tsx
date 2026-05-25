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

  const formatTimestamp = (timestamp: Date) =>
    timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
      <div className="chat-history flex-1 px-2 sm:px-6">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center px-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-white mb-3">Welcome to SoarX</h2>
              <p className="text-sm text-white/70">
                Start by uploading a file or asking a question to get finance insights instantly.
              </p>
            </div>
          </div>
        )}

        {messages.map((messageItem) => (
          <div
            key={messageItem.id}
            className={`chat-bubble ${
              messageItem.role === 'user' ? 'chat-message-user self-end' : 'chat-message-ai self-start'
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{messageItem.content}</p>
            <div className="chat-meta">
              {messageItem.role === 'user' ? 'You' : 'SoarX'} • {formatTimestamp(messageItem.timestamp)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-bubble chat-message-ai self-start">
            <p className="text-sm leading-relaxed">SoarX is thinking through your request...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="chat-footer sticky bottom-0 z-10 flex flex-col gap-3 bg-slate-950/95 px-4 py-4 shadow-[0_-18px_50px_rgba(0,0,0,0.24)] sm:flex-row sm:items-end sm:px-6"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask SoarX to summarize, analyze, or fill your workbook..."
          disabled={isLoading}
          autoFocus
          className="input-glass min-h-[48px] max-h-36 w-full resize-none overflow-hidden rounded-full border border-white/10 bg-slate-950/90 px-4 py-3 text-sm leading-6 text-white placeholder:text-white/40"
        />
        <button type="submit" disabled={isLoading || !message.trim()} className="send-button w-full sm:w-auto">
          Send
        </button>
      </form>
    </div>
  );
}
