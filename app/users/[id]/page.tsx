'use client';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserById, getApplicationsByUser, getAgreementsByUser, getCardsByUser, getTransactionsByUser, getPaymentsByUser, getInvoicesByUser, getCommunicationsByUser, getNotificationsByUser, getDocsByUser, USER_AUDIT_LOG } from '../../lib/data';
import { Badge } from '../../components/Badge';
import { Modal } from '../../components/Modal';

const TABS = ['Overview','Applications','Agreements','Cards','Transactions','Payments','Communication','Notifications','Audit log'];

function Th({children}: {children: React.ReactNode}) {
  return <th style={{padding:'7px 0 9px',fontSize:11,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-tertiary)',fontWeight:600,textAlign:'left',borderBottom:'0.5px solid var(--border)'}}>{children}</th>;
}
function Td({children,style}: {children: React.ReactNode; style?: React.CSSProperties}) {
  return <td style={{padding:'10px 0',borderBottom:'0.5px solid var(--border)',fontSize:13,...style}}>{children}</td>;
}

export default function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [tab, setTab] = useState('Overview');
  const [blockModal, setBlockModal] = useState(false);
  const [userStatus, setUserStatus] = useState<'Active'|'Blocked'|null>(null);
  const [toast, setToast] = useState('');
  const [openAccordions, setOpenAccordions] = useState<Record<string,boolean>>({});
  const [openNotif, setOpenNotif] = useState<Record<number,boolean>>({});
  const [uploadModal, setUploadModal] = useState(false);

  const user = getUserById(id);
  if (!user) return <div className="content"><div className="page-title">User not found</div><Link href="/users" className="btn">← Back</Link></div>;

  const status = userStatus ?? user.status;
  const apps = getApplicationsByUser(id);
  const agreements = getAgreementsByUser(id);
  const cards = getCardsByUser(id);
  const trxs = getTransactionsByUser(id);
  const payments = getPaymentsByUser(id);
  const invoices = getInvoicesByUser(id);
  const comms = [...getCommunicationsByUser(id)].reverse(); // latest first
  const notifs = getNotificationsByUser(id);
  const docs = getDocsByUser(id);
  const auditLog = [...USER_AUDIT_LOG].reverse(); // latest first

  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(''), 2500); };
  const toggleAccordion = (k: string) => setOpenAccordions(p => ({...p,[k]:!p[k]}));
  const toggleNotif = (i: number) => setOpenNotif(p => ({...p,[i]:!p[i]}));

  const riskColor = user.riskScore > 60 ? 'risk-high' : user.riskScore > 30 ? 'risk-med' : 'risk-low';

  return (
    <>
      <div style={{position:'sticky',top:0,zIndex:10}}>
        <div className="entity-header">
          <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
            <button className="btn btn-sm" onClick={()=>router.push('/users')} style={{marginTop:4,padding:'4px 8px',flexShrink:0}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span className="entity-header-name">{user.name}</span>
                <Badge status={status}/>
                {user.amlFlags !== 'None' && <span style={{fontSize:11,background:'var(--rose-light)',color:'var(--rose)',padding:'2px 8px',borderRadius:20,fontWeight:500}}>⚠ AML flag</span>}
              </div>
              <div className="entity-header-id">{user.id} · {user.idcode}</div>
              <div className="entity-header-meta">
                <span>{user.email}</span>
                <span style={{color:'var(--border-strong)'}}>·</span>
                <span>{user.phone}</span>
              </div>
            </div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center',paddingTop:2}}>
            {status === 'Blocked'
              ? <button className="btn btn-approve btn-sm" onClick={()=>setBlockModal(true)}>Unblock user</button>
              : <button className="btn btn-danger btn-sm" onClick={()=>setBlockModal(true)}>Block user</button>
            }
          </div>
        </div>
        <div className="tabs-bar">
          {TABS.map(t=><div key={t} className={`tab-item${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t}</div>)}
        </div>
      </div>

      <div className="content">

        {/* ── OVERVIEW ── */}
        {tab === 'Overview' && (
          <>
            <div className="two-col" style={{marginBottom:14}}>
              <div className="card">
                <div className="card-title">Customer details</div>
                {([
                  ['Name', user.name],
                  ['ID code', <span style={{fontFamily:'monospace'}}>{user.idcode}</span>],
                  ['Phone', user.phone],
                  ['Email', user.email],
                  ['Home address', user.homeAddress],
                  ['Bank account', <span style={{fontFamily:'monospace',fontSize:11}}>{user.bankAccount}</span>],
                  ['Registered', user.registered],
                  ['App version', user.appVersion],
                ] as [string, React.ReactNode][]).map(([l,v])=>(
                  <div key={String(l)} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
                ))}
              </div>
              <div className="card">
                <div className="card-title">Risk & compliance</div>
                <div className="detail-row">
                  <span className="detail-label">Risk score</span>
                  <span className="detail-value"><span className={riskColor}>{user.riskScore}/100</span></span>
                </div>
                {([
                  ['Risk min. limit', user.riskLimit],
                  ['KYC', <Badge key="kyc" status="Approved"/>],
                  ['PEP / Sanctions', user.pep],
                  ['AML flags', <span style={{color: user.amlFlags !== 'None' ? 'var(--rose)' : 'inherit', fontWeight: user.amlFlags !== 'None' ? 600 : 400}}>{user.amlFlags}</span>],
                  ['2FA on login', user.twoFA],
                  ['Verification method', user.verificationMethod],
                  ['Document type', user.documentType],
                  ['Document number', user.documentNumber],
                  ['Document expiry', user.expiryDate],
                ] as [string, React.ReactNode][]).map(([l,v])=>(
                  <div key={String(l)} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
                ))}
              </div>
            </div>

            {/* Documents */}
            <div className="card">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <div className="card-title" style={{marginBottom:0}}>Documents</div>
                <div style={{display:'flex',gap:8}}>
                  <button className="btn btn-sm" onClick={()=>showToast('Downloading all documents...')}>↓ Download all</button>
                  <button className="btn btn-primary btn-sm" onClick={()=>setUploadModal(true)}>↑ Upload document</button>
                </div>
              </div>
              {docs.length === 0 ? <div className="empty-state">No documents</div> : (
                <table className="docs-table">
                  <thead><tr><th style={{width:'45%'}}>Document name</th><th>Type</th><th>Uploaded by</th><th>Date uploaded</th><th style={{textAlign:'right'}}>Download</th></tr></thead>
                  <tbody>
                    {docs.map(d=>(
                      <tr key={d.name}>
                        <td style={{color:'var(--text-primary)',wordBreak:'break-all',paddingRight:12}}>{d.name}</td>
                        <td><span className="tag">{d.type}</span></td>
                        <td style={{color:'var(--text-secondary)'}}>{d.uploadedBy}</td>
                        <td style={{color:'var(--text-secondary)'}}>{d.date}</td>
                        <td style={{textAlign:'right'}}><button className="btn btn-sm" onClick={()=>showToast(`Downloading ${d.name}`)}>↓</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── APPLICATIONS ── */}
        {tab === 'Applications' && (
          <>
            <div className="card" style={{marginBottom:14}}>
              <div className="card-title">Applications</div>
              {apps.length === 0 ? <div className="empty-state">No applications</div> : (
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr><Th>App. ID</Th><Th>Amount</Th><Th>Product</Th><Th>Submitted ↓</Th><Th>Status</Th><Th>Decided by</Th></tr></thead>
                  <tbody>
                    {[...apps].reverse().map(a=>(
                      <tr key={a.id}>
                        <Td><Link href={`/applications/${a.id}`} style={{color:'var(--indigo)',textDecoration:'none',fontWeight:600}}>{a.id}</Link></Td>
                        <Td style={{fontWeight:600}}>{a.amount}</Td>
                        <Td style={{color:'var(--text-secondary)'}}>{a.product}</Td>
                        <Td style={{color:'var(--text-secondary)'}}>{a.submitted}</Td>
                        <Td><Badge status={a.status}/></Td>
                        <Td style={{color:'var(--text-secondary)'}}>{a.decidedBy}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="card">
              <div className="card-title">Interests & fees</div>
              <div className="stat-grid">
                {[['Current APR','12.00%','var(--indigo)'],['Accrued interest (MTD)','€0.24','var(--text-primary)'],['Outstanding fees','€21.14','var(--amber)'],['Monthly fee','€0.00','var(--text-primary)'],['Late interest','€0.00','var(--text-primary)'],['Subscription fee','€0.00','var(--text-primary)']].map(([l,v,c])=>(
                  <div key={l} className="stat-box"><div className="stat-box-label">{l}</div><div className="stat-box-val" style={{color:c}}>{v}</div></div>
                ))}
              </div>
              <div className="info-note">Late interest triggers 7 days past due date. Figures reflect the current credit line.</div>
            </div>
          </>
        )}

        {/* ── AGREEMENTS ── */}
        {tab === 'Agreements' && (
          <>
            {agreements.length === 0 && <div className="empty-state">No agreements</div>}
            {agreements.map(a=>(
              <div key={a.id} className="accordion">
                <div className="accordion-header" onClick={()=>toggleAccordion(a.id)}>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <span style={{fontWeight:600}}>{a.id}</span>
                    <Badge status={a.status}/>
                    <span style={{fontSize:12,color:'var(--text-secondary)'}}>Opened {a.opened}</span>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:14}}>
                    <div style={{textAlign:'right'}}>
                      <div style={{fontSize:12,fontWeight:600}}>Next payment: {a.nextPayment}</div>
                      <div style={{fontSize:11,color:'var(--text-secondary)'}}>Principal {a.principal} · Outstanding {a.outstanding} · APR {a.details.aprVal}</div>
                    </div>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16,transform:openAccordions[a.id]?'rotate(180deg)':'',transition:'transform 0.2s',color:'var(--text-tertiary)'}}><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                  </div>
                </div>
                {openAccordions[a.id] && (
                  <div className="accordion-body">
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:20}}>
                      <div>
                        <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--text-tertiary)',marginBottom:10}}>Outstanding balance</div>
                        {[['Total outstanding','€'+a.details.outstandingAmt],['Principal','€'+a.details.principalAmt],['Interest','€'+a.details.interest],['Reference interest','€'+a.details.refInterest],['Late interest','€'+a.details.lateInterest],['Month fee','€'+a.details.monthFee],['Subscription fee','€'+a.details.subFee],['Management fee','€'+a.details.mgmtFee],['Previously forgiven','€'+a.details.prevForgiven],['Unused prepayment','€'+a.details.unusedPrepayment]].map(([l,v])=>(
                          <div key={l} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
                        ))}
                      </div>
                      <div>
                        <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--text-tertiary)',marginBottom:10}}>Balance invoiced</div>
                        {[['Outstanding','€'+a.details.balInvoicedOutstanding],['Principal','€'+a.details.balPrincipal],['Interest','€'+a.details.balInterest],['Reference interest','€'+a.details.balRefInterest],['Late interest','€'+a.details.balLateInterest],['Month fee','€'+a.details.balMonthFee],['Subscription fee','€'+a.details.balSubFee],['Management fee','€'+a.details.balMgmtFee],['Previously forgiven','€'+a.details.balPrevForgiven],['Unused prepayment','€'+a.details.balUnusedPrepayment]].map(([l,v])=>(
                          <div key={l} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
                        ))}
                      </div>
                      <div>
                        <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.07em',color:'var(--text-tertiary)',marginBottom:10}}>Credit terms</div>
                        {[['Type',a.details.type],['Currency',a.details.currency],['Annual interest rate',a.details.annualInterestRate],['Annual reference rate',a.details.annualRefRate],['APR',a.details.aprVal],['APRC',a.details.aprc],['Daily late interest rate',a.details.dailyLateInterestRate]].map(([l,v])=>(
                          <div key={l} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* ── CARDS ── */}
        {tab === 'Cards' && (
          <div className="table-wrap">
            {cards.length === 0 ? <div className="empty-state">No cards found</div> : (
              <table>
                <thead><tr><th>Token</th><th>Status</th><th>Created</th><th>Type</th><th>Exp</th><th>Product</th><th>Scheme</th><th>Currency</th><th>Activation</th><th>Network</th></tr></thead>
                <tbody>
                  {cards.map(c=>(
                    <tr key={c.token} className="clickable" onClick={()=>router.push(`/users/${id}/cards/${c.token}`)}>
                      <td style={{fontWeight:600,color:'var(--indigo)',fontFamily:'monospace',fontSize:12}}>{c.token}</td>
                      <td><Badge status={c.status}/></td>
                      <td style={{color:'var(--text-secondary)'}}>{c.created}</td>
                      <td>{c.type}</td><td>{c.exp}</td><td style={{fontSize:11}}>{c.product}</td>
                      <td style={{color:'var(--text-secondary)'}}>{c.scheme}</td>
                      <td>{c.currency}</td>
                      <td style={{color:'var(--text-secondary)'}}>{c.activation}</td>
                      <td>{c.network}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {tab === 'Transactions' && (
          <>
            <div className="stat-grid">
              {[['Current APR','12.00%','var(--indigo)'],['Accrued interest (MTD)','€0.24','var(--text-primary)'],['Outstanding fees','€21.14','var(--amber)']].map(([l,v,c])=>(
                <div key={l} className="stat-box"><div className="stat-box-label">{l}</div><div className="stat-box-val" style={{color:c}}>{v}</div></div>
              ))}
            </div>
            <div className="card">
              <div className="card-title">Transactions</div>
              {trxs.length === 0 ? <div className="empty-state">No transactions</div> : (
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead><tr><Th>Trx ID</Th><Th>Date/time ↓</Th><Th>Type</Th><Th>Status</Th><Th>Merchant</Th><Th>MCC</Th><Th>Billing</Th><Th>Trx amt.</Th><Th>Reason code</Th><Th>Balance</Th></tr></thead>
                    <tbody>
                      {trxs.map(t=>(
                        <tr key={t.id}>
                          <Td style={{fontFamily:'monospace',fontSize:11,color:'var(--text-secondary)'}}>{t.id}</Td>
                          <Td style={{color:'var(--text-secondary)'}}>{t.dt}</Td>
                          <Td>{t.type}</Td>
                          <Td><Badge status={t.status}/></Td>
                          <Td style={{fontWeight:500}}>{t.merchant}</Td>
                          <Td style={{color:'var(--text-secondary)'}}>{t.mcc}</Td>
                          <Td>{t.billing}</Td><Td>{t.trx}</Td>
                          <Td style={{color:t.reasonCode.startsWith('00')?'var(--emerald)':t.reasonCode?'var(--rose)':'var(--text-tertiary)',fontSize:11,fontFamily:'monospace'}}>{t.reasonCode||'—'}</Td>
                          <Td style={{fontWeight:600}}>{t.balance}</Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── PAYMENTS ── */}
        {tab === 'Payments' && (
          <>
            <div className="card" style={{marginBottom:14}}>
              <div className="card-title">Scheduled payments</div>
              <div style={{fontSize:11,color:'var(--text-tertiary)',marginBottom:10,fontWeight:500}}>Upcoming via Checkout.com</div>
              {payments.length === 0 ? <div className="empty-state">No scheduled payments</div> : (
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr><Th>Payment ID</Th><Th>Due date</Th><Th>Amount</Th></tr></thead>
                  <tbody>
                    {payments.map(p=>(
                      <tr key={p.id}>
                        <Td><span style={{color:'var(--indigo)',fontWeight:600,cursor:'pointer'}} onClick={()=>showToast(`Opening ${p.id}...`)}>{p.id}</span></Td>
                        <Td style={{color:'var(--text-secondary)'}}>{p.due}</Td>
                        <Td style={{fontWeight:600}}>{p.amount}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="card">
              <div className="card-title">Invoices</div>
              {invoices.length === 0 ? <div className="empty-state">No invoices</div> : (
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead><tr><Th>Invoice no</Th><Th>Date sent</Th><Th>Due date</Th><Th>Amount</Th></tr></thead>
                  <tbody>
                    {invoices.map(inv=>(
                      <tr key={inv.id}>
                        <Td><span style={{color:'var(--indigo)',fontWeight:600,cursor:'pointer'}} onClick={()=>showToast(`Opening ${inv.id}...`)}>{inv.id}</span></Td>
                        <Td style={{color:'var(--text-secondary)'}}>{inv.sent}</Td>
                        <Td style={{color:'var(--text-secondary)'}}>{inv.due}</Td>
                        <Td style={{fontWeight:600}}>{inv.amount}</Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* ── COMMUNICATION (latest first) ── */}
        {tab === 'Communication' && (
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div className="card-title" style={{marginBottom:0}}>Messages & notes</div>
              <button className="btn btn-primary btn-sm" onClick={()=>showToast('Note saved')}>+ Add internal note</button>
            </div>
            {comms.length === 0 && <div className="empty-state">No messages</div>}
            {comms.map((c,i)=>(
              <div key={i} className={`comm-item comm-${c.type}`}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-tertiary)',marginBottom:5}}>
                  <span style={{fontWeight:600,color:'var(--text-primary)',fontSize:12}}>{c.sender}</span>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    {c.type==='internal' && <span style={{background:'var(--amber-light)',color:'var(--amber)',padding:'1px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>Internal note</span>}
                    {c.topic && c.type!=='internal' && <span style={{background:'var(--indigo-light)',color:'var(--indigo)',padding:'1px 8px',borderRadius:20,fontSize:11,fontWeight:500}}>{c.topic}</span>}
                    <span style={{color:'var(--text-tertiary)'}}>{c.date}</span>
                  </div>
                </div>
                <div style={{fontSize:13,color:'var(--text-primary)',lineHeight:1.5}}>{c.body}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {tab === 'Notifications' && (
          <div className="card">
            <div className="card-title">Notifications</div>
            {notifs.length === 0 && <div className="empty-state">No notifications</div>}
            {notifs.map((n,i)=>(
              <div key={i} className="notif-item" onClick={()=>toggleNotif(i)}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                  <div>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                      <Badge status={n.type}/>
                      <span style={{fontWeight:600,fontSize:13}}>{n.title}</span>
                    </div>
                    <div style={{fontSize:11,color:'var(--text-tertiary)',display:'flex',alignItems:'center',gap:6}}>
                      <span>{n.date}</span>
                      <span>·</span>
                      <Badge status={n.status}/>
                    </div>
                  </div>
                  <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16,color:'var(--text-tertiary)',marginTop:2,transform:openNotif[i]?'rotate(180deg)':'',transition:'transform 0.2s'}}><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/></svg>
                </div>
                {openNotif[i] && <div className="notif-body">{n.body}</div>}
              </div>
            ))}
          </div>
        )}

        {/* ── AUDIT LOG (latest first) ── */}
        {tab === 'Audit log' && (
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div className="card-title" style={{marginBottom:0}}>Audit log</div>
              <button className="btn btn-sm" onClick={()=>showToast('Downloading audit log...')}>↓ Download</button>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr><Th>Action</Th><Th>Date/time ↓</Th><Th>Initiator</Th><Th>Note</Th></tr></thead>
              <tbody>
                {auditLog.map((a,i)=>(
                  <tr key={i}>
                    <Td style={{fontWeight:500}}>{a.action}</Td>
                    <Td style={{color:'var(--text-secondary)'}}>{a.date}</Td>
                    <Td>{a.initiator}</Td>
                    <Td style={{color:'var(--text-secondary)'}}>{a.note}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Block modal */}
      <Modal open={blockModal} onClose={()=>setBlockModal(false)} title={status==='Blocked'?'Unblock user':'Block user'}
        actions={<>
          <button className="btn" onClick={()=>setBlockModal(false)}>Cancel</button>
          <button className={`btn ${status==='Blocked'?'btn-approve':'btn-danger'}`}
            onClick={()=>{setUserStatus(status==='Blocked'?'Active':'Blocked');setBlockModal(false);showToast(status==='Blocked'?'User unblocked':'User blocked');}}>
            {status==='Blocked'?'Unblock user':'Block user'}
          </button>
        </>}>
        <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>
          {status==='Blocked'
            ? <>Unblocking <strong>{user.name}</strong> will restore their app access and re-enable card payments.</>
            : <>Blocking <strong>{user.name}</strong> will immediately remove app access and decline all card payments.</>}
        </div>
      </Modal>

      <Modal open={uploadModal} onClose={()=>setUploadModal(false)} title="Upload document"
        actions={<>
          <button className="btn" onClick={()=>setUploadModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{setUploadModal(false);showToast('Document uploaded');}}>Upload</button>
        </>}>
        <div>
          <label className="input-label">File</label>
          <input type="file" className="input-field"/>
          <label className="input-label">Document type</label>
          <input className="input-field" placeholder="e.g. Agreement, SECCI, ID verification..."/>
          <label className="input-label">Notes (optional)</label>
          <textarea className="input-field" placeholder="Any notes about this document..."/>
        </div>
      </Modal>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
