'use client';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const stats = [
    { label:'Total users', value:'1,284', color:'var(--metric-violet)', href:'/users', filter:null },
    { label:'Active agreements', value:'892', color:'#7EC8A8', href:null, filter:null },
    { label:'Transactions today', value:'347', color:'#8EC5E8', href:null, filter:null },
    { label:'Incoming applications', value:'14', color:'#E8C87A', href:'/applications?status=Incoming', filter:'Incoming' },
  ];
  return (
    <div className="content">
      <div className="page-title">Dashboard</div>
      <div className="info-note" style={{marginBottom:18}}>
        Dashboard metrics will be available in a future release. KPIs such as daily applications, active agreements, and transaction volumes will appear here.
      </div>
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
      <div className="card" style={{height:220,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-tertiary)'}}>
        <div style={{textAlign:'center'}}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{width:38,height:38,margin:'0 auto 10px',display:'block',opacity:0.4}}><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
          <div style={{fontWeight:500,marginBottom:4}}>Analytics coming soon</div>
          <div style={{fontSize:12}}>Charts and KPIs will appear here in the next release</div>
        </div>
      </div>
    </div>
  );
}
