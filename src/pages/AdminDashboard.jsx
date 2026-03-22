import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CalendarRange, Box, MessageSquare, 
  Users, CheckCircle, Package, Plus, Lock, Send, DollarSign, 
  Wallet, Image as ImageIcon, Video, Mail, Phone, MapPin
} from 'lucide-react';
import CloudinaryUpload from '../components/CloudinaryUpload';

const AdminDashboard = () => {
  const [isAdminAuth, setIsAdminAuth] = useState(localStorage.getItem('isAdminAuth') === 'true');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ counts: {}, recent_activity: [] });
  
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [clients, setClients] = useState([]);
  const [media, setMedia] = useState([]);
  const [activeBookingForPayment, setActiveBookingForPayment] = useState(null);
  const [paymentDraft, setPaymentDraft] = useState({ amount: '', method: 'Cash', notes: '' });
  const [bookingFilter, setBookingFilter] = useState('all'); // all, Pending, Confirmed
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  // Media Form State
  const [mediaForm, setMediaForm] = useState({
    title: '',
    description: '',
    category: 'Tent',
    isUploading: false
  });

  const API_URL = 'https://anjali-tent-backend.onrender.com';

  useEffect(() => {
    if (!isAdminAuth) return;
    const fetchData = async () => {
      try {
        const [invRes, inqRes, bookRes, usrRes, rntRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/inventory/`).catch(() => null),
          fetch(`${API_URL}/inquiries/`).catch(() => null),
          fetch(`${API_URL}/bookings/`).catch(() => null),
          fetch(`${API_URL}/clients/`).catch(() => null),
          fetch(`${API_URL}/rentals/`).catch(() => null),
          fetch(`${API_URL}/stats/`).catch(() => null),
          fetch(`${API_URL}/media/`).catch(() => null)
        ]);
        
        if (invRes?.ok) {
          const data = await invRes.json();
          setInventory(Array.isArray(data) ? data : []);
        }
        if (inqRes?.ok) {
          const data = await inqRes.json();
          setInquiries(Array.isArray(data) ? data : []);
        }
        if (bookRes?.ok) {
          const data = await bookRes.json();
          setBookings(Array.isArray(data) ? data : []);
        }
        if (usrRes?.ok) {
          const data = await usrRes.json();
          console.log("CLIENTS DATA:", data);
          setClients(Array.isArray(data) ? data : []);
        } else {
          console.error("CLIENTS FETCH FAILED:", usrRes?.status);
        }
        if (rntRes?.ok) {
          const data = await rntRes.json();
          setRentals(Array.isArray(data) ? data : []);
        }
        if (statsRes?.ok) setStats(await statsRes.json());
        if (mediaRes?.ok) setMedia(await mediaRes.json());

      } catch (error) {
        console.error("Dashboard data sync failed.", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [isAdminAuth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      if (response.ok) {
        const data = await response.json();
        setIsAdminAuth(true);
        localStorage.setItem('isAdminAuth', 'true');
        localStorage.setItem('adminData', JSON.stringify(data));
      } else {
        alert("Invalid Email or Password! Please verify your admin credentials.");
      }
    } catch (err) {
      alert("System Connection Error! Ensure Backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAdminAuth(false);
    localStorage.removeItem('isAdminAuth');
  };

  const resolveInquiry = async (id) => {
    try { await fetch(`${API_URL}/inquiries/${id}/resolve`, { method: 'PUT' }); } catch(e) {}
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, is_resolved: true } : inq));
  };

  const handleLogPayment = async (e) => {
    e.preventDefault();
    if (!paymentDraft.amount || !activeBookingForPayment) return;
    try {
      const res = await fetch(`${API_URL}/payments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...paymentDraft, 
          booking_id: activeBookingForPayment.id,
          amount: parseInt(paymentDraft.amount)
        })
      });
      if (res.ok) {
        alert("Payment logged successfully!");
        setShowPaymentModal(false);
        setPaymentDraft({ amount: '', method: 'Cash', notes: '' });
        // Refresh bookings
        const bRes = await fetch(`${API_URL}/bookings/`);
        const bData = await bRes.json();
        setBookings(Array.isArray(bData) ? bData : []);
      }
    } catch (e) { alert("Log payment failed."); }
  };

  // Advanced Booking Confirm & Payment Management
  const confirmBooking = async (id) => {
    try { 
      await fetch(`${API_URL}/bookings/${id}`, { 
        method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({status: "Confirmed"}) 
      }); 
    } catch(e) {}
    setBookings(bookings.map(book => book.id === id ? { ...book, status: "Confirmed" } : book));
    alert("Booking Confirmed! Notification sent to client.");
  };

  const updatePayment = async (id, total, paid) => {
    try { 
      await fetch(`${API_URL}/bookings/${id}`, { 
        method: 'PUT', headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({total_amount: parseInt(total), paid_amount: parseInt(paid)}) 
      }); 
    } catch(e) {}
    setBookings(bookings.map(book => book.id === id ? { ...book, total_amount: parseInt(total), paid_amount: parseInt(paid) } : book));
    alert("Payment Details Saved Successfully!");
  };

  // Granular Rental Returns with notes
  const [returnDrafts, setReturnDrafts] = useState({}); // { rental_id: { returned_quantity: 10, notes: "broken" } }
  
  const handleRentalDraftChange = (id, field, value) => {
    setReturnDrafts({ ...returnDrafts, [id]: { ...returnDrafts[id], [field]: value } });
  };

  const saveRentalUpdate = async (id, originalRental) => {
    const draft = returnDrafts[id];
    if (!draft) return;
    
    // Safety check max limits
    const addingReturn = parseInt(draft.returned_quantity || 0);
    const newTotalReturned = originalRental.returned_quantity + addingReturn;
    const finalReturn = Math.min(newTotalReturned, originalRental.quantity);
    
    try { 
      await fetch(`${API_URL}/rentals/${id}`, { 
        method: 'PUT', headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ returned_quantity: finalReturn, notes: draft.notes }) 
      }); 
    } catch(e) {}

    setRentals(rentals.map(r => r.id === id ? { ...r, returned_quantity: finalReturn, notes: draft.notes, is_returned: (finalReturn >= r.quantity) } : r));
    setReturnDrafts({ ...returnDrafts, [id]: { returned_quantity: 0, notes: draft.notes } });
    alert("Rental Update Saved!");
  };

  const calculateBill = async (bookingId) => {
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}/calculate-bill`, { method: 'POST' });
      const data = await res.json();
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, total_amount: data.total_amount } : b));
      alert(`Bill Calculated: ₹${data.total_amount}`);
    } catch (e) {
      alert("Failed to calculate bill");
    }
  };

  const addInventory = async (item) => {
    try {
      const res = await fetch(`${API_URL}/inventory/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      const newItem = await res.json();
      setInventory([...inventory, newItem]);
    } catch (e) { alert("Add Item failed"); }
  };

  const deleteInventory = async (id) => {
    if (window.confirm("Delete this item?")) {
      try { 
        await fetch(`${API_URL}/inventory/${id}`, { method: 'DELETE' }); 
        setInventory(inventory.filter(item => item.id !== id));
      } catch(e) { alert("Delete failed"); }
    }
  };

  const addClient = async (clientData) => {
    try {
      const res = await fetch(`${API_URL}/clients/`, {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...clientData, password: 'password123'}) // Default password for admin-created clients
      });
      const newClient = await res.json();
      setClients([...clients, newClient]);
      alert("Client registered successfully! Default password: password123");
    } catch(e) { alert("Failed to register client."); }
  };

  const deleteMedia = async (id) => {
    if (window.confirm("Bhai, pakka ye image/video delete karni hai?")) {
      try {
        await fetch(`${API_URL}/media/${id}`, { method: 'DELETE' });
        setMedia(media.filter(m => m.id !== id));
        alert("Media deleted successfully!");
      } catch (e) { alert("Delete failed!"); }
    }
  };

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 pt-24 text-slate-200">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
          <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500 mx-auto mb-6"><Lock size={32} /></div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Owner Access</h2>
          <p className="text-slate-400 text-sm text-center mb-8">Enter your secure credentials to manage records.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Admin Email</label>
              <input 
                type="email" 
                placeholder="admin@anjalitent.com" 
                value={loginEmail} 
                onChange={(e) => setLoginEmail(e.target.value)} 
                className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-brand-500 shadow-inner outline-none transition-all" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Admin Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={loginPassword} 
                onChange={(e) => setLoginPassword(e.target.value)} 
                className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white focus:border-brand-500 shadow-inner outline-none transition-all" 
                required 
              />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => alert("Please contact system developer to reset Admin password.")} className="text-[10px] text-slate-500 hover:text-brand-400 font-bold uppercase tracking-widest">Forgot Password?</button>
            </div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-gradient-to-tr from-brand-600 to-brand-400 text-slate-950 font-black rounded-xl hover:scale-[1.01] transition-transform shadow-xl shadow-brand-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-2"
            >
              {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Admin Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'bookings', name: 'Bookings & Bills', icon: <CalendarRange size={20} /> },
    { id: 'inventory', name: 'Inventory & Rental', icon: <Box size={20} /> },
    { id: 'clients', name: 'Client Database', icon: <Users size={20} /> },
    { id: 'media', name: 'Media Library', icon: <ImageIcon size={20} /> },
    { id: 'inquiries', name: 'Client Consults', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar fixed top-0 pt-24 perfectly clears the global header */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 fixed h-full top-0 pt-24 shadow-2xl z-10 hidden lg:block overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-slate-950">A</span>
            Admin <span className="text-brand-400">Panel</span>
          </h2>
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                {tab.icon} {tab.name}
              </button>
            ))}
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-all mt-10">
              <Lock size={20} /> Logout Session
            </button>
          </nav>
        </div>
      </div>

      <div className="flex-1 lg:ml-64 pt-28 p-4 lg:p-10 pb-24 w-full min-h-screen transition-all overflow-x-hidden">
        {/* Global Search & Action Bar */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/50 p-6 rounded-[2rem] border border-slate-800 backdrop-blur-sm">
          <div className="relative w-full md:w-96 text-slate-400 focus-within:text-brand-400 transition-colors">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50"><Box size={20} /></span>
            <input 
              type="text" 
              placeholder={`Search ${activeTab === 'overview' ? 'anything' : activeTab}...`} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 pr-12 outline-none focus:border-brand-500 transition-all font-medium"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => fetchData()} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2">
              Refresh Data
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white">Administration Dashboard</h1>
                  <p className="text-slate-400 mt-1">Full control over bookings, finances, and rental inventory.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Active Bookings" value={stats.counts?.bookings || 0} icon={<CalendarRange size={24} />} color="text-brand-400" bg="bg-brand-500/10" />
                <StatCard title="Dispatched Rentals" value={stats.counts?.inventory || 0} icon={<Package size={24} />} color="text-amber-400" bg="bg-amber-500/10" />
                <StatCard title="Total Inquiries" value={stats.counts?.inquiries || 0} icon={<MessageSquare size={24} />} color="text-green-400" bg="bg-green-500/10" />
                <StatCard title="Gross Income" value={`₹${bookings.reduce((acc, b) => acc + (b.paid_amount||0), 0)}`} icon={<DollarSign size={24} />} color="text-emerald-400" bg="bg-emerald-500/10" />
              </div>

              {/* RECENT ACTIVITY */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <CheckCircle size={20} className="text-brand-500" /> Recent System Activity
                  </h3>
                  <div className="space-y-4">
                    {stats.recent_activity?.length > 0 ? stats.recent_activity.map((act, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/50 hover:border-brand-500/30 transition-all">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-brand-400 font-bold">
                          {act.type[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-slate-200 font-medium">{act.message}</p>
                          <p className="text-xs text-slate-500 mt-1">{new Date(act.time).toLocaleString()}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="text-slate-500 italic">No recent activity detected.</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-brand-600 to-brand-400 p-8 rounded-[2.5rem] shadow-xl text-slate-950 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-black mb-2 italic">Anjali Tent</h3>
                    <p className="font-bold text-sm opacity-80 uppercase tracking-widest leading-tight">Professional Event Management System v2.0</p>
                  </div>
                  <div className="mt-8">
                    <p className="text-3xl font-black">Stable</p>
                    <p className="text-xs font-bold uppercase opacity-60">Backend Sync: Active</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BOOKINGS & PAYMENTS */}
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                <h1 className="text-3xl font-bold text-white">Bookings & Financial Management</h1>
                <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  {['all', 'Pending', 'Confirmed'].map(f => (
                    <button key={f} onClick={() => setBookingFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${bookingFilter === f ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}>
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {bookings.filter(b => 
                  (bookingFilter === 'all' || b.status === bookingFilter) &&
                  (b.event_type?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  b.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  b.client?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map(book => (
                  <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8 border-b border-slate-800 pb-6">
                      
                      <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border font-bold ${book.status==='Confirmed' ? 'border-green-500/30 bg-green-500/10 text-green-500' : 'border-brand-500/30 bg-brand-500/10 text-brand-500'}`}>
                          <span className="text-xs">{new Date(book.event_date).toLocaleString('default',{month:'short'})}</span>
                          <span className="text-xl">{new Date(book.event_date).getDate()}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-1"><span className="text-slate-500 font-normal mr-2">#{book.id}</span>{book.event_type} at {book.venue}</h3>
                          <div className="flex gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1"><Users size={16}/> {book.client?.name}</span>
                            <span>📞 {book.client?.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      {book.status === 'Pending' ? (
                        <button onClick={() => confirmBooking(book.id)} className="px-6 py-3 bg-brand-500 text-slate-950 font-bold rounded-xl hover:bg-brand-400 shadow-lg flex items-center gap-2">
                          <CheckCircle size={20} /> Approve & Notify Client
                        </button>
                      ) : (
                        <div className="px-6 py-3 bg-green-500/10 text-green-400 font-bold border border-green-500/30 rounded-xl flex items-center gap-2">
                          <CheckCircle size={20} /> Confirmed (Active)
                        </div>
                      )}
                    </div>

                    {/* Payment Management Form */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-end">
                        <span className="text-[10px] text-slate-500 mb-1 font-bold uppercase tracking-widest">Gross Total</span>
                        <input 
                          type="number" 
                          defaultValue={book.total_amount} 
                          id={`total-${book.id}`}
                          className="text-xl font-bold text-white bg-transparent outline-none w-full border-b border-slate-800 focus:border-brand-500 pb-1"
                        />
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-end">
                        <span className="text-[10px] text-green-500/70 mb-1 font-bold uppercase tracking-widest">Total Received</span>
                        <p className="text-xl font-bold text-green-400">₹{(book.paid_amount || 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-end">
                        <span className="text-[10px] text-brand-500/70 mb-1 font-bold uppercase tracking-widest">Balance Due</span>
                        <p className={`text-xl font-black ${book.total_amount - (book.paid_amount||0) > 0 ? 'text-brand-400' : 'text-slate-600'}`}>₹{(book.total_amount - (book.paid_amount || 0)).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button 
                          onClick={() => {
                            setActiveBookingForPayment(book);
                            setShowPaymentModal(true);
                          }}
                          className="w-full py-3 bg-brand-500 text-slate-950 font-black rounded-xl hover:bg-brand-400 transition-all text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-brand-500/10"
                        >
                          Log New Payment
                        </button>
                        <button 
                          onClick={() => updatePayment(book.id, document.getElementById(`total-${book.id}`).value, book.paid_amount)}
                          className="w-full py-2 bg-slate-800 text-slate-400 font-bold rounded-xl hover:text-white transition-colors text-[10px] uppercase tracking-widest"
                        >
                          Update Gross
                        </button>
                      </div>
                    </div>

                    {/* PAYMENT HISTORY IN ADMIN */}
                    {book.payments?.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-800/50">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Payment Log History</p>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {book.payments.map(pay => (
                              <div key={pay.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                                 <div>
                                    <p className="text-[10px] text-slate-500 font-bold">{new Date(pay.payment_date).toLocaleDateString()}</p>
                                    <p className="text-xs text-white font-medium">{pay.payment_method}</p>
                                 </div>
                                 <p className="text-sm font-bold text-green-400">₹{pay.amount.toLocaleString()}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* RENTALS & RETURNS */}
          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Inventory & Rental Tracking</h1>
                <button 
                  onClick={() => {
                    const name = prompt("Item Name:");
                    const category = prompt("Category (Tent/Catering/etc):");
                    const total = parseInt(prompt("Total Quantity:"));
                    const rent = parseInt(prompt("Rent Per Day:"));
                    if (name && category && total) addInventory({ name, category, total_quantity: total, rent_per_day: rent });
                  }}
                  className="px-6 py-3 bg-brand-500 text-slate-950 font-bold rounded-xl hover:bg-brand-400 shadow-lg flex items-center gap-2"
                >
                  <Plus size={20} /> Add New Item
                </button>
              </div>
              <div className="space-y-6">
                {inventory.filter(item => 
                   item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   item.category?.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(item => (
                  <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-slate-500">{item.category} • ₹{item.rent_per_day}/day</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-brand-400">{item.available_quantity}/{item.total_quantity}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Available</p>
                      </div>
                      <button onClick={() => deleteInventory(item.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                        <Box size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <hr className="border-slate-800 my-10" />
                <h2 className="text-2xl font-bold text-white mb-6">Active Rentals & Returns</h2>
                
                <div className="space-y-6">
                {rentals.filter(r => 
                  r.item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  r.booking_id?.toString().includes(searchQuery) ||
                  r.notes?.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(rental => {
                  const draft = returnDrafts[rental.id] || {};
                  const isOverdue = !rental.is_returned && new Date(rental.expected_return_date) < new Date();
                  return (
                    <div key={rental.id} className={`p-6 md:p-8 rounded-3xl border shadow-xl transition-all ${rental.is_returned ? 'bg-slate-900/40 border-green-500/20' : isOverdue ? 'bg-red-500/5 border-red-500/30 shadow-red-500/5' : 'bg-slate-900 border-slate-800'}`}>
                      <div className="flex flex-col lg:flex-row justify-between mb-6 border-b border-slate-800/50 pb-6 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                             <h3 className="text-xl font-bold text-white">{rental.quantity}x {rental.item?.name}</h3>
                             {isOverdue && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded uppercase animate-pulse">Overdue</span>}
                          </div>
                          <div className="text-sm text-slate-400 flex flex-wrap gap-x-6 gap-y-2">
                            <span>Booking ID: <span className="text-white font-mono">#{rental.booking_id}</span></span>
                            <span>Rented: <span className="text-white">{rental.rented_date}</span></span>
                            <span className={`${isOverdue ? 'text-red-400 font-black' : 'text-brand-400 font-bold'}`}>Expected Return: {rental.expected_return_date}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-white">{rental.returned_quantity} <span className="text-xl text-slate-500 font-normal">/ {rental.quantity}</span></div>
                          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Returned Successfully</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-400">Log New Returns</label>
                          <input 
                            type="number" min="0" max={rental.quantity - rental.returned_quantity}
                            placeholder="Units returned"
                            value={draft.returned_quantity !== undefined ? draft.returned_quantity : ""}
                            onChange={(e) => handleRentalDraftChange(rental.id, 'returned_quantity', e.target.value)}
                            disabled={rental.is_returned}
                            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-brand-500 disabled:opacity-50"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-bold text-slate-400">Admin Notes (Damages, Partial Status)</label>
                          <div className="flex gap-4">
                            <input 
                              type="text" 
                              placeholder="e.g. 5 chairs broken..."
                              value={draft.notes !== undefined ? draft.notes : (rental.notes || "")}
                              onChange={(e) => handleRentalDraftChange(rental.id, 'notes', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-brand-500"
                            />
                            {!rental.is_returned ? (
                              <button onClick={() => saveRentalUpdate(rental.id, rental)} className="bg-brand-500 text-slate-950 font-bold px-8 rounded-xl shadow-lg hover:bg-brand-400">
                                Save Log
                              </button>
                            ) : (
                              <button onClick={() => saveRentalUpdate(rental.id, rental)} className="bg-slate-800 text-slate-400 font-bold px-8 rounded-xl hover:text-white">
                                Update Note
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* CLIENT DATABASE */}
          {activeTab === 'clients' && (
            <motion.div key="clients" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Client Management</h1>
                <button 
                  onClick={() => {
                    const name = prompt("Client Name:");
                    const email = prompt("Client Email:");
                    const phone = prompt("Client Phone:");
                    const address = prompt("Client Address:");
                    if (name && email) addClient({ name, email, phone, address });
                  }}
                  className="px-6 py-3 bg-brand-500 text-slate-950 font-bold rounded-xl hover:bg-brand-400 shadow-lg flex items-center gap-2"
                >
                  <Plus size={20} /> Register New Client
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.filter(c => 
                    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.phone?.includes(searchQuery)
                  ).map(client => (
                  <div key={client.id} className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={80}/></div>
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-400 font-bold text-xl">{client.name?.charAt(0) || "?"}</div>
                       <div>
                          <h3 className="font-bold text-white text-lg">{client.name || "Unknown Client"}</h3>
                          <p className="text-xs text-slate-500 font-mono">ID: #{client.id || "0"}2024</p>
                       </div>
                    </div>
                    <div className="space-y-3 mb-6">
                       <div className="flex items-center gap-3 text-sm text-slate-400">
                          <Mail size={16} className="text-brand-500/50" /> {client.email}
                       </div>
                       <div className="flex items-center gap-3 text-sm text-slate-400">
                          <Phone size={16} className="text-brand-500/50" /> {client.phone || "No phone"}
                       </div>
                       <div className="flex items-center gap-3 text-sm text-slate-400">
                          <MapPin size={16} className="text-brand-500/50" /> {client.address || "No address"}
                       </div>
                    </div>
                    <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                       <span className="text-[10px] uppercase font-black text-brand-500 tracking-widest">Active Client</span>
                       <button className="text-[10px] uppercase font-bold text-slate-500 hover:text-white">View Bookings</button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <motion.div key="media" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white mb-8 text-glow">Gallery & Media Assets</h1>
              
              {/* POSTING FORM (MOVED HERE) */}
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-xl mb-12 border-t-brand-500/30">
                  <div className="flex items-center gap-3 mb-8">
                     <Plus className="text-brand-500" />
                     <h3 className="text-xl font-bold text-white">Add New Gallery Item</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Media Title</label>
                         <input 
                           type="text" 
                           placeholder="e.g. Royal Wedding Hall Setup"
                           value={mediaForm.title}
                           onChange={(e) => setMediaForm({...mediaForm, title: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-brand-500 outline-none transition-all"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Display Category</label>
                         <select 
                           value={mediaForm.category}
                           onChange={(e) => setMediaForm({...mediaForm, category: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-brand-500 outline-none"
                         >
                           {['Tent', 'Catering', 'Flower', 'Event', 'Decoration', 'Lighting'].map(cat => (
                             <option key={cat} value={cat}>{cat}</option>
                           ))}
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Description (Internal or Caption)</label>
                         <textarea 
                           placeholder="Describe the setup..."
                           rows="3"
                           value={mediaForm.description}
                           onChange={(e) => setMediaForm({...mediaForm, description: e.target.value})}
                           className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-brand-500 outline-none resize-none"
                         />
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 border-dashed h-full flex flex-col justify-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-center">Step 2: Select & Process File</label>
                        <div className="grid grid-cols-1 gap-4">
                           <CloudinaryUpload 
                             uploadType="image" 
                             category={mediaForm.category}
                             onUploadSuccess={async (url, cat, data) => { 
                               if (!mediaForm.title) return alert("Bhai, pehle Title toh likh lo!");
                               try {
                                 const res = await fetch(`${API_URL}/media/`, {
                                   method: 'POST',
                                   headers: { 'Content-Type': 'application/json' },
                                   body: JSON.stringify({
                                     url: url,
                                     public_id: data.public_id,
                                     title: mediaForm.title,
                                     category: mediaForm.category,
                                     description: mediaForm.description
                                   })
                                 });
                                 if (res.ok) {
                                   const newM = await res.json();
                                   setMedia([...media, newM]);
                                   alert("✅ Masterpiece added!");
                                   setMediaForm({ title: '', description: '', category: 'Tent', isUploading: false });
                                 }
                               } catch (err) { alert("Database Error!"); }
                             }} 
                           />
                           <CloudinaryUpload 
                             uploadType="video" 
                             category={mediaForm.category}
                             onUploadSuccess={async (url, cat, data) => { 
                               if (!mediaForm.title) return alert("Bhai, pehle Title toh likh lo!");
                               try {
                                 const res = await fetch(`${API_URL}/media/`, {
                                   method: 'POST',
                                   headers: { 'Content-Type': 'application/json' },
                                   body: JSON.stringify({
                                     url: url,
                                     public_id: data.public_id,
                                     title: mediaForm.title,
                                     category: mediaForm.category,
                                     description: mediaForm.description
                                   })
                                 });
                                 if (res.ok) {
                                   const newM = await res.json();
                                   setMedia([...media, newM]);
                                   alert("✅ Video added!");
                                   setMediaForm({ title: '', description: '', category: 'Tent', isUploading: false });
                                 }
                               } catch (err) { alert("Database Error!"); }
                             }} 
                           />
                        </div>
                      </div>
                    </div>
                  </div>
              </div>

              {/* LISTING OF MEDIA */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {media.filter(m => 
                  m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  m.category?.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(m => (
                  <div key={m.id} className="group relative bg-slate-900 rounded-[2rem] border border-slate-800 overflow-hidden shadow-xl hover:border-brand-500/50 transition-all">
                    <div className="aspect-video bg-slate-950 relative">
                       {m.url.includes('.mp4') || m.url.includes('.mov') ? (
                          <video src={m.url} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                       ) : (
                          <img src={m.url} alt={m.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent flex flex-col justify-end p-6">
                          <span className="text-[10px] font-black uppercase text-brand-500 tracking-widest mb-1">{m.category}</span>
                          <h4 className="text-white font-bold leading-tight">{m.title}</h4>
                       </div>
                    </div>
                    <div className="p-4 flex justify-between items-center">
                       <p className="text-[10px] text-slate-500 font-mono">#{m.id}</p>
                       <button onClick={() => deleteMedia(m.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><X size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* INQUIRIES & CONSULT */}
          {activeTab === 'inquiries' && (
            <motion.div key="inquiries" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white mb-8">Client Consultations</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {inquiries.filter(i => 
                  i.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  i.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  i.message?.toLowerCase().includes(searchQuery.toLowerCase())
                ).map(inq => (
                  <div key={inq.id} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
                    <div className="mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-xl text-white">{inq.name}</h3>
                          <p className="text-brand-500 text-xs font-bold uppercase tracking-widest">{inq.service}</p>
                        </div>
                        {!inq.is_resolved ? (
                          <span className="px-3 py-1 bg-brand-500/10 text-brand-500 border border-brand-500/20 rounded-full text-xs font-bold animate-pulse">New Ticket</span>
                        ) : (
                          <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold">Resolved</span>
                        )}
                      </div>
                      <p className="text-slate-300 text-sm mb-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">"{inq.message}"</p>
                      <div className="text-xs text-slate-500 space-y-2">
                        <p>{inq.phone} • {inq.email}</p>
                        <p className="font-mono">Received: {new Date(inq.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    {!inq.is_resolved && (
                      <button onClick={() => resolveInquiry(inq.id)} className="w-full py-4 bg-slate-950 border-t border-slate-800 font-bold rounded-xl text-brand-500 hover:bg-brand-500 hover:text-slate-950 transition-colors">
                        Mark as Addressed
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 z-50 flex justify-around">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === tab.id ? 'text-brand-500 bg-brand-500/10' : 'text-slate-500'}`}>
            {tab.icon} <span className="text-[10px] font-bold">{tab.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceModal 
            booking={selectedInvoice} 
            onClose={() => setSelectedInvoice(null)} 
          />
        )}
      </AnimatePresence>

      {/* PAYMENT LOG MODAL */}
      <AnimatePresence>
        {showPaymentModal && activeBookingForPayment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Log New <span className="text-brand-500">Payment</span></h2>
              <p className="text-slate-500 text-sm mb-8 font-light uppercase tracking-widest">Booking #{activeBookingForPayment.id} • {activeBookingForPayment.client?.name}</p>
              
              <form onSubmit={handleLogPayment} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Amount (₹)</label>
                   <input 
                     type="number" 
                     placeholder="Enter amount"
                     value={paymentDraft.amount} 
                     onChange={(e) => setPaymentDraft({...paymentDraft, amount: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-brand-500 outline-none text-xl font-bold" 
                     required
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Payment Method</label>
                   <select 
                     value={paymentDraft.method}
                     onChange={(e) => setPaymentDraft({...paymentDraft, method: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-brand-500 outline-none"
                   >
                     <option>Cash</option>
                     <option>UPI / PhonePe / GPay</option>
                     <option>Bank Transfer</option>
                     <option>Check</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Internal Note (Optional)</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Received in advance"
                     value={paymentDraft.notes} 
                     onChange={(e) => setPaymentDraft({...paymentDraft, notes: e.target.value})}
                     className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:border-brand-500 outline-none" 
                   />
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 py-5 bg-brand-500 text-slate-950 font-black rounded-2xl shadow-xl hover:bg-brand-400 uppercase tracking-widest text-sm">Record Payment</button>
                  <button type="button" onClick={() => setShowPaymentModal(false)} className="px-6 py-5 border border-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-800 uppercase tracking-widest text-sm text-[10px]">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InvoiceModal = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 lg:p-10"
    >
      <div className="bg-white text-slate-950 w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
        <div className="bg-slate-100 p-4 border-b flex justify-between items-center print:hidden">
            <h2 className="font-bold flex items-center gap-2 text-slate-700">
                <Box size={20}/> PREVIEW: INVOICE #{booking.id}
            </h2>
            <div className="flex gap-3">
                <button onClick={handlePrint} className="px-5 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 flex items-center gap-2">
                    <Send size={18}/> Print / PDF
                </button>
                <button onClick={onClose} className="px-5 py-2 bg-slate-200 text-slate-800 rounded-lg font-bold hover:bg-slate-300">
                    Close
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 lg:p-16 print:p-0" id="printable-invoice">
            <div className="flex justify-between items-start mb-16">
                <div>
                   <h1 className="text-4xl font-serif font-black tracking-tight text-slate-900 mb-2">
                    Anjali Tent <span className="text-brand-600">& Caterers</span>
                   </h1>
                   <p className="text-slate-500 text-sm">Premium Event Rental Services • Lucknow</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-400 mb-1">Invoice</h2>
                    <p className="font-mono text-slate-900 font-bold">#{booking.id}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-16">
                <div>
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest">Bill To:</h4>
                    <p className="text-xl font-bold text-slate-900">{booking.client?.name}</p>
                    <p className="text-slate-600">{booking.client?.phone}</p>
                    <p className="text-slate-500 text-sm mt-1">{booking.client?.address || "Customer Address Not Provided"}</p>
                </div>
                <div className="text-right">
                    <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest">Event Details:</h4>
                    <p className="text-lg font-bold text-slate-900">{booking.event_type} @ {booking.venue}</p>
                    <p className="text-brand-600 font-bold">{new Date(booking.event_date).toLocaleDateString()}</p>
                </div>
            </div>

            <table className="w-full mb-16 border-collapse">
                <thead>
                    <tr className="border-b-2 border-slate-950">
                        <th className="py-4 text-left font-bold uppercase text-[10px] tracking-widest">Description</th>
                        <th className="py-4 text-center font-bold uppercase text-[10px] tracking-widest">Rate</th>
                        <th className="py-4 text-center font-bold uppercase text-[10px] tracking-widest">Qty</th>
                        <th className="py-4 text-center font-bold uppercase text-[10px] tracking-widest">Days</th>
                        <th className="py-4 text-right font-bold uppercase text-[10px] tracking-widest">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {booking.rentals?.map((rental, idx) => {
                        const duration = Math.max(1, (new Date(rental.expected_return_date) - new Date(rental.rented_date)) / (1000 * 60 * 60 * 24));
                        const rate = rental.item?.rent_per_day || 0;
                        const subtotal = rate * rental.quantity * duration;
                        return (
                            <tr key={idx} className="border-b border-slate-100 italic">
                                <td className="py-6 font-medium text-slate-800">{rental.item?.name}</td>
                                <td className="py-6 text-center text-slate-500">₹{rate}</td>
                                <td className="py-6 text-center text-slate-500">{rental.quantity}</td>
                                <td className="py-6 text-center text-slate-500">{duration}</td>
                                <td className="py-6 text-right font-bold text-slate-900">₹{subtotal.toLocaleString()}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-4">
                    <div className="flex justify-between py-2 border-b border-slate-100 text-slate-500">
                        <span>Subtotal</span>
                        <span className="font-bold">₹{(booking.total_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100 text-green-600 font-medium">
                        <span>Paid Amount</span>
                        <span className="font-bold">- ₹{(booking.paid_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-4 text-2xl font-black bg-slate-50 px-4 rounded-xl text-slate-950">
                        <span>Balance</span>
                        <span className="text-brand-600">₹{(booking.total_amount - (booking.paid_amount || 0)).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="mt-24 border-t-2 border-slate-100 pt-10 text-center text-slate-400 text-[10px] uppercase font-bold tracking-[0.3em]">
                Thank you for choosing Anjali Tent & Caterers
            </div>
        </div>
      </div>

      <style>{`
        @media print {
            body * {
                visibility: hidden;
            }
            #printable-invoice, #printable-invoice * {
                visibility: visible;
            }
            #printable-invoice {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white;
                color: black;
            }
        }
      `}</style>
    </motion.div>
  );
};

const StatCard = ({ title, value, icon, color, bg }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center gap-5">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bg} ${color}`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
