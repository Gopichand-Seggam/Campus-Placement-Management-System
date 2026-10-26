import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../../api/client';
import { Send, Bot, User, Trash2, Sparkles, ExternalLink } from 'lucide-react';

const SUGGESTIONS = [
  'How to prepare for a technical interview?',
  'React resources and tutorials',
  'Java learning resources',
  'DSA practice resources',
  'Python resources',
  'SQL and database resources',
  'System design resources',
  'How to build a good resume?',
  'Spring Boot resources',
  'Cloud and DevOps resources',
];

/* Parse markdown-style links and bold text in message content */
function MessageContent({ content }) {
  // Split content by lines for formatting
  const lines = content.split('\n');

  return (
    <div style={{ lineHeight: 1.7 }}>
      {lines.map((line, li) => {
        // Parse **bold** and [text](url) links within a line
        const parts = [];
        const regex = /(\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(<span key={`t-${lastIndex}`}>{line.slice(lastIndex, match.index)}</span>);
          }
          if (match[2]) {
            // **bold**
            parts.push(<strong key={`b-${match.index}`}>{match[2]}</strong>);
          } else if (match[3] && match[4]) {
            // [text](url)
            parts.push(
              <a key={`a-${match.index}`} href={match[4]} target="_blank" rel="noreferrer"
                style={{ color: '#C72C41', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3, borderBottom: '1px solid rgba(96,165,250,0.4)' }}>
                {match[3]} <ExternalLink size={11} />
              </a>
            );
          }
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < line.length) {
          parts.push(<span key={`t-end-${li}`}>{line.slice(lastIndex)}</span>);
        }

        return (
          <div key={li} style={{ minHeight: line === '' ? '0.5em' : undefined }}>
            {parts.length > 0 ? parts : <span>{line}</span>}
          </div>
        );
      })}
    </div>
  );
}

export default function AIChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    chatAPI.getHistory().then(r => {
      if (r.data.length === 0) {
        setMessages([{
          id: 0, role: 'assistant',
          content: "👋 Hello! I'm your **AI Career Assistant** ✨\n\nI can help you with:\n• 📚 **Learning Resources** — Ask: 'React resources', 'Java resources', 'DSA resources'\n• 🎯 **Interview Preparation** — Tips, strategies, common questions\n• 📄 **Resume Building** — Format, content, ATS tips\n• 🏗️ **System Design** — Architecture patterns\n• ☁️ **Cloud & DevOps** — AWS, Docker, Kubernetes\n\nWhat would you like help with today?",
          timestamp: new Date().toISOString()
        }]);
      } else {
        setMessages(r.data);
      }
    });
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const send = async (text) => {
    const content = text || input.trim();
    if (!content) return;
    setInput('');
    const userMsg = { id: Date.now(), role: 'user', content, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    try {
      const r = await chatAPI.send(content);
      setMessages(prev => [...prev, r.data]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Sorry, I encountered an error. Please try again!', timestamp: new Date().toISOString() }]);
    } finally { setTyping(false); }
  };

  const clearChat = async () => {
    await chatAPI.clearHistory();
    setMessages([{ id: 0, role: 'assistant', content: 'Chat cleared! How can I help you today? 🚀', timestamp: new Date().toISOString() }]);
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 820 }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} color="white" />
          </div>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.5rem' }}>AI Career Assistant</h1>
            <p className="text-secondary text-sm">Placement prep · Resources · Interview tips</p>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={clearChat} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Trash2 size={14} /> Clear Chat
        </button>
      </div>

      {/* Chat Window */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', flexDirection: 'column', height: 520, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {messages.map((msg, i) => (
            <div key={msg.id || i}
              style={{ display: 'flex', gap: 10, marginBottom: 20, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'slideUp 0.3s ease' }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                  <Bot size={16} color="white" />
                </div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '12px 16px',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-card)',
                border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                fontSize: '0.88rem',
              }}>
                {msg.role === 'assistant'
                  ? <MessageContent content={msg.content} />
                  : msg.content
                }
                <div style={{ fontSize: '0.7rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)', marginTop: 6, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </div>
              </div>
              {msg.role === 'user' && (
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 4 }}>
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={16} color="white" />
              </div>
              <div style={{ padding: '12px 20px', borderRadius: '18px 18px 18px 4px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-blue)', animation: `pulse 1.2s ease ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <input
            className="form-input"
            style={{ flex: 1 }}
            placeholder="Ask about resources, interview tips, resume help..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && !typing && send()}
            disabled={typing}
          />
          <button className="btn btn-primary" onClick={() => send()} disabled={!input.trim() || typing}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10 }}>💡 Try asking:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => send(s)} className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', padding: '5px 12px' }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
