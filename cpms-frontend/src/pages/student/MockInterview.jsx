import { useState } from 'react';
import { chatAPI } from '../../api/client';
import { Bot, User, Send, Play, RotateCcw, Star, CheckCircle } from 'lucide-react';

const ROLES = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Analyst', 'DevOps Engineer', 'Android Developer', 'Machine Learning Engineer', 'Business Analyst', 'Product Manager'];

const ROLE_INTROS = {
  'Software Engineer': "Great choice! Let's start your Software Engineer mock interview. I'll ask both technical and behavioral questions. Ready? Let's go!\n\n**Q1:** Can you tell me about yourself and your experience in software development?",
  'Frontend Developer': "Excellent! Let's simulate a Frontend Developer interview. Expect HTML/CSS/JS, React, and design questions.\n\n**Q1:** What is the difference between **CSS Flexbox** and **CSS Grid**? When would you use each?",
  'Backend Developer': "Let's begin your Backend Developer mock interview. Expect API design, database, and system questions.\n\n**Q1:** Explain the difference between **REST** and **GraphQL**. Which would you choose and why?",
  'Full Stack Developer': "Let's begin! I'll cover both frontend and backend topics for Full Stack.\n\n**Q1:** Walk me through how you would build a **user authentication system** from scratch. What tech would you use?",
  'Data Analyst': "Let's start your Data Analyst interview. Expect SQL, statistics, and Python questions.\n\n**Q1:** Given a table of sales data, how would you write a **SQL query** to find the top 5 products by revenue in the last 30 days?",
  'DevOps Engineer': "Let's simulate a DevOps interview. Expect CI/CD, containerization, and cloud questions.\n\n**Q1:** Explain the **CI/CD pipeline** you would set up for a microservices application. What tools would you use?",
  'default': "Welcome to the mock interview! I'll ask tailored questions for your selected role.\n\n**Q1:** Tell me about yourself and why you're interested in this role?"
};

export default function MockInterview() {
  const [selectedRole, setSelectedRole] = useState('');
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [qCount, setQCount] = useState(0);

  const startInterview = () => {
    const intro = ROLE_INTROS[selectedRole] || ROLE_INTROS['default'];
    setMessages([{ role: 'assistant', content: intro }]);
    setStarted(true);
    setQCount(1);
  };

  const reset = () => { setStarted(false); setMessages([]); setInput(''); setQCount(0); setSelectedRole(''); };

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const prompt = `You are conducting a ${selectedRole} mock interview. The candidate just answered question ${qCount}:\n\nCandidate: "${userMsg.content}"\n\nPlease:\n1. Give brief feedback on their answer (1-2 sentences, encouraging but honest)\n2. Rate their answer: ⭐⭐⭐⭐⭐ (show the right number of stars)\n3. Ask the next interview question (Q${qCount + 1})\n\nIf this is question ${qCount >= 5 ? 'the final question or beyond' : qCount}, after Q5 give a final summary with overall performance and tips instead of next question.`;
      const r = await chatAPI.send(prompt);
      setMessages(prev => [...prev, { role: 'assistant', content: r.data.content }]);
      setQCount(q => q + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble generating the next question. Please try again.' }]);
    } finally { setLoading(false); }
  };

  if (!started) {
    return (
      <div className="page-container animate-fade-in" style={{ maxWidth: 600 }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">AI Mock Interview</h1>
            <p className="text-secondary">Practice with an AI interviewer and get real-time feedback</p>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 600 }}>Select Your Interview Role</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {ROLES.map(role => (
              <div key={role} onClick={() => setSelectedRole(role)}
                style={{ padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${selectedRole === role ? 'var(--accent-blue)' : 'var(--border)'}`, background: selectedRole === role ? 'rgba(59, 130, 246,0.12)' : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.15s', fontSize: '0.88rem', fontWeight: 500 }}>
                {role}
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: 20, background: 'var(--bg-card-hover)' }}>
            <h4 style={{ marginBottom: 10, fontSize: '0.9rem', fontWeight: 600 }}>What to expect:</h4>
            <ul style={{ margin: 0, padding: '0 0 0 16px', color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 2 }}>
              <li>5–6 technical and behavioral questions</li>
              <li>AI feedback on each answer with star rating</li>
              <li>Final performance summary with improvement tips</li>
            </ul>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px' }}
            onClick={startInterview} disabled={!selectedRole}>
            <Play size={18} /> Start Interview as {selectedRole || 'Selected Role'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Mock Interview: {selectedRole}</h1>
          <p className="text-secondary">Question {Math.min(qCount, 5)} of 5 · Answer naturally, as you would in a real interview</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RotateCcw size={14} /> New Interview
        </button>
      </div>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', flexDirection: 'column', height: 460, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 18, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.role === 'assistant' && <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bot size={16} color="white" /></div>}
              <div style={{ maxWidth: '78%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-card)', border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none', fontSize: '0.88rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
              {msg.role === 'user' && <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User size={16} /></div>}
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Bot size={16} color="white" /></div>
              <div style={{ padding: '12px 20px', borderRadius: '16px 16px 16px 4px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent-blue)', animation: `pulse 1.2s ease ${i*0.2}s infinite` }} />)}
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
          <textarea className="form-input" style={{ flex: 1, resize: 'none', minHeight: 68 }}
            placeholder="Type your answer here..." value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey && !loading) send(); }}
            disabled={loading} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button className="btn btn-primary" onClick={send} disabled={!input.trim() || loading} style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              <Send size={15} /> Send
            </button>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>Ctrl+Enter</div>
          </div>
        </div>
      </div>
    </div>
  );
}
