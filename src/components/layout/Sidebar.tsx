import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserSquare2, LogOut, Calendar, 
  FolderKanban, CheckSquare, FileText, ShoppingCart, 
  Hammer, Wrench, CreditCard, Package, BarChart3, Settings2
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar() {
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Tasks', path: '/admin/tasks', icon: CheckSquare },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Quotations', path: '/admin/quotations', icon: FileText },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Production', path: '/admin/production', icon: Hammer },
    { label: 'Installations', path: '/admin/installations', icon: Wrench },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Inventory', path: '/admin/inventory', icon: Package },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Project Calendar', path: '/admin/calendar', icon: Calendar },
    { label: 'Manage Web Services', path: '/admin/services', icon: Settings2 },
    { label: 'Staff Management', path: '/admin/users', icon: UserSquare2 },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-semibold text-primary tracking-tight">AuraDesign</h1>
        <p className="text-sm text-muted mt-1">Interior Design Ops</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-foreground hover:bg-background hover:text-primary"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <NavLink to="/login" className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium text-muted hover:text-terracotta transition-colors rounded-md hover:bg-background">
          <LogOut className="w-5 h-5" />
          Logout
        </NavLink>
      </div>
    </aside>
  );
}
