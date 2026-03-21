import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Tent, Utensils, Sparkles, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const bgImages = [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1478146896981-b80fe463b330?auto=format&fit=crop&w=2000&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=2000&q=80"
  ];
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const services = [
    {
      icon: <Tent size={32} className="text-brand-500" />,
      title: "Premium Tents",
      desc: "Luxurious, weather-resistant structural tents for events of any size. From elegant marquees to massive waterproof setups.",
      features: ["Waterproof", "Climate Controlled", "Customizable Sizes"]
    },
    {
      icon: <Utensils size={32} className="text-brand-500" />,
      title: "Exquisite Catering",
      desc: "Delight your guests with our multi-cuisine menu crafted by master chefs, using only the finest and freshest ingredients.",
      features: ["Multi-Cuisine", "Live Counters", "Premium Serveware"]
    },
    {
      icon: <Sparkles size={32} className="text-brand-500" />,
      title: "Elegant Decoration",
      desc: "Transform your venue into a magical space with our bespoke floral arrangements, intelligent lighting, and thematic props.",
      features: ["Floral Design", "Thematic Props", "Ambient Lighting"]
    }
  ];

  const stats = [
    { num: "500+", label: "Events Organized" },
    { num: "15+", label: "Years Experience" },
    { num: "10K+", label: "Happy Guests" },
    { num: "100%", label: "Satisfaction" }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 bg-slate-950/80 mix-blend-multiply z-10" />
          <AnimatePresence>
            <motion.img 
              key={currentBg}
              src={bgImages[currentBg]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, ease: "easeInOut" }}
              alt="Beautiful Event Structure" 
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          </AnimatePresence>
        </div>

        <div className="container mx-auto px-6 max-w-6xl relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="flex flex-col items-center">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white mb-6">
              <Star size={16} className="text-brand-400 text-shadow-sm" />
              <span className="text-sm font-medium tracking-wide">Premier Event Architects</span>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight drop-shadow-xl">
              Turn Your Dream Event <br className="hidden md:block" />
              Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500">Reality</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl font-light leading-relaxed">
              Anjali Tent & Caterers provides premium end-to-end event solutions. From majestic tents to exquisite catering, we make your special day truly unforgettable.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="px-8 py-4 rounded-full text-lg font-bold text-slate-900 bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-400 hover:to-brand-300 shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all hover:scale-105 flex items-center justify-center gap-2 group">
                Book Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/gallery" className="px-8 py-4 rounded-full text-lg font-medium text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 transition-all hover:scale-105">
                View Gallery
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1"
        >
          <div className="w-1.5 h-3 bg-brand-400 rounded-full" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-slate-900 border border-slate-800 relative z-20 shadow-2xl -mt-4 mx-4 md:mx-auto md:max-w-5xl rounded-2xl md:-translate-y-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-brand-400 to-brand-600 mb-2">
                  {stat.num}
                </h3>
                <p className="text-slate-400 font-medium text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-950 relative">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-500/10 rounded-bl-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-slate-600/10 rounded-tr-full blur-[120px] -z-10" />
        
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Our Premium Services</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">We offer comprehensive event solutions tailored to your unique requirements, ensuring every detail is perfect.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800/80 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 text-brand-500">
                  {service.icon}
                </div>
                
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6 text-brand-400 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-slate-900 transition-all duration-300">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {service.desc}
                </p>
                
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                      <CheckCircle size={18} className="text-brand-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[120px] z-0 pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Plan Your Perfect Event?</h2>
            <p className="text-xl text-slate-400 mb-10 font-light">Join thousands of happy clients who trusted us with their most precious moments.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-bold text-slate-950 bg-brand-400 hover:bg-brand-300 shadow-[0_0_40px_rgba(245,158,11,0.2)] transition-all hover:scale-105 group">
              Get a Free Quote
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
