import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { getTasks, updateTaskStatus, addTask } from '../api/services';
import { type Task, type TaskStatus, type TaskPriority } from '../api/db';
import { LayoutList, KanbanSquare, Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';
import { DateInput } from '../components/ui/DateInput';

const STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case 'URGENT': return 'text-red-600 bg-red-50 border-red-200';
    case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'MEDIUM': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'LOW': return 'text-gray-600 bg-gray-50 border-gray-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export function Tasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [projectName, setProjectName] = useState('');
  const [assigneeName, setAssigneeName] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await getTasks();
    setTasks(data);
    setLoading(false);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId as TaskStatus;
    
    // Optimistic update
    setTasks(prev => 
      prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t)
    );

    // Actual API call
    await updateTaskStatus(draggableId, newStatus);
  };

  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    await updateTaskStatus(id, newStatus);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    await addTask({
      title,
      description,
      status,
      priority,
      dueDate,
      projectName: projectName || undefined,
      assigneeName: assigneeName || undefined,
    });
    
    setIsModalOpen(false);
    setTitle('');
    setDescription('');
    setStatus('TODO');
    setPriority('MEDIUM');
    setDueDate('');
    setProjectName('');
    setAssigneeName('');
    await loadTasks();
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div 
      onClick={() => navigate(`/admin/tasks/${task.id}`)}
      className="bg-card border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-3 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-foreground text-sm">{task.title}</h4>
      </div>
      
      {task.description && (
        <p className="text-xs text-muted mb-3 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        {task.projectName && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/50 text-muted">
            {task.projectName}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border text-xs">
        <div className="flex items-center gap-1.5 text-muted">
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{task.dueDate || 'No date'}</span>
        </div>
        {task.assigneeName && (
          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]" title={task.assigneeName}>
            {task.assigneeName.charAt(0)}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col h-full relative pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Tasks</h1>
          <p className="text-sm text-muted mt-1">Manage deliverables and to-dos</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
          
          <div className="flex bg-card border border-border rounded-lg p-1">
            <button 
              onClick={() => setView('kanban')}
              className={`p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium ${view === 'kanban' ? 'bg-primary text-primary-foreground shadow' : 'text-muted hover:text-foreground'}`}
            >
              <KanbanSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 rounded-md transition-colors flex items-center gap-2 text-sm font-medium ${view === 'list' ? 'bg-primary text-primary-foreground shadow' : 'text-muted hover:text-foreground'}`}
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Loading tasks...</div>
      ) : view === 'kanban' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex overflow-x-auto xl:grid xl:grid-cols-4 gap-6 pb-4 flex-1 items-start h-[calc(100vh-200px)] snap-x">
            {STATUSES.map(statusCol => (
              <div key={statusCol} className="bg-secondary/30 rounded-xl p-4 flex flex-col max-h-full border border-border/50 min-w-[280px] w-[85vw] xl:w-auto snap-center shrink-0">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">{statusCol.replace('_', ' ')}</h3>
                  <span className="bg-background text-muted text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    {tasks.filter(t => t.status === statusCol).length}
                  </span>
                </div>
                
                <Droppable droppableId={statusCol}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto transition-colors rounded-lg p-1 ${snapshot.isDraggingOver ? 'bg-secondary/50' : ''}`}
                    >
                      {tasks.filter(t => t.status === statusCol).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}
                              className={snapshot.isDragging ? 'opacity-80' : ''}
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-foreground text-sm border-b border-border">
                  <th className="p-4 font-semibold">Task</th>
                  <th className="p-4 font-semibold">Priority</th>
                  <th className="p-4 font-semibold">Due Date</th>
                  <th className="p-4 font-semibold">Project</th>
                  <th className="p-4 font-semibold">Assignee</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {tasks.map(task => (
                  <tr key={task.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-foreground mb-0.5">{task.title}</div>
                      {task.description && <div className="text-xs text-muted">{task.description}</div>}
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4 text-muted flex items-center gap-1.5 mt-2">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {task.dueDate || '-'}
                    </td>
                    <td className="p-4 text-muted">{task.projectName || '-'}</td>
                    <td className="p-4">
                      {task.assigneeName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                            {task.assigneeName.charAt(0)}
                          </div>
                          <span className="text-muted">{task.assigneeName}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-4">
                      <SelectInput 
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </SelectInput>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">New Task</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="add-task-form" onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Title</label>
                  <input 
                    required
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    placeholder="Task title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Description</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground min-h-[80px]"
                    placeholder="Optional details..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Status</label>
                    <SelectInput 
                      value={status}
                      onChange={e => setStatus(e.target.value as TaskStatus)}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </SelectInput>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Priority</label>
                    <SelectInput 
                      value={priority}
                      onChange={e => setPriority(e.target.value as TaskPriority)}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </SelectInput>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Due Date</label>
                  <DateInput 
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Project Link (Optional)</label>
                  <input 
                    type="text" 
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    placeholder="e.g. Skyline Penthouse"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Assign To (Optional)</label>
                  <input 
                    type="text" 
                    value={assigneeName}
                    onChange={e => setAssigneeName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    placeholder="Staff name"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-border bg-secondary/20 rounded-b-2xl flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="add-task-form"
                className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
