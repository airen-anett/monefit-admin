'use client';
import './globals.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { USERS } from './lib/data';

const NAV = [
  { href:'/', label:'Dashboard', section:'WORKSPACE', d:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href:'/users', label:'Users', section:null, d:'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { href:'/transactions', label:'Transactions', section:null, d:'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
  { href:'/applications', label:'Applications', section:'OPERATIONS', d:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { href:'/disputes', label:'Disputes', section:null, d:'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { href:'/feature-flags', label:'Feature flags', section:'ADMIN', d:'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9' },
  { href:'/audit-log', label:'Audit log', section:null, d:'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href:'/roles', label:'Team', section:'ACCESS', d:'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
];

function Icon({ d }: { d: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d}/></svg>;
}

function MoonIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{width:16,height:16}} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>;
}
function SunIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{width:16,height:16}} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const [dark, setDark] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') { setDark(true); document.documentElement.setAttribute('data-theme','dark'); }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  const filtered = search.trim().length > 1
    ? USERS.filter(u => {
        const q = search.toLowerCase();
        return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q) || u.idcode.includes(q);
      }).slice(0, 5)
    : [];

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShowDrop(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  let lastSec = '';
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-logo">
              <div className="sidebar-logo-dot"/>
              monefit
            </div>
            {NAV.map(link => {
              const showSec = link.section && link.section !== lastSec;
              if (link.section) lastSec = link.section;
              return (
                <div key={link.href}>
                  {showSec && <div className="sidebar-section">{link.section}</div>}
                  <Link href={link.href} className={`sidebar-item${isActive(link.href) ? ' active' : ''}`}>
                    <Icon d={link.d}/>{link.label}
                  </Link>
                </div>
              );
            })}
            <div style={{flex:1}}/>
            <div className="sidebar-footer">
              <div className="sidebar-user">
                <div className="avatar">UU</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:'var(--text-primary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>Ulla Ugast</div>
                  <div style={{fontSize:11,color:'var(--text-tertiary)'}}>Support</div>
                </div>
              </div>
              <button className="logout-btn" onClick={() => alert('Logged out')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{width:14,height:14}} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Log out
              </button>
            </div>
          </div>

          {/* Main */}
          <div className="main-area">
            <div className="topbar">
              <div className="search-wrap" ref={ref}>
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input placeholder="Search by name, email, phone, ID code..." value={search}
                  onChange={e=>{setSearch(e.target.value);setShowDrop(true);}}
                  onFocus={()=>setShowDrop(true)}/>
                {showDrop && search.trim().length > 1 && (
                  <div className="search-dropdown">
                    {filtered.length === 0
                      ? <div style={{padding:'12px 14px',color:'var(--text-tertiary)',fontSize:13}}>No users found</div>
                      : <>
                          <div className="search-dropdown-label">Users</div>
                          {filtered.map(u=>(
                            <div key={u.id} className="search-result" onClick={()=>{router.push(`/users/${u.id}`);setSearch('');setShowDrop(false);}}>
                              <div className="avatar" style={{width:26,height:26,fontSize:9}}>{u.name.split(' ').map((n:string)=>n[0]).join('')}</div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{fontWeight:500,fontSize:13,color:'var(--text-primary)'}}>{u.name}</div>
                                <div style={{fontSize:11,color:'var(--text-tertiary)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.email} · {u.phone}</div>
                              </div>
                              <span className={`badge badge-${u.status.toLowerCase()}`}>{u.status}</span>
                            </div>
                          ))}
                        </>
                    }
                  </div>
                )}
              </div>
              <div className="topbar-actions">
                <div style={{fontSize:12,color:'var(--text-tertiary)'}}>
                  {new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
                </div>
                <button className="theme-btn" onClick={toggleTheme} title={dark ? 'Light mode' : 'Dark mode'}>
                  {dark ? <SunIcon/> : <MoonIcon/>}
                </button>
              </div>
            </div>
            <div className="main-scroll">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
