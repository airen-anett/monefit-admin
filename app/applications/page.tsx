'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { APPLICATIONS } from '../lib/data';
import { Badge } from '../components/Badge';

const STATUSES = ['All','Incoming','In review','Approved','Rejected','Expired'];

function ApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const s = searchParams.get('status');
    if (s) setFilter(s);
  }, [searchParams]);

  const results = APPLICATIONS.filter(a => {
    const s = q.toLowerCase();
    const mq = !s || a.applicantName.toLowerCase().includes(s) || a.id.toLowerCase().includes(s);
    const mf = filter === 'All' || a.status === filter;
    return mq && mf;
  }).sort((a,b) => b.submitted.localeCompare(a.submitted));

  return (
    <div className="content">
      <div className="page-title">Applications</div>
      <div className="filter-bar">
        <input placeholder="Search by applicant name or application ID..." value={q} onChange={e=>setQ(e.target.value)}/>
        <div className="select-wrap">
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            {STATUSES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{marginLeft:'auto',fontSize:12,color:'var(--text-tertiary)',fontWeight:500}}>{results.length} results</div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>ID</th><th>Applicant</th><th>Product</th><th>Amount</th><th>Status</th><th>Submitted ↓</th><th>Expiry date</th><th>Decided by</th></tr></thead>
          <tbody>
            {results.map(a=>(
              <tr key={a.id} className="clickable" onClick={()=>router.push(`/applications/${a.id}`)}>
                <td>{a.id}</td>
                <td>{a.applicantName}</td>
                <td style={{color:'var(--text-secondary)'}}>{a.product}</td>
                <td style={{fontWeight:600}}>{a.amount}</td>
                <td><Badge status={a.status}/></td>
                <td style={{color:'var(--text-secondary)'}}>{a.submitted}</td>
                <td style={{color:'var(--text-secondary)'}}>{a.expiryDate}</td>
                <td style={{color:'var(--text-secondary)'}}>{a.decidedBy}</td>
              </tr>
            ))}
            {results.length === 0 && <tr><td colSpan={8} className="empty-state">No applications found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  return <Suspense fallback={<div className="content"><div className="page-title">Applications</div></div>}><ApplicationsContent/></Suspense>;
}
