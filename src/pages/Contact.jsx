import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', service: 'General' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', phone: '', message: '', service: 'General' });
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-950 relative overflow-hidden text-slate-200">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-700/20 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-600">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Have a question or want to book our services? We'd love to hear from you. Fill out the form below and our team will get back to you shortly.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border border-slate-800">
          
          {/* Contact Info Panel */}
          <div className="col-span-1 lg:col-span-2 bg-slate-950 rounded-[2rem] p-10 text-white shadow-inner border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-800/50 rounded-full blur-[60px]" />
            
            <h3 className="text-3xl font-bold mb-8 relative z-10">Contact Information</h3>
            <p className="text-slate-400 mb-12 relative z-10">Say something to start a live chat or hit us up on email.</p>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-slate-950 transition-colors duration-300 border border-slate-800">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">Phone Number</p>
                  <p className="text-lg font-bold text-slate-200">+91 98765 43210</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-slate-950 transition-colors duration-300 border border-slate-800">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">Email Address</p>
                  <p className="text-lg font-bold text-slate-200">hello@anjalitent.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-slate-950 transition-colors duration-300 border border-slate-800">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">Office Location</p>
                  <p className="text-lg font-bold text-slate-200 max-w-[200px]">123 Celebration Ave, ST 12345</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-slate-950 transition-colors duration-300 border border-slate-800">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold mb-1">Working Hours</p>
                  <p className="text-lg font-bold text-slate-200">10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
            
            {/* Decorative circles */}
            <div className="absolute right-10 bottom-10 w-48 h-48 border-[20px] border-white/[0.02] rounded-full z-0" />
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-brand-500/10 rounded-full z-0" />
          </div>

          {/* Form Panel */}
          <div className="col-span-1 lg:col-span-3 p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">First Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-inner outline-none transition-all placeholder-slate-600" 
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-inner outline-none transition-all placeholder-slate-600" 
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-inner outline-none transition-all placeholder-slate-600" 
                    placeholder="+91 90000 00000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 ml-1">Service Required</label>
                  <select 
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-inner outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option className="bg-slate-900" value="General">General Inquiry</option>
                    <option className="bg-slate-900" value="Tent Setup">Tent Setup</option>
                    <option className="bg-slate-900" value="Catering">Catering Services</option>
                    <option className="bg-slate-900" value="Decoration">Decoration Services</option>
                    <option className="bg-slate-900" value="Full Package">Full Event Package</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 ml-1">Your Message</label>
                <textarea 
                  required 
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-5 py-4 rounded-xl border border-slate-800 bg-slate-950/50 text-white focus:bg-slate-950 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 shadow-inner outline-none transition-all resize-none placeholder-slate-600" 
                  placeholder="Tell us about your event..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-4 px-8 rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {submitted ? 'Message Sent!' : 'Send Message'}
                {!submitted && <Send size={20} />}
              </button>
              
              {submitted && (
                <p className="text-brand-400 text-center font-bold mt-4">Thank you for contacting us! We'll reply soon.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
