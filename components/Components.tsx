import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'govt';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg";
  
  const variants = {
    primary: "bg-[#10B981] text-white hover:bg-[#059669] shadow-sm", // Healthcare Green
    secondary: "bg-emerald-50 text-[#10B981] hover:bg-emerald-100 border border-emerald-100",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    govt: "bg-orange-500 text-white hover:bg-orange-600 shadow-sm", // Jan Aushadhi Saffron
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} disabled={isLoading} {...props}>
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label?: string;
}

export const Input: React.FC<InputProps> = ({ icon: Icon, label, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-slate-400" />
          </div>
        )}
        <input
          className={`
            w-full bg-white border border-slate-200 text-slate-900 text-sm rounded-lg 
            focus:ring-2 focus:ring-[#10B981] focus:border-transparent block 
            ${Icon ? 'pl-10' : 'pl-4'} p-3 transition-all duration-200
            placeholder-slate-400 shadow-sm
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};

// --- Badge ---
// Added className prop to support additional styling via props and fix TypeScript errors
export const Badge: React.FC<{ children: React.ReactNode; type?: 'success' | 'warning' | 'info' | 'govt'; className?: string }> = ({ children, type = 'info', className = '' }) => {
  const colors = {
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    info: "bg-blue-100 text-blue-700",
    govt: "bg-orange-100 text-orange-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${colors[type]} ${className}`}>
      {children}
    </span>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

// --- Modal ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 py-6 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <div className="relative inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:max-w-lg w-full p-6">
          {(title) && (
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900" id="modal-title">{title}</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};