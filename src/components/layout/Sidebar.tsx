import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserSquare2, LogOut, Calendar, 
  FolderKanban, CheckSquare, FileText, ShoppingCart, 
  Hammer, Wrench, CreditCard, Package, BarChart3, Settings2, X
} from 'lucide-react';
import { cn } from '../../lib/utils';

export function Sidebar({ open, setOpen }: { open?: boolean, setOpen?: (val: boolean) => void }) {
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
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border h-screen flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
      open ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="p-6 border-b border-border flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-primary tracking-tight">AuraDesign</h1>
          <p className="text-sm text-muted mt-1">Interior Design Ops</p>
        </div>
        {setOpen && (
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 text-muted hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            onClick={() => setOpen?.(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-foreground hover:bg-background hover:text-primary"
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border shrink-0">
        <NavLink to="/login" className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium text-muted hover:text-red-500 transition-colors rounded-md hover:bg-red-50">
          <LogOut className="w-5 h-5 shrink-0" />
          Logout
        </NavLink>
      </div>
    </aside>
  );
}
