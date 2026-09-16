import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById, updateTaskStatus } from '../api/services';
import { type Task, type TaskStatus, type TaskPriority } from '../api/db';
import { ArrowLeft, Calendar, FileText, CheckCircle2, AlertCircle, Briefcase, FolderKanban } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';

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

export function TaskDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTask(id);
    }
  }, [id]);

  const loadTask = async (taskId: string) => {
    setLoading(true);
    const data = await getTaskById(taskId);
    setTask(data || null);
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    setTask({ ...task, status: newStatus });
    await updateTaskStatus(task.id, newStatus);
  };

  if (loading) {
    return <div className="text-center py-10 text-muted">Loading task details...</div>;
  }

  if (!task) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-primary mb-2">Task Not Found</h2>
        <button onClick={() => navigate('/admin/tasks')} className="text-accent hover:underline">
          Return to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/tasks')}
            className="p-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-primary">{task.title}</h1>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <p className="text-muted mt-1 text-sm">Assignee: <span className="font-medium text-foreground">{task.assigneeName || 'Unassigned'}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted">Current Status:</span>
          <SelectInput 
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </SelectInput>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Info Cards */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-[#8b5cf6]" />
          </div>
          <div>
            <p className="text-sm text-muted mb-0.5">Due Date</p>
            <p className="font-semibold text-foreground">{task.dueDate || 'No set date'}</p>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <FolderKanban className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted mb-0.5">Related Project</p>
            <p className="font-semibold text-foreground">{task.projectName || 'None'}</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-[#10b981]" />
          </div>
          <div>
            <p className="text-sm text-muted mb-0.5">Progress Stage</p>
            <p className="font-semibold text-foreground capitalize">{task.status.replace('_', ' ').toLowerCase()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5 text-primary" />
              Task Description
            </h2>
            <div className="space-y-4">
              <p className="text-muted leading-relaxed whitespace-pre-wrap">
                {task.description || 'No detailed description provided for this task.'}
              </p>
              <div className="p-4 bg-secondary/30 rounded-lg border border-border/50 text-sm text-muted mt-6">
                (Mock details placeholder: A rich text editor or activity log will go here to track daily updates and subtasks.)
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
              <Briefcase className="w-5 h-5 text-primary" />
              Task Actions
            </h2>
            <div className="space-y-3">
              <button 
                onClick={() => handleStatusChange('DONE')}
                className="w-full py-2.5 bg-[#10b981]/10 text-[#10b981] font-medium rounded-lg hover:bg-[#10b981]/20 transition-colors border border-[#10b981]/20 flex justify-center items-center gap-2"
                disabled={task.status === 'DONE'}
              >
                <CheckCircle2 className="w-4 h-4" />
                {task.status === 'DONE' ? 'Completed' : 'Mark as Done'}
              </button>
              <button className="w-full py-2.5 bg-background text-foreground font-medium rounded-lg border border-border hover:bg-secondary transition-colors flex justify-center items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Report Blocker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
