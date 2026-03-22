import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CalendarIcon, Wallet, CheckCircle, Clock, MapPin, Tent, MessageSquare, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Dummy Client ID for demonstration
  const CLIENT_ID = 1;
  const API_URL = 'https://anjali-tent-backend.onrender.com';

  const [bookings, setBookings] = useState([
    { id: 101, event_date: "2024-05-15", venue: "Taj Gardens", event_type: "Wedding", status: "Confirmed", total_amount: 150000, paid_amount: 50000 },
    { id: 102, event_date: "2024-08-20", venue: "City Hall", event_type: "Corporate", status: "Pending", total_amount: 0, paid_amount: 0 }
  ]);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Your booking for Wedding at Taj Gardens has been CONFIRMED by Admin.", created_at: "2024-03-20T10:00:00" },
    { id: 2, message: "Welcome to Anjali Tent & Caterers! You can now request bookings.", created_at: "2024-03-19T09:00:00" }
  ]);
  
  // New Booking State
  const [newBooking, setNewBooking] = useState({ event_date: '', venue: '', event_type: 'Wedding' });
  const [consultMsg, setConsultMsg] = useState('');

  const submitBooking = (e) => {
    e.preventDefault();
    const bk = { ...newBooking, id: 103 + Math.floor(Math.random()*100), status: 'Pending', total_amount: 0, paid_amount: 0 };
    setBookings([bk, ...bookings]);
    setNewBooking({ event_date: '', venue: '', event_type: 'Wedding' });
    alert("Booking Request Sent to Admin!");
  };

  const handleConsult = (e) => {
    e.preventDefault();
    if(consultMsg) {
      alert("Message sent to Admin!");
      setConsultMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-12 text-slate-200">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500 border border-brand-500/20 shadow-inner">
              <span className="text-2xl font-black">R</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Client Dashboard</h1>
              <p className="text-slate-400 mt-1 font-medium tracking-wide">Welcome back, Rahul Sharma.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="mt-6 md:mt-0 px-8 py-3 rounded-xl text-slate-950 font-bold bg-brand-500 hover:bg-brand-400 transition-colors shadow-lg shadow-brand-500/20"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side Panel (Navigation & Notifications) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-4 shadow-xl border border-slate-800 flex flex-col gap-2">
              <button onClick={() => setActiveTab('bookings')} className={`p-4 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'bookings' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <CalendarIcon size={20} /> My Bookings
              </button>
              <button onClick={() => setActiveTab('payments')} className={`p-4 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'payments' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <Wallet size={20} /> Payment History
              </button>
              <button onClick={() => setActiveTab('consult')} className={`p-4 rounded-xl font-bold flex items-center gap-3 transition-all ${activeTab === 'consult' ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <MessageSquare size={20} /> Consult Admin
              </button>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800 max-h-[400px] overflow-y-auto">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 sticky top-0 bg-slate-900 py-2">
                <Bell size={20} className="text-brand-500 animate-pulse" /> Notifications
              </h2>
              <div className="space-y-4">
                {notifications.map(n => (
                  <div key={n.id} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm border-l-2 border-l-brand-500">
                    <p className="text-slate-300 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* BOOKINGS VIEW */}
              {activeTab === 'bookings' && (
                <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  
                  {/* Request New Booking */}
                  <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-3xl shadow-xl border border-slate-800">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Tent className="text-brand-500"/> Request New Booking</h3>
                    <form onSubmit={submitBooking} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 ml-1">Event Date</label>
                        <input type="date" required value={newBooking.event_date} onChange={e=>setNewBooking({...newBooking, event_date: e.target.value})} className="w-full px-5 py-4 bg-slate-950 border border-slate-700 rounded-xl outline-none focus:border-brand-500 text-slate-300" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 ml-1">Event Type</label>
                        <select value={newBooking.event_type} onChange={e=>setNewBooking({...newBooking, event_type: e.target.value})} className="w-full px-5 py-4 bg-slate-950 border border-slate-700 rounded-xl outline-none focus:border-brand-500 text-slate-300 appearance-none">
                          <option>Wedding</option><option>Corporate</option><option>Birthday</option><option>Other</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 ml-1">Venue Name/Location</label>
                        <input type="text" required placeholder="Taj Hotel..." value={newBooking.venue} onChange={e=>setNewBooking({...newBooking, venue: e.target.value})} className="w-full px-5 py-4 bg-slate-950 border border-slate-700 rounded-xl outline-none focus:border-brand-500 text-slate-300" />
                      </div>
                      <div className="md:col-span-3 flex justify-end mt-2">
                        <button type="submit" className="px-8 py-4 bg-brand-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:bg-brand-400 transition-colors">Submit Request</button>
                      </div>
                    </form>
                  </div>

                  {/* Existing Bookings */}
                  <div className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800">
                    <h3 className="text-2xl font-bold text-white mb-6">Your Events</h3>
                    <div className="space-y-4">
                      {bookings.map(b => (
                        <div key={b.id} className="p-6 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col md:flex-row justify-between md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-xl font-bold text-white">{b.event_type}</h4>
                              <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${b.status==='Confirmed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                {b.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-slate-400 mt-2">
                              <span className="flex items-center gap-2"><MapPin size={16} className="text-brand-500"/> {b.venue}</span>
                              <span className="flex items-center gap-2"><CalendarIcon size={16} className="text-brand-500"/> {b.event_date}</span>
                            </div>
                          </div>
                          <div className="text-right mt-4 md:mt-0 p-4 bg-slate-900 rounded-xl border border-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Total Cost</p>
                            <p className="text-2xl font-bold text-white">{b.total_amount > 0 ? `₹${b.total_amount.toLocaleString()}` : "Pending Estimate"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PAYMENTS VIEW */}
              {activeTab === 'payments' && (
                <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <h2 className="text-3xl font-bold text-white border-b border-slate-800 pb-4">Payment Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bookings.filter(b => b.status === 'Confirmed').map(b => (
                      <div key={b.id} className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-bl-full" />
                        <h4 className="text-xl font-bold text-white mb-6">{b.event_type} - {b.event_date}</h4>
                        
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-slate-300 text-lg">
                            <span>Total Amount</span>
                            <span className="font-bold">₹{b.total_amount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-green-400 text-lg">
                            <span>Paid Amount</span>
                            <span className="font-bold">₹{b.paid_amount.toLocaleString()}</span>
                          </div>
                          <div className="h-px bg-slate-800 my-2"></div>
                          <div className="flex justify-between items-center text-brand-400 text-xl font-black">
                            <span>Due Balance</span>
                            <span>₹{(b.total_amount - b.paid_amount).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-8 bg-brand-500/10 p-4 rounded-xl border border-brand-500/20 text-center">
                          <p className="text-sm text-brand-400 font-bold">Please contact Admin to complete remaining payment via Bank Transfer/UPI.</p>
                        </div>
                      </div>
                    ))}
                    {bookings.filter(b => b.status === 'Confirmed').length === 0 && (
                      <p className="text-slate-500 italic">No confirmed bookings have payment tracking available yet.</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* CONSULT ADMIN VIEW */}
              {activeTab === 'consult' && (
                <motion.div key="consult" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 min-h-[500px] flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Consult with Our Team</h2>
                    <p className="text-slate-400 mb-8">Send a direct message regarding your upcoming events or general queries. We'll reply inside your notifications or via email.</p>
                    <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800 h-[250px] overflow-y-auto mb-6 flex flex-col justify-end text-sm text-slate-500 italic text-center">
                      Your messages will appear here. No active conversation yet.
                    </div>
                  </div>
                  
                  <form onSubmit={handleConsult} className="flex gap-4">
                    <input 
                      type="text" 
                      value={consultMsg}
                      onChange={e=>setConsultMsg(e.target.value)}
                      placeholder="Type your message here..." 
                      className="flex-1 px-6 py-4 rounded-2xl bg-slate-950 border border-slate-700 text-white focus:border-brand-500 outline-none shadow-inner"
                    />
                    <button type="submit" className="w-16 flex items-center justify-center rounded-2xl bg-brand-500 text-slate-950 shadow-lg hover:bg-brand-400 transition-colors">
                      <Send size={24} />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
