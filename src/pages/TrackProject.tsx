import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById, getQuotations, updateQuotationStatus } from '../api/services';
import { type Project, type Quotation } from '../api/db';
import { Circle, Check, IndianRupee } from 'lucide-react';

const STAGES = ['Enquiry', 'Measurement', 'Estimate', 'Production', 'Installation'];

export function TrackProject() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const p = await getProjectById(id);
      if (!p) {
        setError("Project not found");
        return;
      }
      setProject(p);
      const quotes = await getQuotations();
      setQuotations(quotes.filter(q => q.projectId === id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveQuote = async (quoteId: string) => {
    await updateQuotationStatus(quoteId, 'APPROVED');
    await loadData(); // refresh
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-muted">Loading your project...</div>;
  }

  if (error || !project) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-medium">{error || "Project not found"}</div>;
  }

  const currentStageIndex = STAGES.indexOf(project.status);

  return (
    <div className="min-h-screen bg-secondary/20 p-4 md:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border text-center">
          <h1 className="text-2xl font-bold text-primary mb-2">Project Tracker</h1>
          <p className="text-muted">Welcome, {project.customerName}</p>
          <div className="mt-4 inline-block px-4 py-2 bg-secondary rounded-lg border border-border">
            <span className="text-sm font-medium text-foreground">{project.projectName}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border">
          <h2 className="text-lg font-bold text-foreground mb-6">Progress Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
            <div className="space-y-6 relative">
              {STAGES.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;
                
                return (
                  <div key={stage} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shrink-0 border-2 
                      ${isCompleted ? 'bg-[#10b981] border-[#10b981] text-white' : 
                        isCurrent ? 'bg-background border-primary text-primary' : 
                        'bg-background border-border text-border'}`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : 
                       isCurrent ? <Circle className="w-4 h-4 fill-primary" /> : 
                       <Circle className="w-4 h-4" />}
                    </div>
                    <div className={`flex-1 ${isCompleted || isCurrent ? 'text-foreground font-medium' : 'text-muted'}`}>
                      {stage}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quotations */}
        {quotations.length > 0 && (
          <div className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border">
            <h2 className="text-lg font-bold text-foreground mb-6">Your Quotations</h2>
            <div className="space-y-4">
              {quotations.map(quote => (
                <div key={quote.id} className="border border-border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="font-mono text-xs text-muted mb-1">{quote.id}</div>
                    <div className="font-medium text-foreground">Estimate for {project.projectName}</div>
                    <div className="flex items-center text-sm font-bold text-primary mt-1">
                      <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                      {quote.total.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase
                      ${quote.status === 'APPROVED' ? 'bg-[#10b981]/10 text-[#10b981]' :
                        quote.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                        'bg-amber-500/10 text-amber-600'}`}>
                      {quote.status}
                    </span>
                    
                    {quote.status === 'SENT' && (
                      <div className="flex gap-2 mt-2 w-full justify-end">
                        <button 
                          onClick={() => handleApproveQuote(quote.id)}
                          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Approve Quote
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
