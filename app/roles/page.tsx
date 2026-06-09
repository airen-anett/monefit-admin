'use client';
import { useState } from 'react';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

const TEAM = [
  { name: 'Ulla Ugast', email: 'ulla.ugast@monefit.com', role: 'Support', status: 'Active', lastLogin: '09/06/2026' },
  { name: 'Kristiin Pärn', email: 'kristiin.parn@monefit.com', role: 'Support', status: 'Active', lastLogin: '08/06/2026' },
  { name: 'Rainer Sepp', email: 'rainer.sepp@monefit.com', role: 'Admin', status: 'Active', lastLogin: '09/06/2026' },
  { name: 'System Admin', email: 'admin@monefit.com', role: 'Admin', status: 'Active', lastLogin: '09/06/2026' },
];

type TeamMember = (typeof TEAM)[number];

const PERMS: Record<string, string[]> = {
  Support: [
    'View users and profiles',
    'Block / unblock users',
    'View applications',
    'View disputes',
    'Add internal notes',
    'View audit logs',
    'View transactions',
    'Upload / download documents',
    'Configuration — read-only',
  ],
  Admin: [
    'All Support permissions',
    'Approve / decline applications',
    'Manage feature flags',
    'Edit card configuration',
    'Manage team roles',
    'Toggle environments',
  ],
};

export default function TeamPage() {
  const [toast, setToast] = useState('');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(''), 2500); };
  return (
    <div className="content">
      <div className="page-title">Team</div>
      <div className="info-note" style={{marginBottom:18}}>
        Role-based access control is active. The <strong>Configuration</strong> tab on cards is read-only for Support and editable for Admin. Feature flags are Admin-only.
      </div>

      {/* Permission matrix */}
      <div className="two-col" style={{marginBottom:20}}>
        {Object.entries(PERMS).map(([role, perms])=>(
          <div key={role} className="card" style={{borderTop:`3px solid ${role==='Admin'?'var(--amber)':'var(--indigo)'}`}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <div className="card-title" style={{marginBottom:0}}>{role}</div>
              <Badge status={role as 'Admin'|'Support'}/>
            </div>
            {perms.map(p=>(
              <div key={p} style={{padding:'5px 0',borderBottom:'0.5px solid var(--border)',fontSize:13,color:'var(--text-secondary)'}}>
                {p}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Team members */}
      <div className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div className="card-title" style={{marginBottom:0}}>Team members</div>
          <button className="btn btn-primary btn-sm" onClick={()=>showToast('Invite sent')}>+ Invite member</button>
        </div>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead><tr>
            {['Name','Email','Role','Status','Last login',''].map(h=>(
              <th key={h} style={{padding:'9px 0',fontSize:11,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-primary)',fontWeight:600,textAlign:'left',borderBottom:'0.5px solid var(--border)',background:'var(--metric-violet-light)'}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {TEAM.map(m=>(
              <tr key={m.email} className="clickable" onClick={()=>setSelectedMember(m)}>
                <td style={{padding:'10px 0',borderBottom:'0.5px solid var(--border)',fontWeight:600}}>{m.name}</td>
                <td style={{padding:'10px 0',borderBottom:'0.5px solid var(--border)',color:'var(--text-secondary)',fontSize:12}}>{m.email}</td>
                <td style={{padding:'10px 0',borderBottom:'0.5px solid var(--border)'}}><Badge status={m.role as 'Admin'|'Support'}/></td>
                <td style={{padding:'10px 0',borderBottom:'0.5px solid var(--border)'}}><Badge status={m.status as 'Active'}/></td>
                <td style={{padding:'10px 0',borderBottom:'0.5px solid var(--border)',color:'var(--text-secondary)'}}>{m.lastLogin}</td>
                <td style={{padding:'10px 0',borderBottom:'0.5px solid var(--border)',textAlign:'right'}}>
                  <button className="btn btn-sm" onClick={e=>{ e.stopPropagation(); showToast(`Edit ${m.name}`); }}>Edit role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={!!selectedMember} onClose={()=>setSelectedMember(null)} title={selectedMember ? `${selectedMember.name} — access rights` : ''}
        actions={<button className="btn" onClick={()=>setSelectedMember(null)}>Close</button>}>
        {selectedMember && (
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
              <Badge status={selectedMember.role as 'Admin'|'Support'}/>
              <span style={{fontSize:12,color:'var(--text-secondary)'}}>{selectedMember.email}</span>
            </div>
            <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',color:'var(--text-secondary)',marginBottom:10}}>
              Current permissions
            </div>
            {PERMS[selectedMember.role].map(p=>(
              <div key={p} style={{padding:'7px 0',borderBottom:'0.5px solid var(--border)',fontSize:13}}>
                {p}
              </div>
            ))}
          </div>
        )}
      </Modal>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
