import { useEffect, useState } from 'react';
import { getUsers, addUser, deleteUser } from '../api/services';
import { type User, type Role } from '../api/db';
import { UserPlus, Trash2 } from 'lucide-react';
import { SelectInput } from '../components/ui/SelectInput';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Staff');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    if (!name || !email) return;
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    
    await addUser({ name, email, role });
    setName('');
    setEmail('');
    setRole('Staff');
    await loadUsers();
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    await loadUsers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-semibold text-primary">Staff Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-4">Add New User</h2>
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={`w-full px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground ${emailError ? 'border-accent' : 'border-border'}`}
                placeholder="john@example.com"
              />
              {emailError && <p className="text-xs text-accent mt-1">{emailError}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-1">Role</label>
              <SelectInput 
                value={role}
                onChange={e => setRole(e.target.value as Role)}
              >
                <option value="Staff">Staff</option>
                <option value="Manager">Manager</option>
                <option value="Admin">Admin</option>
                <option value="Superadmin">Superadmin</option>
              </SelectInput>
            </div>
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground flex items-center justify-center gap-2 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border text-sm text-muted">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-muted">Loading...</td>
                  </tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 text-sm">
                    <td className="p-4 font-medium text-foreground">{user.name}</td>
                    <td className="p-4 text-muted">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${user.role === 'Superadmin' ? 'bg-terracotta/10 text-terracotta border-terracotta/20' : ''}
                        ${user.role === 'Admin' ? 'bg-olive/10 text-olive border-olive/20' : ''}
                        ${user.role === 'Manager' ? 'bg-taupe/10 text-taupe border-taupe/20' : ''}
                        ${user.role === 'Staff' ? 'bg-stone/10 text-stone border-stone/20' : ''}
                      `}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-muted hover:text-terracotta transition-colors rounded-md hover:bg-terracotta/10 inline-flex"
                        title="Delete User"
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
