import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { getCustomers, updateCustomerStatus, addCustomer, getPublicServices } from '../api/services';
import { type Customer, type CustomerStatus, type PublicService } from '../api/db';
import { Phone, MessageCircle, LayoutList, KanbanSquare, Plus, X } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';

const STATUSES: CustomerStatus[] = ['Enquiry', 'Measurement', 'Estimate', 'Production', 'Installation'];

export function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [service, setService] = useState('');

  useEffect(() => {
    loadCustomers();
    getPublicServices().then(setServices);
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const data = await getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId as CustomerStatus;
    
    // Optimistic update
    setCustomers(prev => 
      prev.map(c => c.id === draggableId ? { ...c, status: newStatus } : c)
    );

    // Actual API call
    await updateCustomerStatus(draggableId, newStatus);
  };

  const handleStatusChange = async (id: string, newStatus: CustomerStatus) => {
    // Optimistic update
    setCustomers(prev => 
      prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
    );
    // Actual API call
    await updateCustomerStatus(id, newStatus);
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !service) return;

    await addCustomer({
      name,
      phone,
      address,
      service,
      status: 'Enquiry',
      notes: ''
    });
    
    setIsModalOpen(false);
    setName('');
    setPhone('');
    setAddress('');
    setService('');
    await loadCustomers();
  };

  const CustomerCard = ({ customer }: { customer: Customer }) => (
    <div 
      onClick={() => navigate(`/admin/customers/${customer.id}`)}
      className="bg-card border border-border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-3 cursor-pointer"
    >
      <h4 className="font-medium text-foreground mb-1">{customer.name}</h4>
      <p className="text-sm text-muted mb-3">{customer.service}</p>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
        <span className="text-xs text-muted font-medium">{customer.dateAdded}</span>
        <div className="flex gap-2">
          <a 
            href={`tel:${customer.phone}`} 
            className="p-1.5 text-stone hover:text-primary bg-background rounded-md border border-border"
            title="Call Customer"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
          <a 
            href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`} 
            target="_blank" 
            rel="noreferrer"
            className="p-1.5 text-stone hover:text-[#25D366] bg-background rounded-md border border-border"
            title="WhatsApp Customer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Customers Pipeline</h1>
          <p className="text-sm text-muted mt-1">Track leads from enquiry to installation</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Customer
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
        <div className="text-center py-10 text-muted">Loading customers...</div>
      ) : view === 'kanban' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex overflow-x-auto xl:grid xl:grid-cols-4 gap-6 pb-4 flex-1 items-start h-[calc(100vh-200px)] snap-x">
            {STATUSES.map(status => (
              <div key={status} className="bg-secondary/30 rounded-xl p-4 flex flex-col max-h-full border border-border/50 min-w-[280px] w-[85vw] xl:w-auto snap-center shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">{status}</h3>
                  <span className="bg-background border border-border text-muted text-xs font-bold px-2 py-0.5 rounded-full">
                    {customers.filter(c => c.status === status).length}
                  </span>
                </div>
                
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`flex-1 rounded-xl p-3 min-h-[300px] border transition-colors ${
                        snapshot.isDraggingOver ? 'bg-secondary/20 border-secondary' : 'bg-background/50 border-border/50'
                      }`}
                    >
                      {customers.filter(c => c.status === status).map((customer, index) => (
                        <Draggable key={customer.id} draggableId={customer.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{ ...provided.draggableProps.style }}
                              className={`${snapshot.isDragging ? 'rotate-2 scale-105' : ''} transition-transform`}
                            >
                              <CustomerCard customer={customer} />
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
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-visible">
          <div className="overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border text-sm text-muted">
                  <th className="p-4 font-medium">Customer Name</th>
                  <th className="p-4 font-medium">Service</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date Added</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    onClick={(e) => {
                      if ((e.target as HTMLElement).tagName !== 'SELECT' && (e.target as HTMLElement).tagName !== 'A' && !(e.target as HTMLElement).closest('a')) {
                        navigate(`/admin/customers/${customer.id}`);
                      }
                    }}
                    className="border-b border-border last:border-0 text-sm hover:bg-secondary/5 cursor-pointer transition-colors"
                  >
                    <td className="p-4 font-medium text-foreground">
                      {customer.name}
                      <div className="text-xs text-muted mt-1">{customer.phone}</div>
                    </td>
                    <td className="p-4 text-muted">{customer.service}</td>
                    <td className="p-4">
                      <SelectInput 
                        value={customer.status}
                        onChange={(e) => handleStatusChange(customer.id, e.target.value as CustomerStatus)}
                      >
                        {STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </SelectInput>
                    </td>
                    <td className="p-4 text-muted">{customer.dateAdded}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <a 
                          href={`tel:${customer.phone}`} 
                          className="p-2 text-stone hover:text-primary transition-colors rounded-md hover:bg-background border border-transparent hover:border-border inline-flex"
                          title="Call Customer"
                        >
                          <Phone className="w-4 h-4" />
                        </a>
                        <a 
                          href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 text-stone hover:text-[#25D366] transition-colors rounded-md hover:bg-background border border-transparent hover:border-border inline-flex"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl max-w-md w-full p-6 shadow-xl relative border border-border">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-background text-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-foreground mb-6">Add New Customer</h2>
            
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  placeholder="e.g. +91 9876543210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Service Required</label>
                <SelectInput 
                  required
                  value={service}
                  onChange={e => setService(e.target.value)}
                >
                  <option value="">Select a service...</option>
                  {services.map(s => (
                    <option key={s.id} value={s.title}>{s.title}</option>
                  ))}
                </SelectInput>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Address (Optional)</label>
                <textarea 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-none h-20"
                  placeholder="Installation address"
                />
              </div>
              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
