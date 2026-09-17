import { useEffect, useState } from 'react';
import { getQuotations, addQuotation, updateQuotationStatus, updateQuotation, getProjects } from '../api/services';
import { type Quotation, type QuotationStatus, type LineItem, type Project } from '../api/db';
import { FileText, Plus, Trash2, Download, FileEdit, IndianRupee, ArrowLeft } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';

export function Quotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  // Builder State
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', item: '', description: '', qty: 1, rate: 0 },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [quotesData, projectsData] = await Promise.all([getQuotations(), getProjects()]);
    setQuotations(quotesData);
    setProjects(projectsData);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: QuotationStatus) => {
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    await updateQuotationStatus(id, newStatus);
  };

  // Builder Logic
  const subtotal = items.reduce((acc, item) => acc + item.qty * item.rate, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleCreateNew = () => {
    setEditingQuoteId(null);
    setSelectedProjectId('');
    setItems([{ id: '1', item: '', description: '', qty: 1, rate: 0 }]);
    setView('builder');
  };

  const handleEdit = (quote: Quotation) => {
    setEditingQuoteId(quote.id);
    setSelectedProjectId(quote.projectId);
    setItems(quote.items);
    setView('builder');
  };

  const handleSave = async () => {
    if (!selectedProjectId) {
      alert("Please select a project");
      return;
    }

    const project = projects.find(p => p.id === selectedProjectId);
    if (!project) return;

    if (editingQuoteId) {
      await updateQuotation(editingQuoteId, { items, subtotal, tax, total, projectId: project.id, projectName: project.projectName, customerName: project.customerName });
    } else {
      await addQuotation({
        projectId: project.id,
        projectName: project.projectName,
        customerName: project.customerName,
        date: new Date().toISOString().split('T')[0],
        status: 'DRAFT',
        items,
        subtotal,
        tax,
        total
      });
    }

    setView('list');
    await loadData();
  };

  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  const addItem = () => setItems([...items, { id: Date.now().toString(), item: '', description: '', qty: 1, rate: 0 }]);
  const removeItem = (id: string) => setItems(items.filter(item => item.id !== id));

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          {view === 'builder' && (
            <button onClick={() => setView('list')} className="p-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-primary">{view === 'builder' ? (editingQuoteId ? 'Edit Quotation' : 'New Quotation') : 'Quotations'}</h1>
            <p className="text-sm text-muted mt-1">{view === 'builder' ? 'Build and price out interior requirements' : 'Manage pricing and proposals'}</p>
          </div>
        </div>
        
        {view === 'list' && (
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Quotation
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Loading quotations...</div>
      ) : view === 'list' ? (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-foreground text-sm border-b border-border">
                  <th className="p-4 font-semibold">Project</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {quotations.map(quote => (
                  <tr key={quote.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted" />
                        {quote.projectName}
                      </div>
                    </td>
                    <td className="p-4 text-muted font-medium">{quote.customerName}</td>
                    <td className="p-4 text-muted">{quote.date}</td>
                    <td className="p-4 text-foreground font-semibold flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                      {quote.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <SelectInput 
                        value={quote.status}
                        onChange={(e) => handleStatusChange(quote.id, e.target.value as QuotationStatus)}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="SENT">Sent</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                      </SelectInput>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(quote)}
                          className="p-2 text-muted hover:text-primary bg-background border border-border rounded-lg transition-colors"
                          title="Edit Quotation"
                        >
                          <FileEdit className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-muted hover:text-[#10b981] bg-background border border-border rounded-lg transition-colors"
                          title="Download PDF"
                          onClick={() => alert('PDF generation is mocked.')}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Line Items</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-muted px-2">
                  <div className="col-span-4">Item & Description</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-3 text-right">Rate (₹)</div>
                  <div className="col-span-2 text-right">Amount (₹)</div>
                  <div className="col-span-1"></div>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-start bg-background p-3 rounded-xl border border-border">
                    <div className="col-span-4 space-y-2">
                      <input 
                        type="text" 
                        value={item.item}
                        onChange={(e) => updateItem(item.id, 'item', e.target.value)}
                        placeholder="Item name"
                        className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                      <input 
                        type="text" 
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Description..."
                        className="w-full px-3 py-2 bg-card border border-border rounded-md text-xs text-muted focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <input 
                        type="number" 
                        min="1"
                        value={item.qty}
                        onChange={(e) => updateItem(item.id, 'qty', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm text-center focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <div className="col-span-3">
                      <input 
                        type="number" 
                        min="0"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-card border border-border rounded-md text-sm text-right focus:ring-2 focus:ring-primary/20 outline-none"
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end h-9 font-medium text-foreground">
                      {(item.qty * item.rate).toLocaleString()}
                    </div>
                    <div className="col-span-1 flex items-center justify-center h-9">
                      <button 
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="text-muted hover:text-red-500 disabled:opacity-30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={addItem}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-secondary/50 text-foreground rounded-lg hover:bg-secondary transition-colors text-sm font-medium border border-border"
              >
                <Plus className="w-4 h-4" /> Add Line Item
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Select Project</label>
                  <SelectInput value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                    <option value="">Select...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.projectName}</option>
                    ))}
                  </SelectInput>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground flex items-center">
                    <IndianRupee className="w-3 h-3 mr-0.5" />{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Tax (18% GST)</span>
                  <span className="font-medium text-foreground flex items-center">
                    <IndianRupee className="w-3 h-3 mr-0.5" />{tax.toLocaleString()}
                  </span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between font-semibold text-lg text-primary">
                  <span>Total</span>
                  <span className="flex items-center">
                    <IndianRupee className="w-4 h-4 mr-0.5" />{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={!selectedProjectId}
                className="w-full mt-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                Save Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
