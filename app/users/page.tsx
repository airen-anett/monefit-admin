'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { USERS } from '../lib/data';
import { Badge } from '../components/Badge';

export default function UsersPage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const results = USERS.filter(u => {
    const s = q.toLowerCase();
    const mq = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.phone.includes(s) || u.idcode.includes(s);
    const mf = filter === 'All' || u.status === filter;
    return mq && mf;
  });
  return (
    <div className="content">
      <div className="page-title">Users</div>
      <div className="filter-bar">
        <input placeholder="Search by name, email, phone, ID code..." value={q} onChange={e=>setQ(e.target.value)}/>
        <div className="select-wrap">
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option>All</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
        </div>
        <div className="filter-bar-meta">{results.length} users</div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Internal ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Created ↓</th><th>Status</th><th>Last activity</th></tr></thead>
          <tbody>
            {results.map(u=>(
              <tr key={u.id} className="clickable" onClick={()=>router.push(`/users/${u.id}`)}>
                <td style={{fontFamily:'monospace',fontSize:11,color:'var(--text-secondary)'}}>{u.id}</td>
                <td>{u.name}</td>
                <td style={{color:'var(--text-secondary)'}}>{u.phone}</td>
                <td style={{color:'var(--text-secondary)'}}>{u.email}</td>
                <td style={{color:'var(--text-secondary)'}}>{u.created}</td>
                <td><Badge status={u.status}/></td>
                <td style={{color:'var(--text-secondary)'}}>{u.lastActivity}</td>
              </tr>
            ))}
            {results.length === 0 && <tr><td colSpan={7} className="empty-state">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
