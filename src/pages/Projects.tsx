import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { getProjects, updateProjectStatus, addProject, getPublicServices, getCustomers } from '../api/services';
import { type Project, type ProjectStatus, type PublicService, type Customer } from '../api/db';
import { LayoutList, KanbanSquare, Plus, X, IndianRupee } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';

const STATUSES: ProjectStatus[] = ['Enquiry', 'Measurement', 'Estimate', 'Production', 'Installation'];

export function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [projectName, setProjectName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState<number | ''>('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const [data, servicesData, customersData] = await Promise.all([getProjects(), getPublicServices(), getCustomers()]);
    setProjects(data);
    setServices(servicesData);
    setCustomers(customersData);
    setLoading(false);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId as ProjectStatus;
    
    // Optimistic update
    setProjects(prev => 
      prev.map(p => p.id === draggableId ? { 
        ...p, 
        status: newStatus,
        progress: newStatus === 'Installation' ? 100 : p.progress 
      } : p)
    );

    // Actual API call
    await updateProjectStatus(draggableId, newStatus);
  };

  const handleStatusChange = async (id: string, newStatus: ProjectStatus) => {
    // Optimistic update
    setProjects(prev => 
      prev.map(p => p.id === id ? { 
        ...p, 
        status: newStatus,
        progress: newStatus === 'Installation' ? 100 : p.progress
      } : p)
    );
    // Actual API call
    await updateProjectStatus(id, newStatus);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) { alert('Please select a customer.'); return; }
    if (!category) { alert('Please select a category.'); return; }
    if (!projectName) return;
    await addProject({
      projectName,
      customerName,
      category,
      budget: Number(budget),
      status: 'Enquiry',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    });
    
    setIsModalOpen(false);
    setProjectName('');
    setCustomerName('');
    setCategory('');
    setBudget('');
    await loadProjects();
  };

  const ProjectCard = ({ project }: { project: Project }) => (
    <div 
      onClick={() => navigate(`/admin/projects/${project.id}`)}
      className="bg-card border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-3 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-medium text-foreground">{project.projectName}</h4>
      </div>
      <p className="text-sm text-muted mb-2">{project.category}</p>
      
      <div className="flex items-center gap-1.5 text-xs text-muted mb-3 font-medium">
        <span className="bg-secondary/50 px-2 py-0.5 rounded-sm">{project.customerName}</span>
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border">
        <span className="text-xs font-semibold text-foreground flex items-center">
          <IndianRupee className="w-3 h-3 mr-0.5" />
          {project.budget.toLocaleString()}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-semibold text-primary">Projects Management</h1>
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Project
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
        <div className="text-center py-10 text-muted">Loading projects...</div>
      ) : view === 'kanban' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex overflow-x-auto xl:grid xl:grid-cols-4 gap-6 pb-4 flex-1 items-start h-[calc(100vh-200px)] snap-x">
            {STATUSES.map(status => (
              <div key={status} className="bg-secondary/30 rounded-xl p-4 flex flex-col max-h-full border border-border/50 min-w-[280px] w-[85vw] xl:w-auto snap-center shrink-0">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="font-semibold text-foreground">{status}</h3>
                  <span className="bg-background text-muted text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    {projects.filter(p => p.status === status).length}
                  </span>
                </div>
                
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto transition-colors rounded-lg p-1 ${snapshot.isDraggingOver ? 'bg-secondary/50' : ''}`}
                    >
                      {projects.filter(p => p.status === status).map((project, index) => (
                        <Draggable key={project.id} draggableId={project.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}
                              className={snapshot.isDragging ? 'opacity-80' : ''}
                            >
                              <ProjectCard project={project} />
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
        <div className="bg-card rounded-xl border border-border overflow-visible shadow-sm">
          <div className="overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-foreground text-sm border-b border-border">
                  <th className="p-4 font-semibold">Project Name</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Budget</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {projects.map(project => (
                  <tr key={project.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{project.projectName}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-muted font-medium">{project.customerName}</div>
                    </td>
                    <td className="p-4 text-muted">{project.category}</td>
                    <td className="p-4 text-foreground font-semibold flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                      {project.budget.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <SelectInput 
                        value={project.status}
                        onChange={(e) => handleStatusChange(project.id, e.target.value as ProjectStatus)}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
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

      {/* Add Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">New Project</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-visible">
                <form id="add-project-form" onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Project Name</label>
                  <input 
                    required
                    type="text" 
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    placeholder="e.g. Skyline Penthouse"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Customer</label>
                  <SelectInput 
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                  >
                    <option value="" disabled>Select a customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </SelectInput>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Category</label>
                  <SelectInput 
                    required
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="">Select category...</option>
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </SelectInput>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Budget (₹)</label>
                  <input 
                    required
                    type="number"
                    min="0"
                    step="1000"
                    value={budget}
                    onChange={e => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    placeholder="0"
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
                form="add-project-form"
                className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
