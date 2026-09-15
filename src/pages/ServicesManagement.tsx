import { useEffect, useState } from 'react';
import { getPublicServices, addPublicService, deletePublicService } from '../api/services';
import { type PublicService } from '../api/db';
import { Plus, Trash2 } from 'lucide-react';

export function ServicesManagement() {
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    const data = await getPublicServices();
    setServices(data);
    setLoading(false);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) return;
    
    await addPublicService({ title, description, image });
    setTitle('');
    setDescription('');
    setImage('');
    await loadServices();
  };

  const handleDelete = async (id: string) => {
    await deletePublicService(id);
    await loadServices();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-primary">Services Management</h1>
      </div>
      <p className="text-muted">Manage the interior categories and services shown on the public landing page.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Add New Service</h2>
          <form onSubmit={handleAddService} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Category / Title</label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                placeholder="e.g. Wall Paneling"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Description</label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-none h-20"
                placeholder="Brief description of the service"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Image URL</label>
              <input 
                type="url" 
                value={image}
                onChange={e => setImage(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                placeholder="https://images.unsplash.com/..."
                required
              />
              {image && (
                <div className="mt-2 h-24 rounded overflow-hidden border border-border">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground flex items-center justify-center gap-2 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Service
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border text-sm text-muted">
                  <th className="p-4 font-medium w-24">Image</th>
                  <th className="p-4 font-medium">Title & Description</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-muted">Loading...</td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-muted">No services added yet.</td>
                  </tr>
                ) : services.map((service) => (
                  <tr key={service.id} className="border-b border-border last:border-0 text-sm">
                    <td className="p-4">
                      <div className="w-16 h-12 rounded overflow-hidden border border-border">
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{service.title}</div>
                      <div className="text-muted text-xs mt-1 line-clamp-2">{service.description}</div>
                    </td>
                    <td className="p-4 text-right align-middle">
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-muted hover:text-terracotta transition-colors rounded-md hover:bg-terracotta/10 inline-flex"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
