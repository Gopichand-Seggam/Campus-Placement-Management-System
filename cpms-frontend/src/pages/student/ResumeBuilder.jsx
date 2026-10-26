import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Download, Palette, Eye } from 'lucide-react';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', accent: '#3b82f6' },
  { id: 'classic', name: 'Classic', accent: '#10b981' },
  { id: 'bold', name: 'Bold', accent: '#801336' },
];

export default function ResumeBuilder() {
  const { user } = useAuth();
  const [template, setTemplate] = useState('modern');
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '', location: '', linkedin: '', github: '',
    objective: '',
    skills: '',
    education: [{ degree: '', institution: '', year: '', cgpa: '' }],
    experience: [{ role: '', company: '', duration: '', description: '' }],
    projects: [{ name: '', tech: '', description: '' }],
  });

  const accent = TEMPLATES.find(t => t.id === template)?.accent || '#3b82f6';

  const updEdu = (i, k, v) => setForm(f => ({ ...f, education: f.education.map((e, idx) => idx === i ? {...e, [k]: v} : e) }));
  const updExp = (i, k, v) => setForm(f => ({ ...f, experience: f.experience.map((e, idx) => idx === i ? {...e, [k]: v} : e) }));
  const updProj = (i, k, v) => setForm(f => ({ ...f, projects: f.projects.map((p, idx) => idx === i ? {...p, [k]: v} : p) }));

  const printResume = () => {
    const printWin = window.open('', '_blank');
    const skills = form.skills.split(',').filter(Boolean);
    printWin.document.write(`<!DOCTYPE html><html><head><title>${form.name} Resume</title><style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; line-height: 1.5; padding: 30px; }
      h1 { font-size: 26px; color: ${accent}; } .subtitle { color: #666; font-size: 13px; margin-bottom: 6px; }
      .contact { color: #666; font-size: 12px; margin-bottom: 16px; }
      .section { margin-top: 18px; } .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${accent}; border-bottom: 2px solid ${accent}; padding-bottom: 4px; margin-bottom: 10px; }
      .item { margin-bottom: 10px; } .item-header { display: flex; justify-content: space-between; font-weight: 600; font-size: 13px; }
      .item-sub { color: #555; font-size: 12px; } p { font-size: 12px; color: #444; margin-top: 3px; }
      .skills { display: flex; flex-wrap: wrap; gap: 6px; } .skill { background: ${accent}22; border: 1px solid ${accent}44; borderRadius: 20px; padding: 3px 12px; font-size: 12px; color: ${accent}; font-weight: 500; border-radius: 20px; }
      @media print { body { padding: 20px; } }
    </style></head><body>
      <h1>${form.name}</h1>
      <div class="subtitle">${form.email} ${form.phone ? '· ' + form.phone : ''} ${form.location ? '· ' + form.location : ''}</div>
      <div class="contact">${form.linkedin ? '🔗 LinkedIn: ' + form.linkedin + '  ' : ''}${form.github ? '💻 GitHub: ' + form.github : ''}</div>
      ${form.objective ? `<div class="section"><div class="section-title">Objective</div><p>${form.objective}</p></div>` : ''}
      ${skills.length > 0 ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${skills.map(s => `<span class="skill">${s.trim()}</span>`).join('')}</div></div>` : ''}
      <div class="section"><div class="section-title">Education</div>${form.education.filter(e => e.degree).map(e => `<div class="item"><div class="item-header"><span>${e.degree}</span><span>${e.year}</span></div><div class="item-sub">${e.institution} ${e.cgpa ? '· CGPA: ' + e.cgpa : ''}</div></div>`).join('')}</div>
      ${form.experience.filter(e => e.role).length > 0 ? `<div class="section"><div class="section-title">Experience</div>${form.experience.filter(e => e.role).map(e => `<div class="item"><div class="item-header"><span>${e.role}</span><span>${e.duration}</span></div><div class="item-sub">${e.company}</div><p>${e.description}</p></div>`).join('')}</div>` : ''}
      ${form.projects.filter(p => p.name).length > 0 ? `<div class="section"><div class="section-title">Projects</div>${form.projects.filter(p => p.name).map(p => `<div class="item"><div class="item-header"><span>${p.name}</span><span style="color:#888;font-size:12px">${p.tech}</span></div><p>${p.description}</p></div>`).join('')}</div>` : ''}
    </body></html>`);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); }, 300);
  };

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resume Builder</h1>
          <p className="text-secondary">Build a professional resume and export it as PDF</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => window.location.href = `/portfolio/${user?.id}`}>
            <Eye size={14} /> Portfolio
          </button>
          <button className="btn btn-primary" onClick={printResume} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Template Picker */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {TEMPLATES.map(t => (
          <div key={t.id} onClick={() => setTemplate(t.id)}
            style={{ padding: '10px 20px', borderRadius: 10, border: `2px solid ${template === t.id ? t.accent : 'var(--border)'}`, background: template === t.id ? `${t.accent}15` : 'var(--bg-card)', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: t.accent }} />
            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: template === t.id ? t.accent : 'var(--text-secondary)' }}>{t.name}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        {/* Form */}
        <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Personal */}
          <div className="card">
            <h3 style={{ marginBottom: 14, fontWeight: 600 }}>Personal Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[['name','Full Name'],['email','Email'],['phone','Phone'],['location','Location'],['linkedin','LinkedIn URL'],['github','GitHub URL']].map(([k,l]) => (
                <div key={k} className="form-group"><label className="form-label">{l}</label><input className="form-input" value={form[k]} onChange={e => setForm(f => ({...f, [k]: e.target.value}))} /></div>
              ))}
            </div>
            <div className="form-group" style={{ marginTop: 12 }}><label className="form-label">Career Objective</label><textarea className="form-input" rows={2} value={form.objective} onChange={e => setForm(f => ({...f, objective: e.target.value}))} placeholder="Brief professional summary..." /></div>
            <div className="form-group" style={{ marginTop: 12 }}><label className="form-label">Skills (comma-separated)</label><input className="form-input" value={form.skills} onChange={e => setForm(f => ({...f, skills: e.target.value}))} placeholder="React, Java, MySQL..." /></div>
          </div>

          {/* Education */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontWeight: 600 }}>Education</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setForm(f => ({...f, education: [...f.education, {degree:'',institution:'',year:'',cgpa:''}]}))}>+ Add</button>
            </div>
            {form.education.map((edu, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div className="form-group"><label className="form-label">Degree</label><input className="form-input" value={edu.degree} onChange={e => updEdu(i,'degree',e.target.value)} placeholder="B.Tech Computer Science" /></div>
                <div className="form-group"><label className="form-label">Institution</label><input className="form-input" value={edu.institution} onChange={e => updEdu(i,'institution',e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Year</label><input className="form-input" value={edu.year} onChange={e => updEdu(i,'year',e.target.value)} placeholder="2020-2024" /></div>
                <div className="form-group"><label className="form-label">CGPA</label><input className="form-input" value={edu.cgpa} onChange={e => updEdu(i,'cgpa',e.target.value)} /></div>
              </div>
            ))}
          </div>

          {/* Experience */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontWeight: 600 }}>Experience</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setForm(f => ({...f, experience: [...f.experience, {role:'',company:'',duration:'',description:''}]}))}>+ Add</button>
            </div>
            {form.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 8 }}>
                  <div className="form-group"><label className="form-label">Role / Job Title</label><input className="form-input" value={exp.role} onChange={e => updExp(i,'role',e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Company</label><input className="form-input" value={exp.company} onChange={e => updExp(i,'company',e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Duration</label><input className="form-input" value={exp.duration} onChange={e => updExp(i,'duration',e.target.value)} placeholder="Jan 2023 - Present" /></div>
                </div>
                <div className="form-group">
                  <textarea className="form-input" rows={2} placeholder="Description of responsibilities..." value={exp.description} onChange={e => updExp(i,'description',e.target.value)} />
                </div>
              </div>
            ))}
          </div>

          {/* Projects */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontWeight: 600 }}>Projects</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setForm(f => ({...f, projects: [...f.projects, {name:'',tech:'',description:''}]}))}>+ Add</button>
            </div>
            {form.projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
                  <div className="form-group"><label className="form-label">Project Name</label><input className="form-input" value={pr.name} onChange={e => updProj(i,'name',e.target.value)} /></div>
                  <div className="form-group"><label className="form-label">Tech Stack</label><input className="form-input" value={pr.tech} onChange={e => updProj(i,'tech',e.target.value)} placeholder="React, Node.js, MySQL" /></div>
                </div>
                <div className="form-group">
                  <textarea className="form-input" rows={2} placeholder="Brief description..." value={pr.description} onChange={e => updProj(i,'description',e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        <div className="card" style={{ flex: '1 1 350px', minWidth: 350, position: 'sticky', top: 20, padding: 24, background: 'white', color: '#1a1a2e', fontSize: 12, lineHeight: 1.6 }}>
          <h1 style={{ fontSize: 22, color: accent, marginBottom: 2 }}>{form.name || 'Your Name'}</h1>
          <p style={{ color: '#666', fontSize: 11, marginBottom: 4 }}>{form.email} {form.phone && '· ' + form.phone} {form.location && '· ' + form.location}</p>
          {(form.linkedin || form.github) && <p style={{ color: '#666', fontSize: 11, marginBottom: 10 }}>{form.linkedin && '🔗 ' + form.linkedin} {form.github && '  💻 ' + form.github}</p>}
          {form.objective && <><div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 12 }}>Objective</div><p style={{ color: '#555', fontSize: 11 }}>{form.objective}</p></>}
          {form.skills && <><div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 12 }}>Skills</div><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{form.skills.split(',').filter(Boolean).map(s => <span key={s} style={{ background: `${accent}18`, border: `1px solid ${accent}33`, borderRadius: 12, padding: '2px 8px', fontSize: 10, color: accent }}>{s.trim()}</span>)}</div></>}
          <div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 12 }}>Education</div>
          {form.education.filter(e => e.degree).map((e, i) => <div key={i} style={{ marginBottom: 6 }}><div style={{ fontWeight: 600, fontSize: 11, display: 'flex', justifyContent: 'space-between' }}><span>{e.degree}</span><span style={{ color: '#888' }}>{e.year}</span></div><div style={{ color: '#666', fontSize: 10 }}>{e.institution} {e.cgpa && '· ' + e.cgpa}</div></div>)}
          {form.experience.filter(e => e.role).length > 0 && <><div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 12 }}>Experience</div>{form.experience.filter(e => e.role).map((e, i) => <div key={i} style={{ marginBottom: 6 }}><div style={{ fontWeight: 600, fontSize: 11, display: 'flex', justifyContent: 'space-between' }}><span>{e.role}</span><span style={{ color: '#888' }}>{e.duration}</span></div><div style={{ color: '#666', fontSize: 10 }}>{e.company}</div><p style={{ color: '#555', fontSize: 10 }}>{e.description}</p></div>)}</>}
          {form.projects.filter(p => p.name).length > 0 && <><div style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: accent, borderBottom: `1.5px solid ${accent}`, paddingBottom: 3, marginBottom: 8, marginTop: 12 }}>Projects</div>{form.projects.filter(p => p.name).map((p, i) => <div key={i} style={{ marginBottom: 6 }}><div style={{ fontWeight: 600, fontSize: 11 }}>{p.name} <span style={{ color: '#888', fontWeight: 400 }}>{p.tech}</span></div><p style={{ color: '#555', fontSize: 10 }}>{p.description}</p></div>)}</>}
        </div>
      </div>
    </div>
  );
}
