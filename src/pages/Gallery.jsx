import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';

const Gallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Tents', 'Catering', 'Decoration'];

  const images = [
    { id: 10, src: 'https://res.cloudinary.com/dwohs6fpq/image/upload/v1774085517/IMG-20250831-WA0031_wrqcnk.jpg', category: 'Decoration', title: 'Special Event Setup' },
    { id: 1, src: 'https://res.cloudinary.com/dwohs6fpq/video/upload/v1774086465/vi_empnl2.mp4', category: 'Decoration', title: 'Elegant Floral Setup' },
    { id: 2, src: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80', category: 'Catering', title: 'Gourmet Dessert Counter' },
    { id: 3, src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80', category: 'Tents', title: 'Luxury Marquee' },
    { id: 4, src: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&q=80', category: 'Decoration', title: 'Evening Lighting' },
    { id: 5, src: 'https://images.unsplash.com/photo-1533143708019-ea5cfa80213e?auto=format&fit=crop&q=80', category: 'Catering', title: 'Live Buffet Spread' },
    { id: 6, src: 'https://images.unsplash.com/photo-1455582916367-25f75bfc6710?auto=format&fit=crop&q=80', category: 'Tents', title: 'Outdoor Seating Structure' },
    { id: 7, src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80', category: 'Decoration', title: 'Wedding Mandap' },
    { id: 8, src: 'https://images.unsplash.com/photo-1530103862676-de889e4efa31?auto=format&fit=crop&q=80', category: 'Catering', title: 'Premium Serveware' },
    { id: 9, src: 'https://images.unsplash.com/photo-1466036692599-070d032f4711?auto=format&fit=crop&q=80', category: 'Tents', title: 'Reception Tent' },
  ];

  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 text-white py-16 -mt-24 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center mix-blend-luminosity grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        <div className="container mx-auto px-6 relative z-10 text-center pt-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Our Masterpieces
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl mx-auto text-lg"
          >
            Explore our portfolio of beautifully crafted events, stunning tent structures, and mouth-watering catering setups.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, idx) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full font-bold transition-all duration-300 border ${filter === cat
                ? 'bg-brand-500 text-slate-900 border-brand-500 shadow-lg shadow-brand-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredImages.map((img) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                key={img.id}
                className="relative group rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] cursor-pointer bg-slate-800 border border-slate-700"
                onClick={() => setSelectedImg(img)}
              >
                {img.src.includes('/video/') || img.src.match(/\.(mp4|webm|ogg)$/i) ? (
                  <video
                    src={img.src}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    autoPlay muted loop playsInline
                  />
                ) : (
                  <img
                    src={img.src}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-brand-500 text-sm font-bold mb-1 block uppercase tracking-wider">{img.category}</span>
                    <h3 className="text-white text-xl font-bold flex items-center justify-between">
                      {img.title}
                      <ZoomIn size={20} className="text-white/80" />
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 md:p-12"
            onClick={() => setSelectedImg(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/70 hover:text-brand-400 bg-white/5 p-3 rounded-full backdrop-blur-md transition-all hover:bg-white/10 border border-white/10"
              onClick={() => setSelectedImg(null)}
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="relative max-w-6xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.15)] border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImg.src.includes('/video/') || selectedImg.src.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={selectedImg.src}
                  controls autoPlay playsInline
                  className="w-full h-full max-h-[85vh] object-contain bg-slate-900"
                />
              ) : (
                <img
                  src={selectedImg.src}
                  alt={selectedImg.title}
                  className="w-full h-full max-h-[85vh] object-contain bg-slate-900"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                <span className="text-brand-400 font-bold text-sm tracking-widest uppercase mb-1 block">{selectedImg.category}</span>
                <h2 className="text-white text-3xl font-bold">{selectedImg.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
