import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectById, updateProjectStatus, getQuotations, getOrders, getProductionJobs, getInstallations } from '../api/services';
import { type Project, type ProjectStatus, type Quotation, type Order, type ProductionJob, type Installation } from '../api/db';
import { ArrowLeft, Calendar, IndianRupee, Activity, FolderKanban, Briefcase, FileText, CheckCircle2, CircleDashed } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';

const STATUSES: ProjectStatus[] = ['Planning', 'Execution', 'Review', 'Completed'];

export function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productionJobs, setProductionJobs] = useState<ProductionJob[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject(id);
    }
  }, [id]);

  const loadProject = async (projectId: string) => {
    setLoading(true);
    const [
      data, 
      allQuotes, 
      allOrders, 
      allJobs, 
      allInstalls
    ] = await Promise.all([
      getProjectById(projectId),
      getQuotations(),
      getOrders(),
      getProductionJobs(),
      getInstallations()
    ]);
    
    setProject(data || null);
    if (data) {
      setQuotations(allQuotes.filter(q => q.projectId === data.id));
      setOrders(allOrders.filter(o => o.projectId === data.id));
      setProductionJobs(allJobs.filter(j => j.projectId === data.id));
      setInstallations(allInstalls.filter(i => i.projectId === data.id));
    }
    setLoading(false);
  };

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (!project) return;
    setProject({ ...project, status: newStatus, progress: newStatus === 'Completed' ? 100 : project.progress });
    await updateProjectStatus(project.id, newStatus);
  };

  if (loading) {
    return <div className="text-center py-10 text-muted">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-primary mb-2">Project Not Found</h2>
        <button onClick={() => navigate('/admin/projects')} className="text-accent hover:underline">
          Return to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/projects')}
            className="p-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-primary flex items-center gap-3">
              {project.projectName}
            </h1>
            <p className="text-muted mt-1 text-sm">Customer: <span className="font-medium text-foreground">{project.customerName}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted">Current Status:</span>
          <SelectInput 
            value={project.status}
            onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
          >
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </SelectInput>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Core Info Cards */}
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <FolderKanban className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted mb-0.5">Category</p>
            <p className="font-semibold text-foreground">{project.category}</p>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <IndianRupee className="w-6 h-6 text-accent" />
          </div>
          <div>
            <p className="text-sm text-muted mb-0.5">Total Budget</p>
            <p className="font-semibold text-foreground flex items-center">
              <IndianRupee className="w-4 h-4 mr-0.5" />
              {project.budget.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-[#10b981]" />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-muted">Progress</p>
              <span className="text-sm font-bold text-[#10b981]">{project.progress}%</span>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-1.5 mt-1">
              <div 
                className="bg-[#10b981] h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-[#8b5cf6]" />
          </div>
          <div>
            <p className="text-sm text-muted mb-0.5">Timeline</p>
            <p className="font-semibold text-foreground text-sm">{project.startDate} to {project.endDate}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary" />
              Complete Project Pipeline
            </h2>
            
            <div className="space-y-4">
              {/* Quotations */}
              <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider text-muted">1. Quotations ({quotations.length})</h3>
                {quotations.length === 0 ? <p className="text-sm text-muted">No quotations generated yet.</p> : (
                  <div className="space-y-2">
                    {quotations.map(q => (
                      <div key={q.id} className="flex justify-between items-center bg-background p-3 rounded-lg border border-border shadow-sm">
                        <span className="font-medium text-sm text-foreground">Total: ₹ {q.total.toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${q.status === 'APPROVED' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-secondary text-muted'}`}>{q.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase Orders */}
              <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider text-muted">2. Purchase Orders ({orders.length})</h3>
                {orders.length === 0 ? <p className="text-sm text-muted">No orders placed yet.</p> : (
                  <div className="space-y-2">
                    {orders.map(o => (
                      <div key={o.id} className="flex justify-between items-center bg-background p-3 rounded-lg border border-border shadow-sm">
                        <span className="font-medium text-sm text-foreground">{o.poNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${o.status === 'READY' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-blue-500/10 text-blue-600'}`}>{o.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Production */}
              <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider text-muted">3. Production ({productionJobs.length})</h3>
                {productionJobs.length === 0 ? <p className="text-sm text-muted">Not pushed to production yet.</p> : (
                  <div className="space-y-2">
                    {productionJobs.map(j => (
                      <div key={j.id} className="flex justify-between items-center bg-background p-3 rounded-lg border border-border shadow-sm">
                        <span className="font-medium text-sm text-foreground">Factory Ticket</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${j.stage === 'READY' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-amber-500/10 text-amber-600'}`}>{j.stage}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Installations */}
              <div className="p-4 bg-secondary/30 rounded-xl border border-border/50">
                <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wider text-muted">4. Installation ({installations.length})</h3>
                {installations.length === 0 ? <p className="text-sm text-muted">No installation scheduled yet.</p> : (
                  <div className="space-y-2">
                    {installations.map(i => (
                      <div key={i.id} className="flex justify-between items-center bg-background p-3 rounded-lg border border-border shadow-sm">
                        <span className="font-medium text-sm text-foreground">Date: {i.scheduledDate}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${i.status === 'COMPLETED' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-purple-500/10 text-purple-600'}`}>{i.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
              <Briefcase className="w-5 h-5 text-primary" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin/quotations')}
                className="w-full py-2.5 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary/20 transition-colors border border-primary/20"
              >
                View Quotation
              </button>
              <button 
                onClick={() => navigate('/admin/payments')}
                className="w-full py-2.5 bg-background text-foreground font-medium rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                Generate Invoice
              </button>
              <button 
                onClick={() => navigate('/admin/calendar')}
                className="w-full py-2.5 bg-background text-foreground font-medium rounded-lg border border-border hover:bg-secondary transition-colors"
              >
                Log Site Visit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
