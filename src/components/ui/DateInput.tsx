import { useState, useRef, useEffect, type InputHTMLAttributes } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  className?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function DateInput({ className = '', value = '', onChange, ...props }: DateInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewDate, setViewDate] = useState(() => value ? new Date(value) : new Date());

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const dateString = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
    if (onChange) onChange({ target: { value: dateString } });
    setIsOpen(false);
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isSelected = (day: number) => {
    if (!value) return false;
    const selected = new Date(value);
    return selected.getDate() === day && selected.getMonth() === viewDate.getMonth() && selected.getFullYear() === viewDate.getFullYear();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <input type="hidden" value={value} {...props} />
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground pr-10 cursor-pointer flex items-center"
      >
        <span className={value ? "text-foreground" : "text-muted"}>
          {value || props.placeholder || 'Select date...'}
        </span>
        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 bg-card border border-border rounded-lg shadow-xl p-3">
          <div className="flex justify-between items-center mb-3">
            <button 
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="p-1 hover:bg-secondary rounded-md text-muted hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="font-semibold text-sm text-foreground">
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </div>
            <button 
              type="button"
              onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="p-1 hover:bg-secondary rounded-md text-muted hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map(day => (
              <div key={day} className="text-center text-[10px] font-semibold text-muted py-1">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {blanks.map(b => <div key={`blank-${b}`} className="w-7 h-7" />)}
            {days.map(day => (
              <button
                key={day}
                type="button"
                onClick={() => handleDateSelect(day)}
                className={`w-7 h-7 text-xs flex items-center justify-center rounded-full transition-colors
                  ${isSelected(day) ? 'bg-primary text-primary-foreground font-bold shadow-sm' : 
                    isToday(day) ? 'bg-primary/10 text-primary font-bold' : 
                    'text-foreground hover:bg-secondary'
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
