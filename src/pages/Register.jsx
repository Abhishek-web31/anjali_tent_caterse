import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Tent, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('https://anjali-tent-backend.onrender.com/clients/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden py-32 px-4 text-slate-200">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-800/20 rounded-tr-full blur-[80px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg my-8"
      >
        <div className="bg-slate-900 shadow-2xl rounded-3xl p-8 md:p-10 border border-slate-800 relative z-10">
          
          <div className="flex justify-center mb-8">
            <Link to="/" className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-slate-900 shadow-lg shadow-brand-500/30">
              <Tent size={32} />
            </Link>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-white mb-2">Create Account</h2>
          <p className="text-center text-slate-400 mb-8 font-medium">Join us to manage your perfect event.</p>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center font-bold">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-500 text-sm rounded-xl text-center font-bold">
              Registration Successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 outline-none transition-all shadow-inner placeholder-slate-600" 
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Phone Number</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-4 text-slate-500" size={18} />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required 
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 outline-none transition-all shadow-inner placeholder-slate-600" 
                    placeholder="+91 99999"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-slate-500" size={18} />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 outline-none transition-all shadow-inner placeholder-slate-600" 
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Full Address</label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required 
                  rows="2"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 outline-none transition-all shadow-inner placeholder-slate-600 resize-none" 
                  placeholder="123 Celebration St."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-slate-500" size={18} />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 outline-none transition-all shadow-inner placeholder-slate-600" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || success}
              className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 group mt-8 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
              {!loading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center mt-8 text-slate-400 font-medium">
            Already have an account? <Link to="/login" className="text-brand-500 font-bold hover:text-brand-400 transition-colors">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
