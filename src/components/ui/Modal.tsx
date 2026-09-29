import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center py-8">
        <div className={`bg-card w-full ${maxWidth} rounded-2xl shadow-xl border border-border flex flex-col`}>
          <div className="flex justify-between items-center p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <button 
              onClick={onClose}
              className="text-muted hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
