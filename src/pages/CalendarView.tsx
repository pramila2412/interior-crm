import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers } from '../api/services';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type CalendarEvent = {
  id: string;
  customerId: string;
  customerName: string;
  service: string;
  date: Date;
  type: 'measurement' | 'delivery';
};

export function CalendarView() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    getCustomers().then(data => {
      const allEvents: CalendarEvent[] = [];
      data.forEach(customer => {
        if (customer.measurementDate) {
          allEvents.push({
            id: `${customer.id}-m`,
            customerId: customer.id,
            customerName: customer.name,
            service: customer.category || customer.service,
            date: new Date(customer.measurementDate),
            type: 'measurement'
          });
        }
        if (customer.deliveryDate) {
          allEvents.push({
            id: `${customer.id}-d`,
            customerId: customer.id,
            customerName: customer.name,
            service: customer.category || customer.service,
            date: new Date(customer.deliveryDate),
            type: 'delivery'
          });
        }
      });
      setEvents(allEvents);
      setLoading(false);
    });
  }, []);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const today = () => setCurrentDate(new Date());

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay(); // 0 = Sunday

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Project Calendar</h1>
          <p className="text-muted mt-1">Upcoming measurement and delivery schedules.</p>
        </div>
        <div className="flex items-center gap-4 bg-card border border-border p-1.5 rounded-lg shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-background rounded-md transition-colors text-muted hover:text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={today} className="px-4 font-medium text-foreground hover:text-primary transition-colors">
            {monthName}
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-background rounded-md transition-colors text-muted hover:text-foreground">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Loading schedule...</div>
      ) : (
        <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="grid grid-cols-7 border-b border-border bg-background/50">
            {weekdays.map(day => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-muted uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 flex-1 auto-rows-fr min-h-[600px] bg-border gap-px">
            {days.map((date, idx) => {
              if (!date) {
                return <div key={`empty-${idx}`} className="bg-card min-h-[120px]"></div>;
              }

              const isToday = new Date().toDateString() === date.toDateString();
              const dayEvents = events.filter(e => e.date.toDateString() === date.toDateString());

              return (
                <div key={date.toISOString()} className={`bg-card min-h-[120px] p-2 hover:bg-secondary/5 transition-colors group relative ${isToday ? 'bg-primary/5' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {date.getDate()}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => navigate(`/admin/customers/${event.customerId}`)}
                        className={`text-xs px-2 py-1.5 rounded cursor-pointer truncate font-medium border ${
                          event.type === 'measurement' 
                            ? 'bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20'
                            : 'bg-accent/10 text-accent border-accent/20 hover:bg-accent/20'
                        }`}
                        title={`${event.type === 'measurement' ? 'Measurement' : 'Delivery'}: ${event.customerName}`}
                      >
                        {event.type === 'measurement' ? '📏 ' : '🚚 '}
                        {event.customerName}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
