'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { APPLICATIONS } from './lib/data';
import { Badge } from './components/Badge';

export default function Dashboard() {
  const router = useRouter();
  const stats = [
    { label:'Total users', value:'1,284', color:'var(--metric-violet)', href:'/users', filter:null },
    { label:'Active agreements', value:'892', color:'#7EC8A8', href:null, filter:null },
    { label:'Transactions today', value:'347', color:'#8EC5E8', href:'/transactions', filter:null },
    { label:'Incoming applications', value:'14', color:'#E8C87A', href:'/applications?status=Incoming', filter:'Incoming' },
  ];

  const queue = APPLICATIONS
    .filter(a => a.status === 'In review' || a.status === 'Incoming')
    .sort((a, b) => b.submitted.localeCompare(a.submitted));

  return (
    <div className="content">
      <div className="page-title">Dashboard</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {stats.map(s=>(
          <div key={s.label} className="card" style={{padding:'18px 20px',cursor:s.href?'pointer':'default',borderTop:`3px solid ${s.color}`,transition:'all 0.15s'}}
            onClick={()=>s.href && router.push(s.href)}
            onMouseEnter={e=>{ if(s.href)(e.currentTarget as HTMLDivElement).style.transform='translateY(-1px)'; }}
            onMouseLeave={e=>{ if(s.href)(e.currentTarget as HTMLDivElement).style.transform=''; }}>
            <div style={{fontSize:11,color:'var(--text-secondary)',marginBottom:8,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>{s.label}</div>
            <div style={{fontSize:26,fontWeight:700,letterSpacing:'-0.5px',color:s.color}}>{s.value}</div>
            {s.href && <div style={{fontSize:11,color:s.color,marginTop:6,fontWeight:500}}>Click to view →</div>}
          </div>
        ))}
      </div>

      <div className="card dashboard-queue">
        <div className="dashboard-queue-header">
          <div>
            <div style={{fontSize:15,fontWeight:600,letterSpacing:'-0.2px'}}>Applications queue</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>Awaiting decision or in manual review</div>
          </div>
          <Link href="/applications" className="dashboard-queue-link">View all →</Link>
        </div>
        <div className="table-wrap dashboard-queue-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Applicant</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Submitted ↓</th>
              </tr>
            </thead>
            <tbody>
              {queue.map(a => (
                <tr key={a.id} className="clickable" onClick={() => router.push(`/applications/${a.id}`)}>
                  <td>{a.id}</td>
                  <td>{a.applicantName}</td>
                  <td style={{color:'var(--text-secondary)'}}>{a.product}</td>
                  <td style={{fontWeight:600}}>{a.amount}</td>
                  <td><Badge status={a.status} /></td>
                  <td style={{color:'var(--text-secondary)'}}>{a.submitted}</td>
                </tr>
              ))}
              {queue.length === 0 && <tr><td colSpan={6} className="empty-state">No applications in queue</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
