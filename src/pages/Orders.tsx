import { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../api/services';
import { type Order, type OrderStatus } from '../api/db';
import { FileText, IndianRupee, Eye, ChevronRight } from 'lucide-react';

const NEXT_STATUS: Record<OrderStatus, OrderStatus | null> = {
  PROCESSING: 'READY',
  READY: 'DELIVERED',
  DELIVERED: null,
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PROCESSING: 'text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20',
  READY: 'text-amber-600 bg-amber-50 border-amber-200',
  DELIVERED: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20',
};

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  const advanceStatus = async (id: string, currentStatus: OrderStatus) => {
    const nextStatus = NEXT_STATUS[currentStatus];
    if (nextStatus) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: nextStatus } : o));
      await updateOrderStatus(id, nextStatus);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Purchase Orders</h1>
          <p className="text-sm text-muted mt-1">Manage material and fabrication orders</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-muted">Loading orders...</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 text-foreground text-sm border-b border-border">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Project</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Amount</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-border hover:bg-secondary/20 transition-colors group">
                    <td className="p-4">
                      <div className="font-mono text-xs font-medium text-muted">{order.id}</div>
                      <div className="text-xs text-muted mt-0.5">{order.date}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-foreground flex items-center gap-2">
                        <FileText className="w-4 h-4 text-muted" />
                        {order.projectName}
                      </div>
                      <div className="text-xs text-muted mt-0.5">{order.itemsCount} items</div>
                    </td>
                    <td className="p-4 text-muted font-medium">{order.customerName}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-foreground font-semibold text-right">
                      <div className="flex items-center justify-end">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                        {order.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-muted hover:text-primary bg-background border border-border rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {NEXT_STATUS[order.status] && (
                          <button 
                            onClick={() => advanceStatus(order.id, order.status)}
                            className="p-2 text-primary hover:text-primary-foreground hover:bg-primary bg-background border border-border rounded-lg transition-colors flex items-center gap-1"
                            title={`Mark as ${NEXT_STATUS[order.status]}`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
