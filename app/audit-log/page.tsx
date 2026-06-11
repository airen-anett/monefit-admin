'use client';
import { useState } from 'react';
import Link from 'next/link';
import { GLOBAL_AUDIT_LOG } from '../lib/data';

const CATEGORIES = ['All', 'User', 'Compliance', 'Application', 'Card', 'Dispute', 'System'];

export default function AuditLogPage() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('All');
  const [toast, setToast] = useState('');
  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(''), 2500); };
  const results = GLOBAL_AUDIT_LOG.filter(e => {
    const s = q.toLowerCase();
    const mq = !s || e.action.toLowerCase().includes(s) || e.userName.toLowerCase().includes(s) || e.note.toLowerCase().includes(s) || e.category.toLowerCase().includes(s);
    const mc = category === 'All' || e.category === category;
    return mq && mc;
  });
  return (
    <div className="content">
      <div className="page-title">Audit log</div>
      <div className="filter-bar">
        <input placeholder="Search actions, users, notes, categories..." value={q} onChange={e=>setQ(e.target.value)}/>
        <div className="select-wrap">
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            {CATEGORIES.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-sm" style={{marginLeft:'auto',marginRight:10}} onClick={()=>showToast('Downloading audit log...')}>↓ Download</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Action</th><th>User</th><th>Date/time ↓</th><th>Initiator</th><th>Note</th><th>Category</th></tr></thead>
          <tbody>
            {results.map((e,i)=>(
              <tr key={i}>
                <td>{e.action}</td>
                <td>{e.userId ? <Link href={`/users/${e.userId}`} style={{color:'var(--text-primary)',textDecoration:'none'}}>{e.userName}</Link> : <span style={{color:'var(--text-tertiary)'}}>—</span>}</td>
                <td style={{color:'var(--text-secondary)'}}>{e.date}</td>
                <td style={{color:'var(--text-secondary)'}}>{e.initiator}</td>
                <td style={{color:'var(--text-secondary)',maxWidth:220}}>{e.note}</td>
                <td><span className="tag">{e.category}</span></td>
              </tr>
            ))}
            {results.length === 0 && <tr><td colSpan={6} className="empty-state">No entries found</td></tr>}
          </tbody>
        </table>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
