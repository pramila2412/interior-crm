import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, UserSquare2, LogOut, Calendar, 
  FolderKanban, CheckSquare, FileText, ShoppingCart, 
  Hammer, Wrench, CreditCard, Package, BarChart3, Settings2, Menu, X
} from 'lucide-react';
import { cn } from '../../lib/utils';

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

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* ── Mobile Sidebar (Drawer) ────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebarBg border-r border-border/80 flex flex-col transition-transform duration-300 ease-in-out lg:hidden shadow-premium",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center justify-between px-4 mt-1 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-primary">A</span>
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-foreground leading-tight">AuraDesign</p>
              <p className="text-xs text-muted mt-0.5">Workspace</p>
            </div>
          </div>
          <button
            onClick={onMobileClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted hover:text-foreground hover:bg-black/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2 px-3">
            Workspace
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/80 hover:bg-black/5 hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary" : "text-muted")} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="p-2 border-t border-border/50 shrink-0">
          <NavLink
            to="/login"
            onClick={onMobileClose}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </NavLink>
        </div>
      </aside>

      {/* ── Desktop Sidebar ────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden lg:flex flex-shrink-0 flex-col h-full bg-sidebarBg transition-all duration-300 relative border-r border-border/40 select-none",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header row: Logo + hamburger */}
        <div
          className={cn(
            "h-20 flex items-center mt-1 mb-1 overflow-hidden shrink-0",
            collapsed ? "px-3 justify-center" : "px-4 gap-3"
          )}
        >
          {/* Hamburger toggle */}
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted hover:text-foreground hover:bg-black/5 transition-colors shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Logo + Brand name */}
          {!collapsed && (
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">A</span>
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold tracking-tight text-foreground leading-tight truncate">
                  AuraDesign
                </p>
                <p className="text-xs text-muted mt-0.5">Workspace</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {!collapsed && (
            <div className="text-[11px] font-semibold text-muted uppercase tracking-wider mb-2 px-3">
              Workspace
            </div>
          )}

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  collapsed && "justify-center px-2",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-foreground/80 hover:bg-black/5 hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "w-4 h-4 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted"
                    )}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom actions */}
        <div className={cn("p-2 border-t border-border/50 shrink-0", collapsed && "px-2")}>
          <NavLink
            to="/login"
            title={collapsed ? "Logout" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-muted hover:bg-destructive/10 hover:text-destructive",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
}
