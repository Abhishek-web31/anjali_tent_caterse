import { Tent, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-slate-900">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-16 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-amber-300 flex items-center justify-center text-slate-900 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all">
                <Tent size={20} />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white drop-shadow-md">
                Anjali Tent
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed mb-6 max-w-md">
              Elevating your special moments with premium tent setups, luxurious decorations, and exquisite catering services. We turn ordinary events into unforgettable experiences.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-slate-900 hover:border-brand-500 transition-all duration-300 hover:-translate-y-1">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-slate-900 hover:border-brand-500 transition-all duration-300 hover:-translate-y-1">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-brand-500 hover:text-slate-900 hover:border-brand-500 transition-all duration-300 hover:-translate-y-1">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-3">
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Home</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-400 transition-colors">Gallery</Link></li>
              <li><a href="/#services" className="hover:text-brand-400 transition-colors">Services</a></li>
              <li><Link to="/contact" className="hover:text-brand-400 transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Client Area</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 group cursor-pointer">
                <MapPin size={20} className="text-brand-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-brand-100 transition-colors">123 Celebration Avenue, ST 12345</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Phone size={20} className="text-brand-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-brand-100 transition-colors">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 group cursor-pointer">
                <Mail size={20} className="text-brand-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-brand-100 transition-colors">info@anjalitent.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="h-px w-full bg-slate-900 mb-8"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-600">
          <p>&copy; {new Date().getFullYear()} Anjali Tent & Caterers. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
