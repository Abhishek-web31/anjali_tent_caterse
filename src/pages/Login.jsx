import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Tent, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if(email && password) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden py-24 px-4 text-slate-200">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-slate-800/20 rounded-bl-full blur-[80px] -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-900 shadow-2xl rounded-3xl p-8 md:p-10 border border-slate-800 relative z-10">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-slate-900 shadow-lg shadow-brand-500/30">
              <Tent size={32} />
            </Link>
          </div>
          
          <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
          <p className="text-center text-slate-400 mb-8 font-medium">Log in to manage your events</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 text-slate-500" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all shadow-inner placeholder-slate-600" 
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 text-slate-500" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all shadow-inner placeholder-slate-600" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded text-brand-500 border-slate-700 bg-slate-800 focus:ring-brand-500" />
                <span className="text-sm font-medium text-slate-400">Remember me</span>
              </label>
              <a href="#" className="text-sm font-bold text-brand-500 hover:text-brand-400 transition-colors">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="w-full py-4 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 group mt-8"
            >
              Sign In
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center mt-8 text-slate-400 font-medium">
            Don't have an account? <Link to="/register" className="text-brand-500 font-bold hover:text-brand-400 transition-colors">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
