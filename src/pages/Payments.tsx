import { useEffect, useState } from 'react';
import { getPayments, addPayment, updatePaymentStatus, getProjects } from '../api/services';
import { type Payment, type PaymentStatus, type PaymentType, type Project } from '../api/db';
import { Search, Plus, DollarSign, ArrowUpRight, ArrowDownRight, X, CheckCircle, AlertCircle } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';
import { DateInput } from '../components/ui/DateInput';

export function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [projectId, setProjectId] = useState('');
  const [type, setType] = useState<PaymentType>('ADVANCE');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [paymentsData, projectsData] = await Promise.all([getPayments(), getProjects()]);
    setPayments(paymentsData);
    setProjects(projectsData);
    setLoading(false);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find(p => p.id === projectId);
    
    await addPayment({
      projectId,
      projectName: project ? project.projectName : 'Unknown Project',
      customerName: project ? project.customerName : 'Unknown Customer',
      type,
      amount: parseInt(amount, 10) || 0,
      dueDate,
      status: 'PENDING'
    });
    
    setIsModalOpen(false);
    setProjectId('');
    setType('ADVANCE');
    setAmount('');
    setDueDate('');
    await loadData();
  };

  const handleStatusUpdate = async (id: string, status: PaymentStatus) => {
    await updatePaymentStatus(id, status);
    await loadData();
  };

  const filteredPayments = payments.filter(p => 
    p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCollected = payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'OVERDUE').reduce((sum, p) => sum + p.amount, 0);

  const getStatusStyle = (status: PaymentStatus) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'OVERDUE': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full relative pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Project Payments</h1>
          <p className="text-sm text-muted mt-1">Track customer advances and final collections per project</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Record Payment
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Total Collected</h3>
            <div className="p-2 bg-emerald-50 rounded-full">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">₹{totalCollected.toLocaleString()}</div>
          <p className="text-xs text-emerald-600 flex items-center">
            <ArrowUpRight className="w-3 h-3 mr-1" /> Collected project payments
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Pending Collection</h3>
            <div className="p-2 bg-amber-50 rounded-full">
              <DollarSign className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">₹{totalPending.toLocaleString()}</div>
          <p className="text-xs text-muted">
            {payments.filter(p => p.status === 'PENDING').length} pending collections
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Overdue</h3>
            <div className="p-2 bg-red-50 rounded-full">
              <DollarSign className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-foreground mb-1">₹{totalOverdue.toLocaleString()}</div>
          <p className="text-xs text-red-600 flex items-center">
            <ArrowDownRight className="w-3 h-3 mr-1" /> Requires immediate action
          </p>
        </div>
      </div>

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input 
          type="text"
          placeholder="Search project or customer..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-foreground"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Loading payments...</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-foreground text-sm border-b border-border">
                  <th className="p-4 font-semibold">Project & Customer</th>
                  <th className="p-4 font-semibold text-center">Type</th>
                  <th className="p-4 font-semibold text-right">Amount</th>
                  <th className="p-4 font-semibold text-center">Due Date</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-foreground">{payment.projectName}</div>
                      <div className="text-xs text-muted">{payment.customerName}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-xs font-semibold text-muted bg-secondary px-2 py-0.5 rounded-full border border-border">
                        {payment.type}
                      </span>
                    </td>
                    <td className="p-4 text-right font-semibold text-foreground">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-center text-muted">
                      {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block w-max mx-auto ${getStatusStyle(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {payment.status !== 'COMPLETED' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusUpdate(payment.id, 'COMPLETED')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Mark as Paid"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          {payment.status !== 'OVERDUE' && (
                            <button 
                              onClick={() => handleStatusUpdate(payment.id, 'OVERDUE')}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Mark as Overdue"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted">No payments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Record Payment</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-visible">
                <form id="add-payment-form" onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Project</label>
                  <SelectInput 
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.projectName} ({p.customerName})</option>
                    ))}
                  </SelectInput>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Type</label>
                    <SelectInput 
                      value={type}
                      onChange={e => setType(e.target.value as PaymentType)}
                    >
                      <option value="ADVANCE">Advance</option>
                      <option value="FINAL">Final</option>
                    </SelectInput>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Amount (₹)</label>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Due Date</label>
                  <DateInput 
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
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
                form="add-payment-form"
                className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                Record Payment
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
