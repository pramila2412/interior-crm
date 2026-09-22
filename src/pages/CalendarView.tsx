import { useEffect, useState } from 'react';
import { getCalendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent, getProjects } from '../api/services';
import { type CalendarEvent, type Project } from '../api/db';
import { ChevronLeft, ChevronRight, Plus, X, Trash2 } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';

export function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'meeting' | 'installation' | 'measurement' | 'deadline'>('meeting');
  const [projectId, setProjectId] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const [eventsData, projectsData] = await Promise.all([getCalendarEvents(), getProjects()]);
    setEvents(eventsData);
    setProjects(projectsData);
    setLoading(false);
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const today = () => setCurrentDate(new Date());

  const openAddModal = (selectedDate?: Date) => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setDate(selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    setType('meeting');
    setProjectId('');
    setIsModalOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description || '');
    setDate(new Date(event.date).toISOString().split('T')[0]);
    setType(event.type);
    setProjectId(event.projectId || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      alert('Please select a project to link this event to.');
      return;
    }
    
    if (editingEvent) {
      await updateCalendarEvent(editingEvent.id, { title, description, date: new Date(date).toISOString(), type, projectId });
    } else {
      await addCalendarEvent({ title, description, date: new Date(date).toISOString(), type, projectId });
    }
    setIsModalOpen(false);
    await loadEvents();
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteCalendarEvent(editingEvent.id);
      setIsModalOpen(false);
      await loadEvents();
    }
  };

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

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
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Project Calendar</h1>
          <p className="text-muted mt-1">Manage project schedules, meetings, and deadlines.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => openAddModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Event
          </button>
          
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
            {days.map((d, idx) => {
              if (!d) return <div key={`empty-${idx}`} className="bg-card min-h-[120px]"></div>;

              const isToday = new Date().toDateString() === d.toDateString();
              const dayEvents = events.filter(e => new Date(e.date).toDateString() === d.toDateString());

              return (
                <div 
                  key={d.toISOString()} 
                  onClick={() => openAddModal(d)}
                  className={`bg-card min-h-[120px] p-2 hover:bg-secondary/5 transition-colors group relative cursor-pointer ${isToday ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                      {d.getDate()}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={(e) => openEditModal(e, event)}
                        className={`text-xs px-2 py-1.5 rounded truncate font-medium border ${
                          event.type === 'measurement' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                          event.type === 'installation' ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' :
                          event.type === 'deadline' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' :
                          'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-lg border border-border flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">
                  {editingEvent ? 'Edit Event' : 'New Event'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-visible">
                <form id="eventForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Event Title</label>
                  <input 
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    placeholder="e.g. Site Measurement"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Date</label>
                  <input 
                    required
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Event Type</label>
                  <select 
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  >
                    <option value="meeting">Client Meeting</option>
                    <option value="measurement">Site Measurement</option>
                    <option value="installation">Installation</option>
                    <option value="deadline">Project Deadline</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Link to Project</label>
                  <SelectInput 
                    required
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                  >
                    <option value="" disabled>Select a project...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.projectName}</option>
                    ))}
                  </SelectInput>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Description (Optional)</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-none h-20"
                    placeholder="Add details here..."
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-border bg-secondary/20 rounded-b-2xl flex justify-between gap-3">
              {editingEvent ? (
                <button 
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              ) : <div></div>}
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button 
                  form="eventForm"
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
                >
                  {editingEvent ? 'Save Changes' : 'Add Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
