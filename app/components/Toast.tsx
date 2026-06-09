'use client';
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const ToastCtx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState('');
  const [vis, setVis] = useState(false);
  const show = useCallback((m: string) => {
    setMsg(m); setVis(true);
    setTimeout(() => setVis(false), 2500);
  }, []);
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {vis && <div className="toast">{msg}</div>}
    </ToastCtx.Provider>
  );
}
