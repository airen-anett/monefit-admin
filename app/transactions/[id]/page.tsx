'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTransactionById, getUserById } from '../../lib/data';
import { Badge } from '../../components/Badge';

export default function TransactionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const trx = getTransactionById(id);
  const user = trx ? getUserById(trx.userId) : undefined;

  if (!trx) {
    return (
      <div className="content">
        Transaction not found. <Link href="/transactions">Back to transactions</Link>
      </div>
    );
  }

  const displayId = trx.id.length > 12 ? `${trx.id.slice(0, 10)}..` : trx.id;

  return (
    <>
      <div className="entity-header">
        <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
          <button className="btn btn-sm" onClick={() => router.push('/transactions')} style={{marginTop:4,padding:'4px 8px',flexShrink:0}}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          </button>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              <span className="entity-header-name">Transaction {displayId}</span>
              <Badge status={trx.status} />
            </div>
            {user && (
              <div className="entity-header-meta" style={{marginTop:6}}>
                <Link href={`/users/${user.id}`} style={{color:'var(--text-secondary)',textDecoration:'none'}}>{user.name}</Link>
                <span style={{color:'var(--border-strong)'}}>·</span>
                <span>{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="content">
        <div className="card trx-detail-card">
          <div className="trx-detail-grid">
            {([
              ['Card', trx.cardToken],
              ['Date and time', trx.dt],
              ['Merchant', trx.merchant],
              ['MCC', trx.mcc],
              ['Amount', trx.trx],
              ['Transaction type', trx.type],
              ['Response status', trx.responseStatus],
              ['STAN', trx.stan],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="trx-detail-item">
                <div className="trx-detail-label">{label}</div>
                <div className="trx-detail-value">{value}</div>
              </div>
            ))}
          </div>
          <div className="trx-detail-divider" />
          <div className="trx-detail-grid">
            {([
              ['Processing code', trx.processingCode],
              ['Auth code', trx.authCode],
              ['Network', trx.network],
              ['Card type', trx.cardType],
              ['Current card balance', trx.balance],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="trx-detail-item">
                <div className="trx-detail-label">{label}</div>
                <div className="trx-detail-value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
