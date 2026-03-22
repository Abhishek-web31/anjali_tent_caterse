import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Tent } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Services', path: '/#services' },
    { name: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'
        }`}
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div
          className={`flex items-center justify-between px-6 py-3 rounded-full transition-all duration-300 ${isScrolled
            ? 'bg-slate-900/80 backdrop-blur-lg shadow-xl border border-white/10'
            : 'bg-transparent'
            }`}
        >
          {/* Logo */}
          <Link to="public/vite.jpeg" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-slate-950 shadow-lg group-hover:shadow-brand-500/50 transition-all duration-500 rotate-3 group-hover:rotate-0">
              <img src="public/vite.jpeg" alt="" />
            </div>
            <span className="font-serif font-bold text-2xl tracking-tighter text-white drop-shadow-lg">
              Anjali <span className="text-brand-500">Tent</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-sm font-medium transition-colors hover:text-brand-400 text-white/80 drop-shadow-sm"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/client-dashboard"
              className="text-sm font-medium transition-colors text-white hover:text-brand-300 mr-2"
            >
              Client Portal
            </Link>
            <Link
              to="/admin"
              className="px-6 py-2 rounded-full text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-400 hover:to-brand-300 shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
            >
              Admin Access
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-4 right-4 mt-2 p-4 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-slate-300 font-medium text-lg px-2 hover:text-brand-400 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-slate-800 my-2"></div>
              <Link
                to="/client-dashboard"
                className="text-slate-300 font-medium px-2 py-2 hover:text-brand-400"
              >
                Client Portal
              </Link>
              <Link
                to="/admin"
                className="block text-center w-full px-5 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-brand-500 to-brand-400 shadow-md"
              >
                Admin Access
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
