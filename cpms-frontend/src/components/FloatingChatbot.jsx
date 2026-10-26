import { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../api/client';
import { MessageCircle, X, Minimize2, Send, Bot, User, Sparkles, ExternalLink, PlusCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Link + Bold markdown renderer ─────────────────────────────────────────── */
function MsgContent({ content }) {
  return (
    <div style={{ lineHeight: 1.7, fontSize: '0.86rem' }}>
      {content.split('\n').map((line, li) => {
        const parts = [];
        const regex = /(\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\)]+)\))/g;
        let last = 0, match;
        while ((match = regex.exec(line)) !== null) {
          if (match.index > last) parts.push(<span key={`t${last}`}>{line.slice(last, match.index)}</span>);
          if (match[2]) parts.push(<strong key={`b${match.index}`}>{match[2]}</strong>);
          else parts.push(<a key={`a${match.index}`} href={match[4]} target="_blank" rel="noreferrer"
            style={{ color: '#C72C41', textDecoration: 'none', borderBottom: '1px solid rgba(96,165,250,0.4)', display:'inline-flex', alignItems:'center', gap:2 }}>
            {match[3]}<ExternalLink size={10} />
          </a>);
          last = match.index + match[0].length;
        }
        if (last < line.length) parts.push(<span key={`te${li}`}>{line.slice(last)}</span>);
        return <div key={li} style={{ minHeight: line === '' ? '0.6em' : undefined }}>{parts.length ? parts : line}</div>;
      })}
    </div>
  );
}

export default function FloatingChatbot() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef(null);

  // Initial load logic: Just reset or show nothing if no session exists yet.
  useEffect(() => {
    if (!user) return;
    if (currentSessionId) {
        chatAPI.getHistory(currentSessionId).then(r => {
            if (r.data.length === 0) {
                setMessages([{ id: 0, role: 'assistant', content: "👋 Hi! I'm your **AI Career Assistant**. Ask me about interview prep, resources, resume tips, or any tech topic!", timestamp: new Date().toISOString() }]);
            } else {
                setMessages(r.data);
            }
        }).catch(() => {});
    } else {
        setMessages([{ id: 0, role: 'assistant', content: "👋 Hi! I'm your **AI Career Assistant**. Ask me about interview prep, resources, resume tips, or any tech topic!", timestamp: new Date().toISOString() }]);
    }
  }, [user, currentSessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant') setUnread(u => u + 1);
    }
  }, [messages]);

  useEffect(() => { if (open) setUnread(0); }, [open]);

  // Listen for external open trigger (e.g. from Quick Actions button)
  useEffect(() => {
    const handler = () => { setOpen(true); setMinimized(false); };
    window.addEventListener('open-chatbot', handler);
    return () => window.removeEventListener('open-chatbot', handler);
  }, []);

  if (!user) return null;

  const handleOpen = async () => {
      setOpen(true);
      setMinimized(false);
      if (!currentSessionId) {
          try {
              const res = await chatAPI.createSession();
              setCurrentSessionId(res.data.id);
          } catch (e) {
              console.error("Failed to create chat session", e);
          }
      }
  }

  const send = async (text) => {
    const content = text || input.trim();
    if (!content) return;
    setInput('');
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content, timestamp: new Date().toISOString() }]);
    setTyping(true);
    
    // Ensure we have a session before sending
    let sessionId = currentSessionId;
    if (!sessionId) {
        try {
            const res = await chatAPI.createSession();
            sessionId = res.data.id;
            setCurrentSessionId(sessionId);
        } catch (e) {
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Oops, failed to start a session!', timestamp: new Date().toISOString() }]);
            setTyping(false);
            return;
        }
    }

    try {
      const r = await chatAPI.send(sessionId, content);
      setMessages(prev => [...prev, r.data]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: 'Oops, something went wrong. Please try again!', timestamp: new Date().toISOString() }]);
    } finally { setTyping(false); }
  };

  const newChat = async () => {
    try {
        const res = await chatAPI.createSession();
        setCurrentSessionId(res.data.id);
        setMessages([{ id: 0, role: 'assistant', content: "Hello! I'm your AI Interview Assistant. How can I help you prepare today?", timestamp: new Date().toISOString() }]);
    } catch (e) {
        console.error("Failed to create new session", e);
    }
  };

  const deleteChat = async () => {
    if (!currentSessionId) return;
    try {
        await chatAPI.deleteSession(currentSessionId);
        setCurrentSessionId(null);
        setMessages([{ id: 0, role: 'assistant', content: "Chat deleted! How can I help you today? 🚀", timestamp: new Date().toISOString() }]);
    } catch (e) {
        console.error("Failed to delete session", e);
    }
  };



  const QUICK = ['React resources', 'Java resources', 'DSA resources', 'Interview tips', 'Resume help'];

  return (
    <>
      {/* Floating Button */}
      {(!open || minimized) && (
        <button onClick={handleOpen}
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
            width: 58, height: 58, borderRadius: '50%',
            background: 'var(--gradient-primary)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 32px rgba(99,102,241,0.7)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(99,102,241,0.5)'; }}>
          <MessageCircle size={26} color="white" fill="white" />
          {unread > 0 && (
            <span style={{ position: 'absolute', top: -4, right: -4, width: 20, height: 20, borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: '0.68rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-primary)' }}>
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Chat Panel */}
      {open && !minimized && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          width: 380, height: 520, borderRadius: 20,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          animation: 'slideUp 0.25s ease',
        }}>
          {/* Header */}
          <div style={{ padding: '14px 16px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>AI Career Assistant</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>● Online · Powered by CPMS</div>
            </div>
            <button onClick={newChat} title="New chat" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 14, cursor: 'pointer', color: 'white', padding: '4px 8px', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}><PlusCircle size={13} /> New</button>
            <button onClick={deleteChat} title="Delete chat session" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4, marginLeft: 2 }} onMouseEnter={e => e.currentTarget.style.color='white'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,0.7)'}><Trash2 size={13} /></button>
            <button onClick={() => setMinimized(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}><Minimize2 size={14} /></button>
            <button onClick={() => { setOpen(false); setMinimized(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)', padding: 4 }}><X size={16} /></button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px' }}>
            {messages.map((msg, i) => (
              <div key={msg.id || i} style={{ display: 'flex', gap: 8, marginBottom: 14, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role === 'assistant' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <Bot size={14} color="white" />
                  </div>
                )}
                <div style={{
                  maxWidth: '80%', padding: '10px 13px',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-card)',
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                }}>
                  {msg.role === 'assistant' ? <MsgContent content={msg.content} /> : <span style={{ fontSize: '0.86rem' }}>{msg.content}</span>}
                </div>
                {msg.role === 'user' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <User size={14} />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={14} color="white" />
                </div>
                <div style={{ padding: '10px 16px', borderRadius: '16px 16px 16px 4px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', gap: 5, alignItems: 'center' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-blue)', animation: `pulse 1.2s ease ${i*0.2}s infinite` }} />)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions */}
          <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {QUICK.map(s => (
              <button key={s} onClick={() => send(s)} style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !typing && send()}
              placeholder="Ask anything..." disabled={typing}
              style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', color: 'var(--text-primary)', fontSize: '0.86rem', outline: 'none' }} />
            <button onClick={() => send()} disabled={!input.trim() || typing}
              style={{ width: 36, height: 36, borderRadius: 10, background: input.trim() ? 'var(--gradient-primary)' : 'var(--bg-card)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', flexShrink: 0 }}>
              <Send size={15} color={input.trim() ? 'white' : 'var(--text-muted)'} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}
