import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, updateCustomerDetails, getPublicServices, getProjects } from '../api/services';
import { type Customer, type PublicService, type Project } from '../api/db';
import { ArrowLeft, Save, Phone, MessageCircle } from 'lucide-react';
import { DateInput } from '../components/ui/DateInput';
import { SelectInput } from '../components/ui/SelectInput';

export function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [category, setCategory] = useState('');
  const [measurements, setMeasurements] = useState('');
  const [measurementDate, setMeasurementDate] = useState('');
  const [fabricDetails, setFabricDetails] = useState('');
  const [productionTimeline, setProductionTimeline] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

  useEffect(() => {
    getPublicServices().then(setServices);
    
    if (id) {
      getCustomerById(id).then(async data => {
        if (data) {
          setCustomer(data);
          setCategory(data.category || '');
          setMeasurements(data.measurements || '');
          setMeasurementDate(data.measurementDate || '');
          setFabricDetails(data.fabricDetails || '');
          setProductionTimeline(data.productionTimeline || '');
          setDeliveryDate(data.deliveryDate || '');
          
          // Fetch related projects
          const allProjects = await getProjects();
          setRelatedProjects(allProjects.filter(p => p.customerName === data.name));
        }
        setLoading(false);
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!id || !customer) return;
    setSaving(true);
    const updated = await updateCustomerDetails(id, {
      category,
      measurements,
      measurementDate,
      fabricDetails,
      productionTimeline,
      deliveryDate
    });
    if (updated) setCustomer(updated);
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-muted">Loading...</div>;
  if (!customer) return <div className="p-8 text-terracotta">Customer not found</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/customers')}
            className="p-2 hover:bg-background rounded-full transition-colors text-muted hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-semibold text-primary">{customer.name}</h1>
        </div>
        <div className="flex gap-2">
          <a 
            href={`tel:${customer.phone}`} 
            className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium hover:text-primary transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4" /> Call
          </a>
          <a 
            href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`} 
            target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium hover:text-[#25D366] transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Quick Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4 h-fit">
          <h3 className="font-semibold text-foreground border-b border-border pb-2">Basic Info</h3>
          <div>
            <div className="text-sm text-muted">Status</div>
            <div className="font-medium inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground mt-1">
              {customer.status}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted">Service Required</div>
            <div className="font-medium text-foreground">{customer.service}</div>
          </div>
          <div>
            <div className="text-sm text-muted">Phone</div>
            <div className="font-medium text-foreground">{customer.phone}</div>
          </div>
          <div>
            <div className="text-sm text-muted">Address</div>
            <div className="font-medium text-foreground whitespace-pre-wrap">{customer.address || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-muted">Date Added</div>
            <div className="font-medium text-foreground">{customer.dateAdded}</div>
          </div>
        </div>

        {/* Detailed Tracking Info */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-semibold text-foreground">Detailed Project Info</h3>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Details'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Interior Category</label>
              <SelectInput 
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">Select Category...</option>
                {services.map(service => (
                  <option key={service.id} value={service.title}>{service.title}</option>
                ))}
              </SelectInput>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Target Measurement Date</label>
              <DateInput 
                value={measurementDate}
                onChange={e => setMeasurementDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Target Delivery Date</label>
              <DateInput 
                value={deliveryDate}
                onChange={e => setDeliveryDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Measurements</label>
            <textarea 
              value={measurements}
              onChange={e => setMeasurements(e.target.value)}
              placeholder="Enter exact measurements and dimensions..."
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-y h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Fabric & Material Selection</label>
            <textarea 
              value={fabricDetails}
              onChange={e => setFabricDetails(e.target.value)}
              placeholder="e.g. Velvet Blue (Code: V-102), Matte Finish Wood..."
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-y h-24"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-1">Production Timeline & Updates</label>
            <textarea 
              value={productionTimeline}
              onChange={e => setProductionTimeline(e.target.value)}
              placeholder="e.g. Sept 12: Wood cutting started. Sept 15: Expected polish."
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-y h-24"
            />
          </div>
        </div>
        {/* Related Projects */}
        <div className="md:col-span-3 bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-foreground border-b border-border pb-2 mb-4">Related Projects</h3>
          {relatedProjects.length === 0 ? (
            <p className="text-sm text-muted">No projects found for this customer.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedProjects.map(project => (
                <div 
                  key={project.id} 
                  onClick={() => navigate('/admin/projects')}
                  className="p-4 border border-border rounded-lg bg-secondary/20 hover:bg-secondary/40 cursor-pointer transition-colors"
                >
                  <h4 className="font-semibold text-primary">{project.projectName}</h4>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-muted">{project.category}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {project.status}
                    </span>
                  </div>
                  <div className="mt-3 w-full bg-border rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
