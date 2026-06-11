'use client';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUserById, getCardByToken, getCardsByUser, getTransactionsByUser } from '../../../../lib/data';
import { Badge } from '../../../../components/Badge';
import { Modal } from '../../../../components/Modal';

const TABS = ['Overview','Linked cards','Limits','Configuration','Audit log'];
const CARD_AUDIT = [
  {action:'3DS verification triggered',dt:'01/06/2026 08:34',initiator:'System',note:'Amazon — declined'},
  {action:'Card limit updated',dt:'26/05/2026 14:22',initiator:'CS',note:'Limit increased to €3,000'},
  {action:'Card activated',dt:'25/05/2026 09:12',initiator:'Customer',note:'Activated via app'},
  {action:'Card created',dt:'16/05/2026 11:00',initiator:'System',note:'V. card issued successfully'},
];

function Th({children}: {children: React.ReactNode}) {
  return <th style={{padding:'7px 0 9px',fontSize:11,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-tertiary)',fontWeight:600,textAlign:'left',borderBottom:'0.5px solid var(--border)'}}>{children}</th>;
}
function Td({children,style}: {children: React.ReactNode; style?: React.CSSProperties}) {
  return <td style={{padding:'9px 0',borderBottom:'0.5px solid var(--border)',fontSize:12,...style}}>{children}</td>;
}

// Simulated role: change to 'admin' to see edit buttons
const CURRENT_ROLE: string = 'support';

export default function CardPage({ params }: { params: Promise<{ id: string; cardId: string }> }) {
  const { id, cardId } = use(params);
  const router = useRouter();
  const user = getUserById(id);
  const card = getCardByToken(cardId);
  const [tab, setTab] = useState('Overview');
  const [modalType, setModalType] = useState('');
  const [toast, setToast] = useState('');
  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(''), 2500); };

  if (!user || !card) return <div className="content">Card not found. <Link href={`/users/${id}`}>Back to user</Link></div>;

  const cards = getCardsByUser(id);
  const trxs = getTransactionsByUser(id);

  const CONFIG_ROWS = [
    {label:'Online payments', value:'ON'},
    {label:'In-store payments', value:'ON'},
    {label:'Recurring payments', value:'ON'},
    {label:'Card status', value:'Active'},
    {label:'PIN enabled', value:'Yes'},
    {label:'Card reissuance status', value:'—'},
    {label:'Tokenization (Apple/Google Pay)', value:'Allowed'},
  ];

  return (
    <>
      <div style={{position:'sticky',top:0,zIndex:10}}>
        <div className="entity-header">
          <div>
            <div className="breadcrumb">
              <Link href={`/users/${id}`}>← {user.name}</Link> <span style={{color:'var(--text-tertiary)'}}>/</span> <Link href={`/users/${id}`} onClick={e=>{e.preventDefault();window.location.href=`/users/${id}#cards`}}>Cards</Link>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:3}}>
              <span className="entity-header-name">Card ···· {card.last4}</span>
              <Badge status={card.status}/>
              <span style={{fontSize:12,color:'var(--text-secondary)',background:'var(--bg-subtle)',padding:'2px 8px',borderRadius:20,border:'0.5px solid var(--border)'}}>{card.type}</span>
            </div>
            <div className="entity-header-meta">
              <span>{user.name}</span><span style={{color:'var(--border-strong)'}}>·</span>
              <span>{user.email}</span><span style={{color:'var(--border-strong)'}}>·</span><span>{user.phone}</span>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            {card.status !== 'Blocked' && <button className="btn btn-warning btn-sm" onClick={()=>setModalType('freeze')}>❄ Freeze</button>}
            {card.status !== 'Blocked' && <button className="btn btn-danger btn-sm" onClick={()=>setModalType('block')}>Block</button>}
            <button className="btn btn-sm" onClick={()=>setModalType('replace')}>Replace</button>
          </div>
        </div>
        <div className="tabs-bar">
          {TABS.map(t=><div key={t} className={`tab-item${tab===t?' active':''}`} onClick={()=>setTab(t)}>{t}</div>)}
        </div>
      </div>

      <div className="content">
        {tab === 'Overview' && (
          <>
            <div className="two-col" style={{marginBottom:14}}>
              <div className="card">
                <div className="card-title">Cardholder details</div>
                {([['Name',user.name],['ID code',<span style={{fontFamily:'monospace'}}>{user.idcode}</span>],['Phone',user.phone],['Email',user.email],['Home address',user.homeAddress],['Bank account',<span style={{fontFamily:'monospace',fontSize:11}}>{user.bankAccount}</span>]] as [string,React.ReactNode][]).map(([l,v])=>(
                  <div key={String(l)} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
                ))}
              </div>
              <div className="card">
                <div className="card-title">Card details</div>
                {([['Card status',<Badge key="s" status={card.status}/>],['Product',card.product],['Scheme',card.scheme],['Currency',card.currency],['Expiry date',card.exp],['Card type',card.type],['Activation date',card.activation],['Network type',card.network]] as [string,React.ReactNode][]).map(([l,v])=>(
                  <div key={String(l)} className="detail-row"><span className="detail-label">{l}</span><span className="detail-value">{v}</span></div>
                ))}
              </div>
            </div>
            <div className="card card-table-section">
              <div className="card-table-section-header">
                <div className="card-title" style={{marginBottom:0}}>Transactions</div>
              </div>
              {trxs.length === 0 ? <div className="empty-state" style={{padding:'0 20px 16px'}}>No transactions</div> : (
                <div className="table-wrap card-table-wrap">
                  <table>
                    <thead><tr><th>Trx ID</th><th>Date/time ↓</th><th>Type</th><th>Status</th><th>Merchant</th><th>MCC</th><th>Billing</th><th>Trx amt.</th><th>Balance</th></tr></thead>
                    <tbody>
                      {trxs.map(t=>(
                        <tr key={t.id} className="clickable" onClick={()=>router.push(`/transactions/${t.id}`)}>
                          <td style={{fontFamily:'monospace',fontSize:11,color:'var(--text-secondary)'}}>{t.id}</td>
                          <td style={{color:'var(--text-secondary)'}}>{t.dt}</td>
                          <td>{t.type}</td>
                          <td><Badge status={t.status}/></td>
                          <td>{t.merchant}</td>
                          <td style={{color:'var(--text-secondary)'}}>{t.mcc}</td>
                          <td>{t.billing}</td><td>{t.trx}</td>
                          <td>{t.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'Linked cards' && (
          <div className="card">
            <div className="card-title">Linked cards</div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr><Th>Token</Th><Th>Status</Th><Th>Created</Th><Th>Type</Th><Th>Exp</Th><Th>Product</Th><Th>Currency</Th><Th>Activation</Th><Th>Network</Th></tr></thead>
              <tbody>
                {cards.map(lc=>(
                  <tr key={lc.token}>
                    <Td style={{fontWeight:600,color:'var(--indigo)',fontFamily:'monospace',fontSize:11}}>{lc.token}</Td>
                    <Td><Badge status={lc.status}/></Td>
                    <Td style={{color:'var(--text-secondary)'}}>{lc.created}</Td>
                    <Td>{lc.type}</Td><Td>{lc.exp}</Td>
                    <Td style={{fontSize:11}}>{lc.product}</Td>
                    <Td>{lc.currency}</Td>
                    <Td style={{color:'var(--text-secondary)'}}>{lc.activation}</Td>
                    <Td>{lc.network}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'Limits' && (
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
              <div className="card-title" style={{marginBottom:0}}>Card limits</div>
              <div className="info-note" style={{fontSize:11}}>Read-only — contact an admin to modify limits</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
              {([['Per-transaction',300,300,5,5],['Daily',3000,3000,50,50],['Monthly',10000,10000,100,100]] as [string,number,number,number,number][]).map(([label,pos,online,freq,ds])=>(
                <div key={String(label)} className="limit-card">
                  <div className="limit-card-title">{label}</div>
                  {[['Limit POS (€)','€'+pos],['Limit online (€)','€'+online],['Frequency (max trx)',''+freq],['3DS required (max)',''+ds]].map(([l,v])=>(
                    <div key={l} className="limit-row">
                      <span style={{fontSize:12,color:'var(--text-secondary)'}}>{l}</span>
                      <span className="limit-val">{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'Configuration' && (
          <>
            {CURRENT_ROLE !== 'admin' && (
              <div className="warn-note" style={{marginBottom:14,display:'flex',alignItems:'center',gap:8}}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{width:16,height:16,flexShrink:0}}><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>
                <span>Read-only view — editing is restricted to Admin role. Contact an admin to make changes.</span>
              </div>
            )}
            <div className="card">
              <div className="card-title">Configuration</div>
              {CONFIG_ROWS.map(row=>(
                <div key={row.label} className="detail-row">
                  <span className="detail-label">{row.label}</span>
                  <div className="detail-value" style={{display:'flex',alignItems:'center',justifyContent:'flex-end',gap:8}}>
                    <span style={{fontWeight:500}}>{row.value}</span>
                    {CURRENT_ROLE === 'admin' && (
                      <button className="btn btn-sm" style={{fontSize:11,padding:'2px 8px'}} onClick={()=>showToast(`Edit ${row.label}`)}>Edit</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'Audit log' && (
          <div className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
              <div className="card-title" style={{marginBottom:0}}>Card audit log</div>
              <button className="btn btn-sm" onClick={()=>showToast('Downloading audit log...')}>↓ Download</button>
            </div>
            <table style={{width:'100%',borderCollapse:'collapse'}}>
              <thead><tr><Th>Action</Th><Th>Date/time ↓</Th><Th>Initiator</Th><Th>Note</Th></tr></thead>
              <tbody>
                {CARD_AUDIT.map((a,i)=>(
                  <tr key={i}>
                    <Td style={{fontWeight:500}}>{a.action}</Td>
                    <Td style={{color:'var(--text-secondary)'}}>{a.dt}</Td>
                    <Td>{a.initiator}</Td>
                    <Td style={{color:'var(--text-secondary)'}}>{a.note}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!modalType} onClose={()=>setModalType('')}
        title={modalType==='freeze'?'Freeze card':modalType==='block'?'Block card':'Replace card'}
        actions={<>
          <button className="btn" onClick={()=>setModalType('')}>Cancel</button>
          <button className={`btn ${modalType==='freeze'?'btn-warning':modalType==='block'?'btn-danger':'btn-primary'}`}
            onClick={()=>{showToast(modalType==='freeze'?'Card frozen':modalType==='block'?'Card blocked':'Replacement ordered');setModalType('');}}>
            {modalType==='freeze'?'Freeze card':modalType==='block'?'Block card':'Confirm replace'}
          </button>
        </>}>
        <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>
          {modalType==='freeze' && `Temporarily freeze card ···· ${card.last4}. The customer will not be able to make payments until unfrozen.`}
          {modalType==='block' && `Permanently block card ···· ${card.last4}. This cannot be undone — the customer will need a replacement.`}
          {modalType==='replace' && (
            <>
              <p style={{marginBottom:12}}>Issue a replacement for ···· {card.last4}. Current card will be terminated.</p>
              <label className="input-label">Reason for replacement</label>
              <input className="input-field" placeholder="e.g. Lost, damaged, security concern..."/>
            </>
          )}
        </div>
      </Modal>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
