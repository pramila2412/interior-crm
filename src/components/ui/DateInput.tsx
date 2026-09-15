import type { InputHTMLAttributes } from 'react';
import { Calendar } from 'lucide-react';

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function DateInput({ className = '', ...props }: DateInputProps) {
  return (
    <div className="relative w-full date-input-wrapper">
      <input
        type="date"
        className={`w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground appearance-none pr-10 ${className}`}
        {...props}
      />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
      <style>{`
        /* Make the invisible native picker cover the entire input or just the right side so it's easily clickable */
        .date-input-wrapper input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          cursor: pointer;
          position: absolute;
          right: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
