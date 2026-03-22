import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Calendar, Bell, Package, CheckCircle, 
  Clock, DollarSign, MapPin, Phone, Mail, ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [clientData, setClientData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    event_date: '',
    venue: '',
    event_type: 'Wedding'
  });

  const API_URL = 'https://anjali-tent-backend.onrender.com';

  useEffect(() => {
    const savedClient = localStorage.getItem('clientData');
    if (savedClient) {
      const parsed = JSON.parse(savedClient);
      setClientData(parsed);
      setIsAuth(true);
      fetchClientData(parsed.id);
    }
  }, []);

  const fetchClientData = async (clientId) => {
    try {
      const [bookRes, notifRes] = await Promise.all([
        fetch(`${API_URL}/clients/${clientId}/bookings`).catch(() => null),
        fetch(`${API_URL}/clients/${clientId}/notifications`).catch(() => null)
      ]);
      if (bookRes?.ok) {
        const data = await bookRes.json();
        setBookings(Array.isArray(data) ? data : []);
      }
      if (notifRes?.ok) {
        const data = await notifRes.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.error("Data fetch failed", e); }
  };
  const handleBookingRequest = async (e) => {
    e.preventDefault();
    if (!newBooking.event_date || !newBooking.venue) return alert("Please fill all details.");
    try {
      const res = await fetch(`${API_URL}/bookings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newBooking, client_id: clientData.id })
      });
      if (res.ok) {
        alert("Booking request sent! Admin will confirm soon.");
        setShowBookingModal(false);
        fetchClientData(clientData.id);
      }
    } catch (e) { alert("Failed to send booking request."); }
  };
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-400 mx-auto mb-6"><User size={32} /></div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2 text-center text-glow">Client Portal</h2>
          <p className="text-slate-400 text-sm text-center mb-10 leading-relaxed font-light">Access your personal bookings, tracking, and invoices instantly.</p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-5 bg-gradient-to-tr from-brand-600 to-brand-400 text-slate-950 font-black rounded-2xl hover:scale-[1.02] transition-transform shadow-xl hover:shadow-brand-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2 group"
            >
              Sign In to Portal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="w-full py-5 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all uppercase tracking-widest text-sm"
            >
              Crate New Account
            </button>
          </div>
          <p className="mt-8 text-slate-500 text-[10px] text-center border-t border-slate-800/50 pt-6 uppercase tracking-widest font-bold">Anjali Tent & Caterers • Premium Service</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-24 px-4 md:px-10 pb-24 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-brand-500/10 text-brand-400 border border-brand-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Logged In</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 text-xs font-mono">ID #{clientData.id}00X</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-black text-white tracking-tight">
              Welcome, <span className="text-glow">{clientData.name}</span>
            </h1>
            <p className="text-slate-500 mt-2 font-light">Last activity: {new Date().toLocaleDateString()} • Keep track of your events.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowBookingModal(true)}
              className="px-6 py-3 bg-brand-500 text-slate-950 font-bold rounded-xl hover:bg-brand-400 shadow-lg flex items-center gap-2 text-sm transition-all"
            >
              <Calendar size={18} /> Book New Event
            </button>
            <button onClick={() => {
              localStorage.removeItem('clientData');
              setIsAuth(false);
              navigate('/login');
            }} className="text-slate-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors py-2 px-4 rounded-xl border border-slate-800 hover:bg-slate-900">Logout</button>
          </div>
        </header>

        {/* TABS */}
        <nav className="flex gap-2 mb-10 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-800 w-fit">
          <button onClick={() => setActiveTab('bookings')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'bookings' ? 'bg-brand-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>My Bookings</button>
          <button onClick={() => setActiveTab('notifications')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all relative ${activeTab === 'notifications' ? 'bg-brand-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            Notifications
            {notifications.some(n => !n.is_read) && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-950"></span>}
          </button>
          <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-brand-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>Profile Detail</button>
        </nav>

        <AnimatePresence mode="wait">
          {/* BOOKINGS LIST */}
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
              {bookings.length === 0 ? (
                <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem]">
                  <p className="text-slate-500 italic">You don't have any bookings yet. Want to create one?</p>
                </div>
              ) : (
                bookings.map(book => (
                  <div key={book.id} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 lg:p-10 shadow-xl border-t-brand-500/20 backdrop-blur-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transform rotate-12 bg-package size-40"><Calendar size={160} /></div>
                    
                    <div className="flex flex-col lg:flex-row justify-between mb-10 gap-8">
                      <div className="flex gap-6 items-start">
                        <div className={`w-20 h-20 rounded-3xl flex flex-col items-center justify-center border font-black ${book.status==='Confirmed' ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-brand-500/40 bg-brand-500/10 text-brand-400'}`}>
                          <span className="text-[10px] uppercase">{new Date(book.event_date).toLocaleString('default',{month:'short'})}</span>
                          <span className="text-3xl">{new Date(book.event_date).getDate()}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Live Event Booking</p>
                          <h3 className="text-3xl font-serif font-bold text-white mb-2">{book.event_type} <span className="text-slate-600 font-normal">@</span> {book.venue}</h3>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${book.status==='Confirmed' ? 'bg-green-500/10 text-green-500' : 'bg-brand-500/10 text-brand-500 border border-brand-500/20'}`}>
                            {book.status==='Confirmed' ? <CheckCircle size={12}/> : <Clock size={12}/>} {book.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 items-stretch">
                        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 min-w-48">
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Amount</p>
                           <p className="text-2xl font-bold text-white">₹{(book.total_amount).toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 min-w-48">
                           <p className="text-[10px] font-bold text-green-500/50 uppercase tracking-widest mb-2">Amount Paid</p>
                           <p className="text-2xl font-bold text-green-400">₹{(book.paid_amount || 0).toLocaleString()}</p>
                        </div>
                        <div className={`p-6 rounded-3xl border min-w-48 ${book.total_amount - (book.paid_amount || 0) > 0 ? 'bg-brand-500 text-slate-950 border-brand-400' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                           <p className="text-[10px] font-bold uppercase tracking-widest mb-2">Balance Due</p>
                           <p className="text-2xl font-black">₹{(book.total_amount - (book.paid_amount || 0)).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {book.rentals?.length > 0 && book.rentals.map(rental => (
                        <div key={rental.id} className="bg-slate-950/50 p-5 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-brand-500"><Package size={20}/></div>
                            <div>
                               <p className="font-bold text-sm text-slate-300">{rental.item?.name}</p>
                               <p className="text-[10px] text-slate-500 uppercase tracking-widest">Qty: {rental.quantity}</p>
                            </div>
                          </div>
                          {rental.is_returned ? (
                            <span className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-1 rounded-md">Returned</span>
                          ) : (
                            <span className="text-[10px] font-bold bg-brand-500/10 text-brand-400 px-2 py-1 rounded-md">In Possession</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {book.payments?.length > 0 && (
                      <div className="mt-10 pt-8 border-t border-slate-800/50">
                        <div className="flex items-center gap-2 mb-6">
                          <DollarSign size={18} className="text-brand-500" />
                          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Transaction History</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {book.payments.map(pay => (
                            <div key={pay.id} className="bg-slate-950/30 p-4 rounded-2xl border border-slate-800 flex justify-between items-center group hover:border-brand-500/30 transition-colors">
                               <div className="flex items-center gap-4">
                                  <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                                  <div>
                                     <p className="text-xs font-bold text-white">{new Date(pay.payment_date).toLocaleDateString()}</p>
                                     <p className="text-[10px] text-slate-500 uppercase font-bold">{pay.payment_method}</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <p className="text-brand-400 font-bold">₹{pay.amount.toLocaleString()}</p>
                                  {pay.notes && <p className="text-[10px] text-slate-600 italic">"{pay.notes}"</p>}
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
               {notifications.length === 0 ? (
                 <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-[2.5rem] text-slate-500">
                    No new alerts or messages.
                 </div>
               ) : (
                 notifications.sort((a,b) => b.id - a.id).map(notif => (
                   <div key={notif.id} className={`p-6 rounded-[2rem] border transition-all ${!notif.is_read ? 'bg-brand-500/5 border-brand-500/20' : 'bg-slate-900/50 border-slate-800'}`}>
                     <div className="flex gap-5 items-start">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${!notif.is_read ? 'bg-brand-500/20 text-brand-400' : 'bg-slate-800 text-slate-600'}`}>
                          <Bell size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-xs font-bold text-slate-500 font-mono tracking-widest uppercase">{new Date(notif.created_at).toLocaleString()}</p>
                            {!notif.is_read && <span className="w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_10px_#facc15]"></span>}
                          </div>
                          <p className={`text-lg leading-relaxed ${!notif.is_read ? 'text-white font-bold' : 'text-slate-400'}`}>{notif.message}</p>
                        </div>
                     </div>
                   </div>
                 ))
               )}
            </motion.div>
          )}

          {/* PROFILE DETAIL */}
          {activeTab === 'profile' && (
             <motion.div key="profile" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="max-w-2xl mx-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-2xl overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/10 blur-3xl pointer-events-none"></div>
                   <div className="flex flex-col items-center text-center mb-10">
                      <div className="w-24 h-24 bg-gradient-to-tr from-brand-600 to-brand-400 rounded-full flex items-center justify-center text-slate-950 font-black text-4xl mb-6 shadow-2xl border-4 border-slate-900 ring-4 ring-brand-500/20">
                        {clientData.name[0]}
                      </div>
                      <h2 className="text-3xl font-serif font-black text-white">{clientData.name}</h2>
                      <p className="text-slate-400 mt-1 font-light italic">Valued Premium Client</p>
                   </div>
                   
                   <div className="space-y-8">
                      <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-950 border border-slate-800">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-brand-500"><Mail size={24} /></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Email Connection</p>
                          <p className="text-white font-bold text-lg">{clientData.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-950 border border-slate-800">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-brand-500"><Phone size={24} /></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Support Contact</p>
                          <p className="text-white font-bold text-lg">{clientData.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-950 border border-slate-800">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-brand-500"><MapPin size={24} /></div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Service Address</p>
                          <p className="text-white font-bold text-lg">{clientData.address}</p>
                        </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* BOOKING REQUEST MODAL */}
        <AnimatePresence>
          {showBookingModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
                <h2 className="text-3xl font-serif font-black text-white mb-6">Request <span className="text-brand-500">New Booking</span></h2>
                <form onSubmit={handleBookingRequest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Event Date</label>
                       <input 
                         type="date" 
                         value={newBooking.event_date} 
                         onChange={(e) => setNewBooking({...newBooking, event_date: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-brand-500 outline-none" 
                         required
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Event Type</label>
                       <select 
                         value={newBooking.event_type}
                         onChange={(e) => setNewBooking({...newBooking, event_type: e.target.value})}
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-brand-500 outline-none appearance-none"
                       >
                         <option>Wedding</option>
                         <option>Reception</option>
                         <option>Birthday</option>
                         <option>Corporate Event</option>
                         <option>Small Party</option>
                       </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Event Venue / Address</label>
                     <input 
                       type="text" 
                       placeholder="e.g. Royal Palace Garden, Lucknow"
                       value={newBooking.venue} 
                       onChange={(e) => setNewBooking({...newBooking, venue: e.target.value})}
                       className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-brand-500 outline-none" 
                       required
                     />
                  </div>
                  <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 py-5 bg-brand-500 text-slate-950 font-black rounded-2xl shadow-xl hover:bg-brand-400 uppercase tracking-widest text-sm">Send Request</button>
                    <button type="button" onClick={() => setShowBookingModal(false)} className="px-8 py-5 border border-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 uppercase tracking-widest text-sm">Cancel</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientDashboard;
