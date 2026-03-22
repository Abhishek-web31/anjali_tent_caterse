import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ArrowLeft, Tent, Utensils, Flower2, PartyPopper, Palette, Lightbulb } from 'lucide-react';

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    {
      id: 'Tent',
      title: 'Luxury Tents',
      icon: <Tent size={40} />,
      video: 'https://res.cloudinary.com/dwohs6fpq/video/upload/v1774117121/1736604792771_x0kf6y.mp4'
    },
    { id: 'Catering', title: 'Exquisite Catering', icon: <Utensils size={40} />, cover: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80' },
    { id: 'Flower', title: 'Flower Decor', icon: <Flower2 size={40} />, video: 'https://res.cloudinary.com/dwohs6fpq/video/upload/v1774174042/wisqvqejx1dzrosqof5r.mp4' },
    { id: 'Event', title: 'Grand Events', icon: <PartyPopper size={40} />, cover: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80' },
    { id: 'Decoration', title: 'Bespoke Decoration', icon: <Palette size={40} />, cover: 'https://res.cloudinary.com/dwohs6fpq/image/upload/v1774085517/IMG-20250831-WA0031_wrqcnk.jpg' },
    { id: 'Lighting', title: 'Ambient Lighting', icon: <Lightbulb size={40} />, video: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80' },
  ];

  const API_URL = 'https://anjali-tent-backend.onrender.com';

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(`${API_URL}/media/`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setItems(data);
          } else {
            useFallbackData();
          }
        } else {
          useFallbackData();
        }
      } catch (error) {
        console.error("Failed to fetch media, using fallback:", error);
        useFallbackData();
      } finally {
        setIsLoading(false);
      }
    };

    const useFallbackData = () => {
      setItems([
        { id: 10, url: 'https://res.cloudinary.com/dwohs6fpq/image/upload/v1774085517/IMG-20250831-WA0031_wrqcnk.jpg', category: 'Decoration', title: 'Golden Mandap Setup' },
        { id: 11, url: 'https://res.cloudinary.com/dwohs6fpq/video/upload/v1774086465/vi_empnl2.mp4', category: 'Event', title: 'Live Performance' },
        { id: 2, url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80', category: 'Catering', title: 'Gourmet Dessert' },
        { id: 3, url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80', category: 'Tent', title: 'Royal Marquee' },
        { id: 4, url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80', category: 'Lighting', title: 'Warm Ambience' },
        { id: 5, url: 'https://images.unsplash.com/photo-1533143708019-ea5cfa80213e?auto=format&fit=crop&q=80', category: 'Catering', title: 'Buffet Setup' },
        { id: 6, url: 'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&q=80', category: 'Tent', title: 'Outdoor Gazebo' },
        { id: 7, url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80', category: 'Flower', title: 'Rose Entrance' },
      ]);
    };

    fetchMedia();
  }, []);

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-20 -mt-24 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center mix-blend-luminosity grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center pt-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 text-glow">Portfolio</h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-light italic">
              A curated collection of our finest work, categorized for your inspiration.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -10 }}
                  className="group relative h-80 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-2xl border border-white/5"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.video ? (
                    <video
                      src={cat.video}
                      autoPlay muted loop playsInline
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <img src={cat.cover} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 rounded-2xl bg-brand-500/10 backdrop-blur-md flex items-center justify-center mb-6 text-brand-400 group-hover:bg-brand-500 group-hover:text-slate-950 transition-all duration-500 border border-brand-500/20">
                      {cat.icon}
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-white mb-2 tracking-tight group-hover:text-brand-300 transition-colors">{cat.title}</h3>
                    <p className="text-brand-500/80 text-sm font-bold uppercase tracking-[0.2em]">{items.filter(item => item.category === cat.id).length} Masterpieces</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-brand-500 hover:text-slate-950 transition-all mb-12 font-bold group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Categories
              </button>

              <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-serif font-bold text-white text-glow">
                  {categories.find(c => c.id === selectedCategory)?.title}
                </h2>
                <div className="h-px flex-grow bg-gradient-to-r from-brand-500/50 to-transparent ml-8 hidden md:block"></div>
              </div>

              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredItems.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      className="relative group rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3] cursor-pointer bg-slate-900 border border-white/5"
                      onClick={() => setSelectedImg(item)}
                    >
                      {item.url.includes('/video/') || item.url.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={item.url} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                      ) : (
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                        <h3 className="text-white text-2xl font-serif font-bold flex items-center justify-between">
                          {item.title}
                          <ZoomIn size={24} className="text-brand-500" />
                        </h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 glass rounded-[3rem]">
                  <p className="text-slate-500 text-xl font-light italic">No masterpieces found in this category yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/98 backdrop-blur-2xl p-4 md:p-12"
            onClick={() => setSelectedImg(null)}
          >
            <button className="absolute top-8 right-8 text-white/50 hover:text-white bg-white/5 p-4 rounded-full transition-all border border-white/10" onClick={() => setSelectedImg(null)}>
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImg.url.includes('/video/') || selectedImg.url.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={selectedImg.url} controls autoPlay className="w-full object-contain bg-slate-900" />
              ) : (
                <img src={selectedImg.url} alt={selectedImg.title} className="w-full object-contain bg-slate-900" />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-black/80 backdrop-blur-md">
                <h2 className="text-white text-3xl font-serif font-bold">{selectedImg.title}</h2>
                <span className="text-brand-500 font-bold uppercase tracking-widest text-sm">{selectedImg.category}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
