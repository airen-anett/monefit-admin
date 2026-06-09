'use client';
import { ReactNode } from 'react';
export function Modal({ open, onClose, title, children, actions }: {
  open: boolean; onClose: () => void; title: string; children?: ReactNode; actions?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-title">{title}</div>
        <div style={{marginBottom:16}}>{children}</div>
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </div>
  );
}
