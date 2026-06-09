'use client';
import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getDisputeById } from '../../lib/data';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

const ACTIONS = [
  {label:'Approve refund', tone:'approve'},
  {label:'Mark as fraud', tone:'danger'},
  {label:'Request merchant evidence', tone:''},
  {label:'Reject dispute', tone:'danger'},
  {label:'Escalate to chargeback', tone:'warning'},
  {label:'Close case', tone:''},
];

export default function DisputePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const d = getDisputeById(id);
  const [modal, setModal] = useState('');
  const [toast, setToast] = useState('');
  const [actionsOpen, setActionsOpen] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(''), 2500); };

  useEffect(() => {
    if (!actionsOpen) return;
    const close = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) setActionsOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [actionsOpen]);

  if (!d) return <div className="content">Dispute not found. <Link href="/disputes">Back to disputes</Link></div>;

  return (
    <>
      {/* Header with customer info + actions */}
      <div className="entity-header">
        <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
          <button className="btn btn-sm" onClick={()=>window.history.back()} style={{marginTop:4,padding:'4px 8px',flexShrink:0}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span className="entity-header-name">{d.id}</span>
              <Badge status={d.status}/>
            </div>
            {/* Customer info in header */}
            <div style={{marginTop:4,display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              <span style={{fontSize:13,fontWeight:500,color:'var(--text-primary)'}}>{d.userName}</span>
              <span style={{color:'var(--border-strong)'}}>·</span>
              <span style={{fontSize:12,color:'var(--text-secondary)'}}>{d.userEmail}</span>
              <span style={{color:'var(--border-strong)'}}>·</span>
              <span style={{fontSize:12,color:'var(--text-secondary)'}}>{d.userPhone}</span>
              <span style={{color:'var(--border-strong)'}}>·</span>
              <Link href={`/users/${d.userId}`} style={{fontSize:12,color:'var(--indigo)',textDecoration:'none',fontWeight:500}}>View profile →</Link>
            </div>
            <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>Created {d.created} · Updated {d.updated}</div>
          </div>
        </div>
        <div className="actions-dropdown" ref={actionsRef}>
          <button className="btn btn-sm" onClick={()=>setActionsOpen(o=>!o)}>
            Actions
            <svg viewBox="0 0 20 20" fill="currentColor" style={{width:14,height:14,marginLeft:4,transform:actionsOpen?'rotate(180deg)':'',transition:'transform 0.15s'}}>
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
          {actionsOpen && (
            <div className="actions-dropdown-menu">
              {ACTIONS.map(a=>(
                <button key={a.label} className={`actions-dropdown-item${a.tone?` ${a.tone}`:''}`}
                  onClick={()=>{ setModal(a.label); setActionsOpen(false); }}>
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="content">
        <div className="two-col" style={{marginBottom:14}}>
          <div className="card">
            <div className="card-title">Dispute details</div>
            {([
              ['Dispute ID', d.id],
              ['Transaction ID', <span style={{fontFamily:'monospace',fontSize:11}}>{d.transactionId}</span>],
              ['Merchant', d.merchant],
              ['MCC', d.mcc],
              ['Amount', d.amount],
              ['Currency', d.currency],
              ['Reason', d.reason],
              ['Status', <Badge key="s" status={d.status}/>],
            ] as [string, React.ReactNode][]).map(([l,v])=>(
              <div key={String(l)} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
            ))}
          </div>
          {/* Timeline */}
          <div className="card">
            <div className="card-title">Timeline</div>
            {d.timeline.map((t,i)=>(
              <div key={i} style={{display:'flex',gap:10,paddingBottom:10,marginBottom:i<d.timeline.length-1?10:0,borderBottom:i<d.timeline.length-1?'0.5px solid var(--border)':'none'}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'var(--indigo)',marginTop:3}}/>
                  {i<d.timeline.length-1 && <div style={{width:1,flex:1,background:'var(--border)',minHeight:14,marginTop:4}}/>}
                </div>
                <div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:1}}>{t.dt}</div>
                  <div style={{fontSize:13}}>{t.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="two-col">
          <div className="card">
            <div className="card-title">Documents & user statements</div>
            {d.documents.map((doc,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0',borderBottom:i<d.documents.length-1?'0.5px solid var(--border)':'none'}}>
                <span style={{fontSize:13}}>{doc}</span>
                <button className="btn btn-sm" onClick={()=>showToast(`Downloading...`)}>↓</button>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-title">System evidence</div>
            {d.systemEvidence.map((e,i)=>(
              <div key={i} style={{fontSize:12,padding:'6px 0',borderBottom:i<d.systemEvidence.length-1?'0.5px solid var(--border)':'none',color:'var(--text-secondary)',lineHeight:1.5}}>{e}</div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={!!modal} onClose={()=>setModal('')} title={modal}
        actions={<>
          <button className="btn" onClick={()=>setModal('')}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{showToast(`${modal} — confirmed`);setModal('');}}>Confirm</button>
        </>}>
        <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>
          Confirm: <strong>{modal}</strong> for dispute {d.id}.
          <textarea className="input-field" style={{marginTop:12,minHeight:70}} placeholder="Add reason or note (optional)..."/>
        </div>
      </Modal>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
