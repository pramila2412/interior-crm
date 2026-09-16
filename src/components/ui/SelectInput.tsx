import React, { useState, useRef, useEffect, type SelectHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  children: ReactNode;
  className?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
}

export function SelectInput({ children, className = '', value, onChange, ...props }: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract options from children
  const options = React.Children.toArray(children)
    .filter(child => React.isValidElement(child) && child.type === 'option')
    .map((child: any) => ({
      value: child.props.value,
      label: child.props.children
    }));

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      onChange({ target: { value: selectedValue } });
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* Hidden native select for form compatibility if needed */}
      <select value={value} onChange={e => handleSelect(e.target.value)} className="hidden" {...props}>
        {children}
      </select>

      {/* Custom Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground pr-10 cursor-pointer flex items-center justify-between"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>

      {/* Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(opt.value)}
              className={`px-3 py-2 cursor-pointer text-sm transition-colors
                ${opt.value === value ? 'bg-primary/10 text-primary font-medium' : 'text-foreground hover:bg-secondary'}
              `}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
