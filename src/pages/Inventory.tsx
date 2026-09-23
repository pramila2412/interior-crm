import { useEffect, useState } from 'react';
import { getInventory, addInventoryItem } from '../api/services';
import { type InventoryItem, type InventoryCategory } from '../api/db';
import { Search, Plus, X, Package, AlertTriangle } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';

export function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('FABRIC');
  const [stock, setStock] = useState('0');
  const [minStock, setMinStock] = useState('0');
  const [unit, setUnit] = useState('meters');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getInventory();
    setInventory(data);
    setLoading(false);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await addInventoryItem({
      sku,
      name,
      category,
      stock: parseInt(stock, 10) || 0,
      minStock: parseInt(minStock, 10) || 0,
      unit
    });
    
    setIsModalOpen(false);
    setSku('');
    setName('');
    setCategory('FABRIC');
    setStock('0');
    setMinStock('0');
    setUnit('meters');
    await loadData();
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatus = (item: InventoryItem) => {
    if (item.stock <= 0) return { label: 'Out of Stock', color: 'text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20' };
    if (item.stock <= item.minStock) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'In Stock', color: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20' };
  };

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Inventory</h1>
          <p className="text-sm text-muted mt-1">Manage stock levels for fabrics, hardware, and accessories</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input 
              type="text"
              placeholder="Search SKU or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm text-foreground"
            />
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Loading inventory...</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-foreground text-sm border-b border-border">
                  <th className="p-4 font-semibold w-32">SKU</th>
                  <th className="p-4 font-semibold">Item Name</th>
                  <th className="p-4 font-semibold text-center">Category</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Stock Level</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredInventory.map(item => {
                  const status = getStatus(item);
                  return (
                    <tr key={item.id} className="border-b border-border hover:bg-secondary/20 transition-colors">
                      <td className="p-4 font-mono text-xs text-muted font-medium">{item.sku}</td>
                      <td className="p-4 font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-muted" />
                          {item.name}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-xs font-semibold text-muted bg-secondary px-2 py-0.5 rounded-full border border-border">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center justify-center gap-1 w-max mx-auto ${status.color}`}>
                          {item.stock <= item.minStock && <AlertTriangle className="w-3 h-3" />}
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-semibold text-foreground text-base">{item.stock}</span>
                        <span className="text-muted ml-1 text-xs">{item.unit}</span>
                      </td>
                    </tr>
                  );
                })}
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted">No items found matching your search.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 p-4 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center py-8">
            <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-border">
                <h2 className="text-xl font-bold text-foreground">Add New Inventory Item</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted hover:text-foreground transition-colors p-1 rounded-md hover:bg-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-visible">
                <form id="add-item-form" onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">SKU</label>
                    <input 
                      type="text" 
                      value={sku}
                      onChange={e => setSku(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground uppercase"
                      placeholder="e.g. SKU-123"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Category</label>
                    <SelectInput 
                      value={category}
                      onChange={e => setCategory(e.target.value as InventoryCategory)}
                    >
                      <option value="FABRIC">Fabric</option>
                      <option value="HARDWARE">Hardware</option>
                      <option value="ACCESSORY">Accessory</option>
                    </SelectInput>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">Item Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                    placeholder="e.g. Premium Velvet"
                    required
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Initial Stock</label>
                    <input 
                      type="number" 
                      value={stock}
                      onChange={e => setStock(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Min Alert</label>
                    <input 
                      type="number" 
                      value={minStock}
                      onChange={e => setMinStock(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      required
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1">Unit</label>
                    <input 
                      type="text" 
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                      placeholder="meters"
                      required
                    />
                  </div>
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
                form="add-item-form"
                className="px-6 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                Save Item
              </button>
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
