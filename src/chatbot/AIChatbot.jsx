import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Trash2 } from 'lucide-react';
import { getChatCompletion } from '../services/chatService';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [{ role: 'assistant', content: "Hello! I'm your dashboard assistant. Ask me anything about the ISS or recent news!" }];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chat_history', JSON.stringify(messages.slice(-30)));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Pass the updated history for context
      const history = [...messages, userMsg];
      const reply = await getChatCompletion(history);
      
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared. How can I help you?" }]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-all transform hover:scale-105 z-50 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open Chat"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col transition-all duration-300 transform origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-blue-600 text-white rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <h3 className="font-semibold">Dashboard AI</h3>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={clearChat} className="p-1 hover:bg-blue-700 rounded transition-colors" title="Clear Chat">
              <Trash2 size={16} />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-blue-700 rounded transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-600 shadow-sm rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-2 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-slate-600 dark:text-slate-300">
                  <Bot size={14} />
                </div>
                <div className="p-3 bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 shadow-sm rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              disabled={isTyping}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white disabled:opacity-50 transition-shadow"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
