import { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar as CalendarIcon, Target, Users } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const MOCK_SALES_DATA = [
  { name: 'Jan', sales: 400000 },
  { name: 'Feb', sales: 300000 },
  { name: 'Mar', sales: 550000 },
  { name: 'Apr', sales: 450000 },
  { name: 'May', sales: 700000 },
  { name: 'Jun', sales: 850000 },
];

export function Reports() {
  const [dateRange] = useState('Last 6 Months');

  return (
    <div className="space-y-6 flex flex-col h-full relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Reports & Analytics</h1>
          <p className="text-sm text-muted mt-1">Deep dive into sales, performance, and revenue metrics</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-secondary/50 transition-colors text-sm font-medium shadow-sm">
            <CalendarIcon className="w-4 h-4 text-muted" />
            {dateRange}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Total Revenue</h3>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">₹32,50,000</div>
          <p className="text-sm text-emerald-600 flex items-center mt-2 font-medium">
            <TrendingUp className="w-4 h-4 mr-1" /> +14.5% vs previous period
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Win Rate (Quotes)</h3>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">68.2%</div>
          <p className="text-sm text-emerald-600 flex items-center mt-2 font-medium">
            <TrendingUp className="w-4 h-4 mr-1" /> +2.1% vs previous period
          </p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">New Clients</h3>
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">24</div>
          <p className="text-sm text-muted mt-2 font-medium">
            In the selected date range
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Revenue by Month</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_SALES_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `₹${value / 100000}L`} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Bar dataKey="sales" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-foreground mb-6">Top Performing Categories</h3>
          <div className="space-y-6">
            {[
              { name: "Motorized Curtains", value: "₹12,40,000", percent: 85 },
              { name: "Premium Wallpapers", value: "₹8,20,000", percent: 60 },
              { name: "Custom Upholstery", value: "₹6,15,000", percent: 45 },
              { name: "Roller Blinds", value: "₹3,50,000", percent: 25 },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted">{item.name}</span>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
