import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, FolderKanban, Users, LogOut, Menu } from 'lucide-react';
import { getProjects, getCustomers } from '../../api/services';
import { type Project, type Customer } from '../../api/db';

interface TopbarProps {
  onMobileToggle?: () => void;
}

export function Topbar({ onMobileToggle }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  // Read logged in admin info
  const storedUser = localStorage.getItem('adminUser');
  const user = storedUser ? JSON.parse(storedUser) : { name: 'Admin', email: 'admin@auradesign.com', role: 'ADMIN' };

  useEffect(() => {
    getProjects().then(setProjects).catch(() => {});
    getCustomers().then(setCustomers).catch(() => {});
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  const roleLabel = user?.role
    ? user.role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Admin';

  const filteredProjects = searchQuery.trim()
    ? projects.filter((p) => p.projectName?.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const filteredCustomers = searchQuery.trim()
    ? customers.filter((c) => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="h-16 flex items-center justify-between px-4 lg:px-6 bg-sidebarBg shrink-0">
      {/* ── Left / Search ──────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center gap-3">
        {onMobileToggle && (
          <button
            onClick={onMobileToggle}
            className="lg:hidden p-1.5 rounded-md text-muted hover:text-foreground hover:bg-black/5 transition-colors"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-72 sm:w-80 md:w-96 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects, customers..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-background/50 border border-border/60 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 rounded-full h-9 transition-colors text-foreground placeholder:text-muted"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
          />

          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl shadow-premium border border-border/70 overflow-hidden z-50">
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredProjects.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[11px] font-semibold text-muted uppercase px-2 mb-1 tracking-wider">Projects</div>
                    {filteredProjects.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        onMouseDown={() => {
                          navigate(`/admin/projects/${p.id}`);
                          setSearchQuery('');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="bg-primary/10 text-primary p-1.5 rounded-md shrink-0">
                          <FolderKanban className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{p.projectName}</p>
                          <p className="text-xs text-muted truncate">{p.customerName || 'No customer'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredCustomers.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-muted uppercase px-2 mb-1 tracking-wider">Customers</div>
                    {filteredCustomers.slice(0, 4).map((c) => (
                      <div
                        key={c.id}
                        onMouseDown={() => {
                          navigate(`/admin/customers/${c.id}`);
                          setSearchQuery('');
                          setIsSearchOpen(false);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-black/5 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="bg-emerald-50 text-emerald-600 p-1.5 rounded-md shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                          <p className="text-xs text-muted truncate">{c.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredProjects.length === 0 && filteredCustomers.length === 0 && (
                  <div className="p-4 text-center text-sm text-muted">No results found for "{searchQuery}"</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Right Section ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button 
          aria-label="Notifications"
          className="p-2 text-muted hover:text-foreground hover:bg-black/5 rounded-lg transition-colors relative"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-sidebarBg" />
        </button>

        <div className="h-6 w-px bg-border/60 mx-1" />

        {/* ── Avatar + Profile dropdown ──────────────────────────────────── */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-black/5 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none text-foreground">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted mt-1 truncate max-w-[140px]">{user?.email || 'admin@auradesign.com'}</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary/15 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs">
              {initials}
            </div>
          </button>

          {/* Dropdown panel */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card rounded-xl border border-border/80 shadow-premium z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/60 bg-sidebarBg/50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/15 text-primary border border-primary/20 flex items-center justify-center font-bold text-xs shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-muted truncate">{user?.email || 'admin@auradesign.com'}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded px-1.5 py-0.5">
                      {roleLabel}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-foreground/80 hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
