import { useEffect, useState } from 'react';
import { getCustomers, getUsers } from '../api/services';
import { type Customer, type User } from '../api/db';
import { Users, ClipboardList, Ruler, Hammer, Truck } from 'lucide-react';

export function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getCustomers().then(setCustomers);
    getUsers().then(setUsers);
  }, []);

  const stats = [
    { label: 'Total Enquiries', value: customers.filter(c => c.status === 'Enquiry').length, icon: ClipboardList, color: 'text-terracotta' },
    { label: 'In Measurement', value: customers.filter(c => c.status === 'Measurement').length, icon: Ruler, color: 'text-taupe' },
    { label: 'In Production', value: customers.filter(c => c.status === 'Production').length, icon: Hammer, color: 'text-olive' },
    { label: 'Pending Delivery', value: customers.filter(c => c.status === 'Delivery & Installation').length, icon: Truck, color: 'text-stone' },
    { label: 'Total Staff', value: users.length, icon: Users, color: 'text-charcoal' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold text-primary">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h3 className="text-muted font-medium text-sm">{stat.label}</h3>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Recent Customers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border text-sm text-muted">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Service</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 5).map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0 text-sm">
                  <td className="p-4 font-medium text-foreground">{customer.name}</td>
                  <td className="p-4 text-muted">{customer.service}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted">{customer.dateAdded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
