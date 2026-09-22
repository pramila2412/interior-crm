import { useEffect, useState } from 'react';
import { getInstallations, addInstallation, updateInstallationStatus, getProjects } from '../api/services';
import { type Installation, type InstallationStatus, type Project } from '../api/db';
import { Calendar as CalendarIcon, MapPin, X } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';

export function Installations() {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [instData, projData] = await Promise.all([getInstallations(), getProjects()]);
    setInstallations(instData);
    setProjects(projData);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: InstallationStatus) => {
    setInstallations(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
    await updateInstallationStatus(id, newStatus);
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    await addInstallation({
      projectId: project.id,
      projectName: project.projectName,
      customerName: project.customerName,
      assigneeName,
      scheduledDate,
      status: 'SCHEDULED'
    });

    setIsModalOpen(false);
    setSelectedProjectId('');
    setAssigneeName('');
    setScheduledDate('');
    await loadData();
  };

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Installations</h1>
          <p className="text-sm text-muted mt-1">Schedule and track on-site delivery and fittings</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
        >
          <CalendarIcon className="w-4 h-4" />
          Schedule
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Loading installations...</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-foreground text-sm border-b border-border">
                  <th className="p-4 font-semibold">Project & Customer</th>
                  <th className="p-4 font-semibold">Assignee</th>
                  <th className="p-4 font-semibold">Date & Time</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {installations.map(inst => (
                  <tr key={inst.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{inst.projectName}</div>
                      <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {inst.customerName}
                      </div>
                    </td>
                    <td className="p-4">
                      {inst.assigneeName ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                            {inst.assigneeName.charAt(0)}
                          </div>
                          <span className="text-muted font-medium">{inst.assigneeName}</span>
                        </div>
                      ) : <span className="text-muted">-</span>}
                    </td>
                    <td className="p-4 text-muted font-medium flex items-center gap-2 mt-2">
                      <CalendarIcon className="w-4 h-4 text-primary/70" />
                      {new Date(inst.scheduledDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="p-4">
                      <SelectInput 
                        value={inst.status}
                        onChange={(e) => handleStatusChange(inst.id, e.target.value as InstallationStatus)}
                      >
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </SelectInput>
                    </td>
                  </tr>
                ))}
                {installations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted">No installations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Schedule Installation</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-visible">
                <form id="schedule-form" onSubmit={handleSchedule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Select Project</label>
                  <SelectInput 
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    required
                  >
                    <option value="">Choose a project...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.projectName}</option>
                    ))}
                  </SelectInput>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Assign Installer Name</label>
                  <input 
                    type="text" 
                    value={assigneeName}
                    onChange={e => setAssigneeName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    placeholder="e.g. John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Date & Time</label>
                  <input 
                    type="datetime-local" 
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    required
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
                form="schedule-form"
                className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                disabled={!selectedProjectId}
              >
                Schedule Installation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
