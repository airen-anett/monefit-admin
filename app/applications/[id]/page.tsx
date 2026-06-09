'use client';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApplicationById, getUserById } from '../../lib/data';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

const TABS = ['Overview','Questionnaire','Decision','Bank statements','Notes','Audit log'];

export default function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const app = getApplicationById(id);
  const [tab, setTab] = useState('Overview');
  const [approveModal, setApproveModal] = useState(false);
  const [declineModal, setDeclineModal] = useState(false);
  const [creditLimit, setCreditLimit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [approveNote, setApproveNote] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [noteText, setNoteText] = useState('');
  const [toast, setToast] = useState('');
  const [openChecks, setOpenChecks] = useState<Record<number,boolean>>({});
  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(''), 2500); };

  if (!app) return <div className="content">Application not found. <Link href="/applications">Back to applications</Link></div>;
  const user = getUserById(app.userId);

  const TH = ({children}: {children: React.ReactNode}) =>
    <th style={{padding:'7px 0 8px',fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em',color:'#888',fontWeight:500,textAlign:'left',borderBottom:'0.5px solid rgba(0,0,0,0.08)'}}>{children}</th>;
  const TD = ({children,style}: {children: React.ReactNode; style?: React.CSSProperties}) =>
    <td style={{padding:'9px 0',borderBottom:'0.5px solid rgba(0,0,0,0.06)',fontSize:13,...style}}>{children}</td>;

  const canDecide = app.status === 'In review' || app.status === 'Incoming';

  return (
    <>
      <div style={{position:'sticky',top:0,zIndex:10}}>
        <div className="entity-header">
          <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
            <button className="btn btn-sm" onClick={()=>router.push('/applications')} style={{marginTop:4,padding:'4px 8px',flexShrink:0}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span className="entity-header-name">Application {app.id}</span>
                <Badge status={app.status}/>
              </div>
              <div className="entity-header-id" style={{fontFamily:'inherit'}}>
                {user ? (
                  <Link href={`/users/${user.id}`} style={{color:'var(--text-secondary)',textDecoration:'none',fontWeight:500}}>{user.name}</Link>
                ) : app.applicantName}
              </div>
              <div className="entity-header-meta">
                {user && (
                  <>
                    <span style={{fontFamily:'monospace',fontSize:11}}>{user.id} · {user.idcode}</span>
                    <span style={{color:'var(--border-strong)'}}>·</span>
                    <span>{user.email}</span>
                    <span style={{color:'var(--border-strong)'}}>·</span>
                  </>
                )}
                <span>Submitted {app.submitted}</span>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center',paddingTop:2}}>
            {canDecide && (
              <>
                <button className="btn btn-approve btn-sm" onClick={()=>setApproveModal(true)}>Approve</button>
                <button className="btn btn-decline btn-sm" onClick={()=>setDeclineModal(true)}>Decline</button>
              </>
            )}
          </div>
        </div>
        <div className="tabs-bar">
          {TABS.map(t=><div key={t} className={`tab-item${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t}</div>)}
        </div>
      </div>

      <div className="content">
        {tab === 'Overview' && (
          <div className="two-col">
            <div className="card">
              <div className="card-title">Applicant</div>
              {user ? [
                ['Name', user.name], ['ID code', user.idcode], ['Phone nr', user.phone],
                ['Email address', user.email], ['Home address', user.homeAddress],
                ['Registered', user.registered], ['Verification method', user.verificationMethod],
                ['Document type', user.documentType], ['Document number', user.documentNumber],
                ['Expiry date', user.expiryDate],
                ['Population registry PDF', <button key="pdf" className="btn btn-sm" onClick={()=>showToast('Downloading PDF...')}>↓ Download</button>],
                ['App version', user.appVersion],
              ].map(([l,v]) => (
                <div key={String(l)} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
              )) : <div className="empty-state">User data not found</div>}
            </div>
            <div className="card">
              <div className="card-title">Application</div>
              {[
                ['Application ID', app.id],
                ['Product name', app.product],
                ['Interest rate', app.interestRate],
                ['Limit', app.limit],
                ['Status', <Badge key="s" status={app.status}/>],
                ['Submitted', app.submitted],
                ['Agreement', app.agreementRef !== '—' ? <button key="agr" className="btn btn-sm" onClick={()=>showToast(`Downloading ${app.agreementRef}...`)}>↓ {app.agreementRef}</button> : '—'],
                ['SECCI', <button key="secci" className="btn btn-sm" onClick={()=>showToast(`Downloading ${app.secciRef}...`)}>↓ {app.secciRef}</button>],
                ['Decided', app.decided],
                ['Decisioned by', app.decidedBy],
              ].map(([l,v]) => (
                <div key={String(l)} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Questionnaire' && (
          <>
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:12}}>
              <button className="btn btn-sm btn-warning" onClick={()=>showToast('Edit mode — coming soon')}>Edit answers</button>
            </div>
            <div className="two-col">
              <div className="card">
                <div className="card-title">Employment & personal info</div>
                {[
                  ['Employment type / Peamine sissetulekuallikas', app.questionnaire.employmentType],
                  ['Employer name / Tööandja nimi', app.questionnaire.employerName],
                  ['Employer field / Tööandja tegevusvaldkond', app.questionnaire.employerField],
                  ['Position / Ametikoht', app.questionnaire.position],
                  ['Monthly net income / Igakuine netosissetulek', app.questionnaire.monthlyIncome],
                  ['Monthly expenses / Kulud', app.questionnaire.monthlyExpenses],
                  ['Marital status / Perekonnaseis', app.questionnaire.maritalStatus],
                  ['Financial dependents / Ülalpeetavate arv', app.questionnaire.financialDependents],
                ].map(([l,v])=>(
                  <div key={String(l)} className="detail-row" style={{flexDirection:'column',alignItems:'flex-start',gap:2}}>
                    <span style={{fontSize:11,color:'#888'}}>{l}</span>
                    <span style={{fontSize:13,fontWeight:500}}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-title">Liabilities & other</div>
                {[
                  ['Has credit history? / Oled Sa varasemalt krediititooteid kasutanud?', app.questionnaire.hasCreditHistory],
                  ['Has active credit? / Kehtivaid krediidilepinguid?', app.questionnaire.hasActiveCredit],
                  ['Owns property? / Omad mingit vara?', app.questionnaire.ownsProperty],
                  ['Property type / Kinnisvara liik', app.questionnaire.propertyType],
                  ['Is PEP?', app.questionnaire.isPep],
                  ['Purpose of credit / Mis eesmärgil soovid krediiti kasutada?', app.questionnaire.purposeOfCredit],
                  ['Date completed / Küsimustiku täitmise kuupäev', app.questionnaire.dateCompleted],
                ].map(([l,v])=>(
                  <div key={String(l)} className="detail-row" style={{flexDirection:'column',alignItems:'flex-start',gap:2}}>
                    <span style={{fontSize:11,color:'#888'}}>{l}</span>
                    <span style={{fontSize:13,fontWeight:500}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'Decision' && (
          <div className="card" style={{maxWidth:520}}>
            <div className="card-title">Policy checks</div>
            {app.policyChecks.map((check,i)=>(
              <div key={i}>
                <div className="policy-check">
                  <div style={{marginTop:1}}>
                    {check.passed
                      ? <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16,color:'#065F46'}}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      : <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16,color:'#DC2626'}}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                    }
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{fontSize:13,color:check.passed?'#065F46':'#991B1B',fontWeight:check.passed?400:500}}>{check.name}</span>
                      {!check.passed && check.detail && (
                        <button className="btn btn-sm" style={{fontSize:11,padding:'2px 8px'}} onClick={()=>setOpenChecks(p=>({...p,[i]:!p[i]}))}>
                          {openChecks[i] ? 'Hide detail' : 'View detail'}
                        </button>
                      )}
                    </div>
                    {!check.passed && openChecks[i] && check.detail && (
                      <div className="check-detail">{check.detail}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Bank statements' && (
          <div className="card">
            <div className="card-title">Bank statements</div>
            {app.bankStatements.length === 0 ? <div className="empty-state">No bank statements uploaded</div> : (
              <table style={{width:'100%',borderCollapse:'collapse'}}>
                <thead><tr>
                  <TH>Statement</TH><TH>Date and time</TH><th style={{padding:'7px 0 8px',fontSize:11,textTransform:'uppercase',letterSpacing:'0.04em',color:'#888',fontWeight:500,textAlign:'right',borderBottom:'0.5px solid rgba(0,0,0,0.08)'}}>Download</th>
                </tr></thead>
                <tbody>
                  {app.bankStatements.map(bs=>(
                    <tr key={bs.name}>
                      <TD><span style={{cursor:'pointer',color:'var(--color-indigo)'}} onClick={()=>showToast(`Opening ${bs.name}...`)}>{bs.name}</span></TD>
                      <TD>{bs.date}</TD>
                      <TD style={{textAlign:'right'}}><button className="btn btn-sm" onClick={()=>showToast(`Downloading ${bs.name}...`)}>↓ Download</button></TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === 'Notes' && (
          <div className="card">
            <div className="card-title">Notes</div>
            <div style={{marginBottom:16}}>
              <textarea className="input-field" placeholder="Add a note about this application..." value={noteText} onChange={e=>setNoteText(e.target.value)} style={{minHeight:90}}/>
              <div style={{display:'flex',justifyContent:'flex-end'}}>
                <button className="btn btn-primary btn-sm" onClick={()=>{if(noteText.trim()){showToast('Note saved');setNoteText('');}else showToast('Please enter a note');}}>Post note</button>
              </div>
            </div>
            {app.notes.length === 0 && !noteText ? <div className="empty-state" style={{paddingTop:16}}>No notes yet</div> : null}
            {app.notes.map((n,i)=>(
              <div key={i} style={{borderTop:'0.5px solid rgba(0,0,0,0.07)',paddingTop:12,marginTop:12}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontWeight:500,fontSize:13}}>{n.author}</span>
                  <span style={{fontSize:12,color:'#888'}}>{n.date}</span>
                </div>
                <div style={{fontSize:13,color:'#333'}}>{n.text}</div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Audit log' && (
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <div className="card-title" style={{marginBottom:0}}>Audit log</div>
              <button className="btn btn-sm" onClick={()=>showToast('Downloading audit log...')}>↓ Download</button>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr><TH>Action</TH><TH>Date/time</TH><TH>Initiator</TH><TH>Note</TH></tr></thead>
              <tbody>
                {app.auditLog.map((a,i)=>(
                  <tr key={i}><TD>{a.action}</TD><TD>{a.date}</TD><TD>{a.initiator}</TD><TD style={{color:'#666'}}>{a.note}</TD></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approve modal */}
      <Modal open={approveModal} onClose={()=>setApproveModal(false)} title="Approve credit card application"
        actions={<>
          <button className="btn" onClick={()=>setApproveModal(false)}>Cancel</button>
          <button className="btn btn-approve" onClick={()=>{setApproveModal(false);showToast('Application approved');}}>Confirm approval</button>
        </>}>
        <div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            <div>
              <label className="input-label">Credit limit (€)</label>
              <input className="input-field" style={{marginBottom:0}} placeholder="e.g. 2000" value={creditLimit} onChange={e=>setCreditLimit(e.target.value)}/>
            </div>
            <div>
              <label className="input-label">Interest rate (%)</label>
              <input className="input-field" style={{marginBottom:0}} placeholder="e.g. 25.00" value={interestRate} onChange={e=>setInterestRate(e.target.value)}/>
            </div>
          </div>
          <label className="input-label">Note (optional)</label>
          <textarea className="input-field" placeholder="Optional note for the audit log..." value={approveNote} onChange={e=>setApproveNote(e.target.value)} style={{minHeight:70}}/>
        </div>
      </Modal>

      {/* Decline modal */}
      <Modal open={declineModal} onClose={()=>setDeclineModal(false)} title="Decline application"
        actions={<>
          <button className="btn" onClick={()=>setDeclineModal(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={()=>{setDeclineModal(false);showToast('Application declined');}}>Confirm decline</button>
        </>}>
        <div>
          <div style={{fontSize:13,color:'#555',marginBottom:14,lineHeight:1.6}}>Declining application <strong>{app.id}</strong> for <strong>{app.applicantName}</strong>. The customer will be notified.</div>
          <label className="input-label">Reason for decline (required)</label>
          <textarea className="input-field" placeholder="State the reason for declining this application..." value={declineReason} onChange={e=>setDeclineReason(e.target.value)} style={{minHeight:80}}/>
        </div>
      </Modal>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
