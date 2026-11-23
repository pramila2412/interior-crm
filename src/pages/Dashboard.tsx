import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomers, getUsers } from '../api/services';
import { type Customer, type User } from '../api/db';
import { Users, ClipboardList, Ruler, Hammer, Truck, FileText, FolderKanban } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const storedUser = localStorage.getItem('adminUser');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    getCustomers().then(setCustomers);
    getUsers().then(setUsers);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { label: 'Total Enquiries', value: customers.filter(c => c.status === 'Enquiry').length, icon: ClipboardList, bg: 'bg-primary/10', color: 'text-primary' },
    { label: 'In Measurement', value: customers.filter(c => c.status === 'Measurement').length, icon: Ruler, bg: 'bg-pink-50', color: 'text-pink-600' },
    { label: 'In Estimate', value: customers.filter(c => c.status === 'Estimate').length, icon: ClipboardList, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'In Production', value: customers.filter(c => c.status === 'Production').length, icon: Hammer, bg: 'bg-amber-50', color: 'text-amber-600' },
    { label: 'In Installation', value: customers.filter(c => c.status === 'Installation').length, icon: Truck, bg: 'bg-purple-50', color: 'text-purple-600' },
    { label: 'Total Staff', value: users.length, icon: Users, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {getGreeting()}, {user?.name || 'there'}
          </h1>
          <p className="text-muted mt-1 text-sm">
            Welcome back. Here is the live overview of your interior projects.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/admin/projects')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-soft"
          >
            <FolderKanban className="w-4 h-4" />
            Projects
          </button>
          <button
            onClick={() => navigate('/admin/quotations')}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-primary/30 text-primary hover:bg-primary/5 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <FileText className="w-4 h-4" />
            Quotations
          </button>
          <button
            onClick={() => navigate('/admin/customers')}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground hover:bg-black/5 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <Users className="w-4 h-4" />
            Customers
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card p-5 rounded-xl border border-border shadow-soft flex flex-col justify-between gap-4">
            <div className="flex justify-between items-start">
              <h3 className="text-muted font-medium text-xs uppercase tracking-wider">{stat.label}</h3>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Customers Card */}
      <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-lg font-semibold text-foreground">Recent Customers</h2>
          <button
            onClick={() => navigate('/admin/customers')}
            className="text-xs font-medium text-primary hover:underline"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border text-xs uppercase tracking-wider text-muted font-semibold">
                <th className="p-4">Name</th>
                <th className="p-4">Service</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 5).map((customer) => (
                <tr 
                  key={customer.id} 
                  onClick={() => navigate(`/admin/customers/${customer.id}`)}
                  className="border-b border-border last:border-0 text-sm hover:bg-black/5 transition-colors cursor-pointer"
                >
                  <td className="p-4 font-medium text-foreground">{customer.name}</td>
                  <td className="p-4 text-muted">{customer.service}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted">{customer.dateAdded}</td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm text-muted">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
