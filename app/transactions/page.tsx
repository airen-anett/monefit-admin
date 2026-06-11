'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSACTIONS, getUserById } from '../lib/data';
import { Badge } from '../components/Badge';

const STATUSES = ['All', 'Accepted', 'Cleared', 'Settled', 'Declined'];

export default function TransactionsPage() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');

  const results = TRANSACTIONS.filter(t => {
    const s = q.toLowerCase();
    const user = getUserById(t.userId);
    const mq = !s || t.id.toLowerCase().includes(s) || t.merchant.toLowerCase().includes(s) || t.type.toLowerCase().includes(s) || (user?.name.toLowerCase().includes(s) ?? false);
    const mf = filter === 'All' || t.status === filter;
    return mq && mf;
  }).sort((a, b) => b.dt.localeCompare(a.dt));

  return (
    <div className="content">
      <div className="page-title">Transactions & payments</div>
      <div className="filter-bar">
        <input placeholder="Search by transaction ID, merchant, customer..." value={q} onChange={e => setQ(e.target.value)} />
        <div className="select-wrap">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-bar-meta">{results.length} transactions</div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Trx ID</th>
              <th>Date/time ↓</th>
              <th>Trx type</th>
              <th>Status</th>
              <th>Merchant</th>
              <th>MCC</th>
              <th>Billing amt.</th>
              <th>Trx amt.</th>
              <th>Reason code</th>
              <th>Current balance</th>
            </tr>
          </thead>
          <tbody>
            {results.map(t => (
              <tr key={t.id} className="clickable" onClick={() => router.push(`/transactions/${t.id}`)}>
                <td style={{fontFamily:'monospace',fontSize:11,color:'var(--text-secondary)'}}>{t.id}</td>
                <td style={{color:'var(--text-secondary)'}}>{t.dt}</td>
                <td>{t.type}</td>
                <td><Badge status={t.status} /></td>
                <td>{t.merchant}</td>
                <td style={{color:'var(--text-secondary)'}}>{t.mcc}</td>
                <td>{t.billing}</td>
                <td>{t.trx}</td>
                <td style={{color:t.reasonCode.startsWith('00') ? 'var(--emerald)' : t.reasonCode ? 'var(--rose)' : 'var(--text-tertiary)',fontSize:11,fontFamily:'monospace'}}>{t.reasonCode || '—'}</td>
                <td>{t.balance}</td>
              </tr>
            ))}
            {results.length === 0 && <tr><td colSpan={10} className="empty-state">No transactions found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
