'use client';
import { useState } from 'react';
import { FEATURE_FLAGS, FeatureFlag } from '../lib/data';
import { Badge } from '../components/Badge';

const PROPERTIES = ['ID','Personal Code','Email','Gender','Region','Releasable percent','App version','Country'];
const ENVIRONMENTS: FeatureFlag['environment'][] = ['Production','Staging','Development'];

interface Condition { property: string; value: string; }

function FlagModal({ flag, onClose, onSave }: { flag: FeatureFlag; onClose: ()=>void; onSave: (f: FeatureFlag)=>void; }) {
  const [name, setName] = useState(flag.name);
  const [desc, setDesc] = useState(flag.description);
  const [type, setType] = useState<'boolean'|'condition'>('boolean');
  const [conditions, setConditions] = useState<Condition[]>([{property:'Email',value:''}]);
  const [env, setEnv] = useState(flag.environment);
  const [enabled, setEnabled] = useState(flag.status === 'Enabled');
  const [openPropDrop, setOpenPropDrop] = useState<number|null>(null);

  const addCondition = () => setConditions(p=>[...p,{property:'Email',value:''}]);
  const removeCondition = (i: number) => setConditions(p=>p.filter((_,idx)=>idx!==i));
  const updateCondition = (i: number, field: keyof Condition, val: string) =>
    setConditions(p=>p.map((c,idx)=>idx===i?{...c,[field]:val}:c));

  return (
    <div className="modal-overlay" onClick={e=>{ if(e.target===e.currentTarget)onClose(); }}>
      <div className="modal" style={{width:540,maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
          <div className="modal-title">Update feature flag</div>
          <button className="btn btn-sm btn-icon" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:16,height:16}}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <label className="input-label">Name</label>
        <input className="input-field" value={name} onChange={e=>setName(e.target.value)}/>

        <label className="input-label">Key</label>
        <input className="input-field" value={name.toLowerCase().replace(/\s+/g,'_')} readOnly style={{background:'var(--bg-subtle)',color:'var(--text-secondary)',fontFamily:'monospace',fontSize:12}}/>

        <label className="input-label">Description</label>
        <textarea className="input-field" style={{minHeight:64}} value={desc} onChange={e=>setDesc(e.target.value)}/>

        <label className="input-label">Environment</label>
        <div className="select-wrap" style={{width:'100%',marginBottom:10}}>
          <select value={env} onChange={e=>setEnv(e.target.value as FeatureFlag['environment'])} style={{width:'100%'}}>
            {ENVIRONMENTS.map(e=><option key={e}>{e}</option>)}
          </select>
        </div>

        <label className="input-label">Status</label>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:16}}>
          <div className={`toggle-track${enabled?' on':''}`} onClick={()=>setEnabled(p=>!p)} style={{cursor:'pointer'}}>
            <div className={`toggle-thumb${enabled?' on':' off'}`}/>
          </div>
          <span style={{fontSize:13,fontWeight:500,color:enabled?'var(--emerald)':'var(--text-secondary)'}}>{enabled?'Enabled':'Disabled'}</span>
        </div>

        <div className="modal-divider"/>
        <label className="input-label">Type</label>
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          <button className={`flag-type-btn${type==='boolean'?' active':''}`} onClick={()=>setType('boolean')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/></svg>
            Boolean (True / False)
          </button>
          <button className={`flag-type-btn${type==='condition'?' active':''}`} onClick={()=>setType('condition')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:14,height:14}}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>
            Condition-based
          </button>
        </div>

        {type === 'condition' && (
          <>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <label className="input-label" style={{marginBottom:0}}>Conditions (OR logic)</label>
              <button className="btn btn-sm btn-primary" onClick={addCondition}>+ Add condition</button>
            </div>
            {conditions.map((cond,i)=>(
              <div key={i} style={{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:8,marginBottom:8,alignItems:'flex-start'}}>
                <div style={{position:'relative'}}>
                  <button className="input-field" style={{textAlign:'left',marginBottom:0,cursor:'pointer',background:'var(--bg-card)'}}
                    onClick={()=>setOpenPropDrop(openPropDrop===i?null:i)}>
                    {cond.property}
                    <span style={{float:'right',color:'var(--text-tertiary)'}}>▾</span>
                  </button>
                  {openPropDrop===i && (
                    <div style={{position:'absolute',top:'100%',left:0,right:0,zIndex:50,background:'var(--bg-card)',border:'0.5px solid var(--border-strong)',borderRadius:8,boxShadow:'var(--shadow-md)',maxHeight:200,overflowY:'auto'}}>
                      {PROPERTIES.map(p=>(
                        <div key={p} style={{padding:'8px 12px',cursor:'pointer',fontSize:13,background:cond.property===p?'var(--indigo-light)':'',color:cond.property===p?'var(--indigo)':'var(--text-primary)'}}
                          onClick={()=>{updateCondition(i,'property',p);setOpenPropDrop(null);}}>
                          {p}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input className="input-field" style={{marginBottom:0}} placeholder="Value" value={cond.value}
                  onChange={e=>updateCondition(i,'value',e.target.value)}/>
                <button className="btn btn-sm btn-danger" style={{padding:'7px 9px'}} onClick={()=>removeCondition(i)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{width:13,height:13}}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            ))}
            {conditions.length === 0 && <div className="info-note">No conditions — add one above to target specific users.</div>}
          </>
        )}

        <div className="modal-actions">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={()=>{ onSave({...flag,name,description:desc,environment:env,status:enabled?'Enabled':'Disabled'}); onClose(); }}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState(FEATURE_FLAGS);
  const [editFlag, setEditFlag] = useState<FeatureFlag|null>(null);
  const [toast, setToast] = useState('');
  const showToast = (m: string) => { setToast(m); setTimeout(()=>setToast(''), 2500); };

  const toggle = (id: string) => {
    const flag = flags.find(f=>f.id===id);
    setFlags(prev=>prev.map(f=>f.id===id?{...f,status:f.status==='Enabled'?'Disabled':'Enabled'}:f));
    showToast(`${flag?.name} ${flag?.status==='Enabled'?'disabled':'enabled'}`);
  };

  const handleSave = (updated: FeatureFlag) => {
    setFlags(prev=>prev.map(f=>f.id===updated.id?updated:f));
    showToast(`${updated.name} saved`);
  };

  return (
    <div className="content">
      <div className="page-title">Feature flags</div>
      <div className="warn-note" style={{marginBottom:16}}>Admin-only section. Changes to Production flags affect live customers immediately.</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Feature flag</th><th>Description</th><th>Environment</th><th>Updated by</th><th>Updated</th><th>Status</th><th style={{textAlign:'right'}}>Toggle</th></tr></thead>
          <tbody>
            {flags.map(f=>(
              <tr key={f.id} className="clickable" onClick={()=>setEditFlag(f)}>
                <td style={{fontWeight:600,fontFamily:'monospace',fontSize:11,color:'var(--metric-violet-dark)'}}>{f.name}</td>
                <td style={{maxWidth:240,color:'var(--text-secondary)',fontSize:12}}>{f.description}</td>
                <td><Badge status={f.environment}/></td>
                <td style={{color:'var(--text-secondary)'}}>{f.updatedBy}</td>
                <td style={{color:'var(--text-secondary)'}}>{f.updatedAt}</td>
                <td><Badge status={f.status}/></td>
                <td style={{textAlign:'right'}} onClick={e=>e.stopPropagation()}>
                  <div className={`toggle-track${f.status==='Enabled'?' on':''}`} onClick={()=>toggle(f.id)} style={{cursor:'pointer',marginLeft:'auto'}}>
                    <div className={`toggle-thumb${f.status==='Enabled'?' on':' off'}`}/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editFlag && <FlagModal flag={editFlag} onClose={()=>setEditFlag(null)} onSave={handleSave}/>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
