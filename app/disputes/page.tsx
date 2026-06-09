'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DISPUTES } from '../lib/data';
import { Badge } from '../components/Badge';

export default function DisputesPage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const results = DISPUTES.filter(d => {
    const s = q.toLowerCase();
    return !s || d.id.toLowerCase().includes(s) || d.userName.toLowerCase().includes(s) || d.userEmail.toLowerCase().includes(s) || d.userPhone.includes(s) || d.transactionId.toLowerCase().includes(s);
  });
  return (
    <div className="content">
      <div className="page-title">Disputes</div>
      <div className="filter-bar">
        <input placeholder="Search by name, email, phone, ID code, reference no..." value={q} onChange={e=>setQ(e.target.value)}/>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Dispute ID</th><th>Transaction</th><th>Customer</th><th>Created</th><th>Amount</th><th>Reason</th><th>Status</th><th>Updated</th></tr></thead>
          <tbody>
            {results.map(d=>(
              <tr key={d.id} className="clickable" onClick={()=>router.push(`/disputes/${d.id}`)}>
                <td>{d.id}</td>
                <td style={{fontFamily:'monospace',fontSize:11,color:'var(--text-secondary)'}}>{d.transactionId}</td>
                <td>{d.userName}</td>
                <td style={{color:'var(--text-secondary)'}}>{d.created}</td>
                <td style={{color:'var(--text-secondary)'}}>{d.amount}</td>
                <td style={{color:'var(--text-secondary)'}}>{d.reason}</td>
                <td><Badge status={d.status}/></td>
                <td style={{color:'var(--text-secondary)'}}>{d.updated}</td>
              </tr>
            ))}
            {results.length === 0 && <tr><td colSpan={8} className="empty-state">No disputes found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
