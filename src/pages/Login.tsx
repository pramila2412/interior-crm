import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { loginUser } from '../api/services';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simple frontend validation
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      
      // Store user info in localStorage (or context)
      localStorage.setItem('adminUser', JSON.stringify(res.user));
      
      // Redirect to dashboard on success
      navigate('/admin');
    } catch (err: any) {
      // Show error from backend
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-center text-primary mb-2">Admin Login</h2>
          <p className="text-center text-muted mb-6 text-sm">Sign in to manage customers and staff.</p>
          
          {error && (
            <div className="mb-6 p-3 bg-terracotta/10 border border-terracotta/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
              <p className="text-sm text-terracotta">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted hover:text-primary transition-colors">
              &larr; Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
