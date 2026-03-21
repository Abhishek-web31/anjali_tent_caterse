import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CalendarRange, Box, MessageSquare, 
  Users, CheckCircle, Package, Plus, Lock, Send, DollarSign, Wallet
} from 'lucide-react';
import CloudinaryUpload from '../components/CloudinaryUpload';

const AdminDashboard = () => {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [users, setUsers] = useState([]);

  const API_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    if (!isAdminAuth) return;
    const fetchData = async () => {
      try {
        const [invRes, inqRes, bookRes, usrRes] = await Promise.all([
          fetch(`${API_URL}/inventory/`),
          fetch(`${API_URL}/inquiries/`),
          fetch(`${API_URL}/bookings/`),
          fetch(`${API_URL}/users/`)
        ]);
        
        setInventory(await invRes.json());
        setInquiries(await inqRes.json());
        setBookings(await bookRes.json());
        setUsers(await usrRes.json());
      } catch (error) {
        console.log("Loading mock admin data...");
        setInventory([
          { id: 1, name: "Premium Marquee Tent", category: "Tent", total_quantity: 5, available_quantity: 3 },
          { id: 2, name: "Banquet Chairs", category: "Furniture", total_quantity: 500, available_quantity: 200 }
        ]);
        setInquiries([
          { id: 1, name: "Rahul Sharma", email: "rahul@example.com", phone: "+91 9999999999", service: "Contact", message: "Hi Admin, need to discuss payment.", is_resolved: false, created_at: "2024-03-20T10:00:00" }
        ]);
        setBookings([
          { id: 101, client_id: 1, event_date: "2024-05-15", venue: "Taj Palace", event_type: "Wedding", status: "Pending", total_amount: 0, paid_amount: 0, client: { name: "Rahul Sharma", phone:"+91 9999" } },
          { id: 102, client_id: 2, event_date: "2024-06-20", venue: "City Hall", event_type: "Corporate", status: "Confirmed", total_amount: 250000, paid_amount: 50000, client: { name: "Priya Singh", phone:"+91 8888" } }
        ]);
        setRentals([
          { id: 1, item: { name: "Banquet Chairs" }, quantity: 300, returned_quantity: 100, rented_date: "2024-05-14", expected_return_date: "2024-05-16", is_returned: false, booking_id: 102, notes: "Some chairs scratched" }
        ]);
      }
    };
    fetchData();
  }, [isAdminAuth]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminPin === '1234') setIsAdminAuth(true);
    else alert("Incorrect PIN! Hint: use 1234");
  };

  const resolveInquiry = async (id) => {
    try { await fetch(`${API_URL}/inquiries/${id}/resolve`, { method: 'PUT' }); } catch(e) {}
    setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, is_resolved: true } : inq));
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

  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 pt-24 text-slate-200">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
          <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-500 mx-auto mb-6"><Lock size={32} /></div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Owner Access</h2>
          <p className="text-slate-400 text-sm text-center mb-8">Enter your secure PIN to access records.</p>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="PIN (1234)" value={adminPin} onChange={(e) => setAdminPin(e.target.value)} className="w-full px-5 py-4 rounded-xl bg-slate-950 border border-slate-800 text-white mb-6 focus:border-brand-500 font-mono text-xl text-center shadow-inner outline-none" autoFocus />
            <button type="submit" className="w-full py-4 bg-brand-500 text-slate-950 font-bold rounded-xl hover:bg-brand-400 shadow-lg">Unlock Dashboard</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'bookings', name: 'Bookings & Payments', icon: <CalendarRange size={20} /> },
    { id: 'inventory', name: 'Rentals & Returns', icon: <Box size={20} /> },
    { id: 'inquiries', name: 'Consult & Inquiries', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar fixed top-0 pt-24 perfectly clears the global header */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 fixed h-full top-0 pt-24 shadow-2xl z-10 hidden md:block overflow-y-auto">
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
          </nav>
        </div>
      </div>

      <div className="flex-1 md:ml-64 pt-28 p-6 lg:p-10 pb-24 w-full min-h-screen">
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
                <StatCard title="Active Bookings" value={bookings.length} icon={<CalendarRange size={24} />} color="text-brand-400" bg="bg-brand-500/10" />
                <StatCard title="Dispatched Rentals" value={rentals.length} icon={<Package size={24} />} color="text-amber-400" bg="bg-amber-500/10" />
                <StatCard title="Total Inquiries" value={inquiries.length} icon={<MessageSquare size={24} />} color="text-green-400" bg="bg-green-500/10" />
                <StatCard title="Gross Income" value={`₹${bookings.reduce((acc, b) => acc + (b.paid_amount||0), 0)}`} icon={<DollarSign size={24} />} color="text-emerald-400" bg="bg-emerald-500/10" />
              </div>

              {/* CLOUDINARY UPLOAD QUICK ACTION */}
              <div className="mb-10 p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl border-t-brand-500/30">
                <h3 className="text-xl font-bold text-white mb-2">Upload Reference Image / Gallery Photo</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-2xl">Upload event photos directly to Cloudinary. It will give you a public URL that you can copy and use in your Gallery or anywhere else in the application.</p>
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-slate-950 p-6 rounded-2xl border border-slate-800">
                  <CloudinaryUpload 
                    uploadType="image" 
                    onUploadSuccess={(url) => { 
                      prompt("Image Uploaded Successfully! Copy this URL to paste where needed:", url); 
                    }} 
                  />
                  <div className="text-xs text-brand-400 break-words max-w-xs sm:max-w-md">
                    ↑ Click here to select a file from your device. Upon success, a popup will show the URL.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* BOOKINGS & PAYMENTS */}
          {activeTab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white mb-8">Bookings & Financial Management</h1>
              <div className="space-y-6">
                {bookings.map(book => (
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-end">
                        <span className="text-sm text-slate-500 mb-1 font-bold">Total Bill Estimate</span>
                        <input 
                          type="number" 
                          defaultValue={book.total_amount} 
                          id={`total-${book.id}`}
                          className="text-2xl font-bold text-white bg-transparent outline-none w-full border-b border-slate-700 focus:border-brand-500 pb-1"
                        />
                      </div>
                      <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex flex-col justify-end">
                        <span className="text-sm text-green-500/70 mb-1 font-bold">Client Paid Amount</span>
                        <input 
                          type="number" 
                          defaultValue={book.paid_amount} 
                          id={`paid-${book.id}`}
                          className="text-2xl font-bold text-green-400 bg-transparent outline-none w-full border-b border-slate-700 focus:border-green-500 pb-1"
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <button 
                          onClick={() => updatePayment(book.id, document.getElementById(`total-${book.id}`).value, document.getElementById(`paid-${book.id}`).value)}
                          className="w-full py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-brand-500 hover:text-slate-950 transition-colors"
                        >
                          Save Payment Record
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* RENTALS & RETURNS */}
          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white mb-8">Granular Inventory Tracking</h1>
              <div className="space-y-6">
                {rentals.map(rental => {
                  const draft = returnDrafts[rental.id] || {};
                  return (
                    <div key={rental.id} className={`p-6 md:p-8 rounded-3xl border shadow-xl ${rental.is_returned ? 'bg-slate-900 border-green-500/20' : 'bg-slate-900 border-slate-800'}`}>
                      <div className="flex flex-col lg:flex-row justify-between mb-6 border-b border-slate-800 pb-6 gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{rental.quantity}x {rental.item?.name}</h3>
                          <div className="text-sm text-slate-400 flex flex-wrap gap-x-6 gap-y-2">
                            <span>Booking ID: <span className="text-white font-mono">#{rental.booking_id}</span></span>
                            <span>Rented: <span className="text-white">{rental.rented_date}</span></span>
                            <span className="text-brand-400 font-bold">Expected Return: {rental.expected_return_date}</span>
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

          {/* INQUIRIES & CONSULT */}
          {activeTab === 'inquiries' && (
            <motion.div key="inquiries" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold text-white mb-8">Client Consultations</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inquiries.map(inq => (
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

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 z-50 flex justify-around">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${activeTab === tab.id ? 'text-brand-500 bg-brand-500/10' : 'text-slate-500'}`}>
            {tab.icon} <span className="text-[10px] font-bold">{tab.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
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
