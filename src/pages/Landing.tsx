import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicServices } from '../api/services';
import { type PublicService } from '../api/db';

export function Landing() {
  const [services, setServices] = useState<PublicService[]>([]);

  useEffect(() => {
    getPublicServices().then(setServices);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="px-8 py-6 flex justify-between items-center border-b border-border bg-card sticky top-0 z-10">
        <div className="text-2xl font-bold text-primary tracking-tight">AuraDesign</div>
        <nav className="space-x-6">
          <Link to="/" className="text-muted hover:text-primary transition-colors font-medium">Home</Link>
          <a href="#services" className="text-muted hover:text-primary transition-colors font-medium">Services</a>
          <Link to="/login" className="px-5 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium shadow-sm">
            Admin Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[600px] flex items-center justify-center text-center px-4">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1600607688969-a5bfcd64bd15?auto=format&fit=crop&w=1920&q=80" 
              alt="Interior Design" 
              className="w-full h-full object-cover brightness-[0.85]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
          </div>
          <div className="relative z-10 max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-md">Elevate Your Living Space</h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow">Bespoke interior solutions tailored to your unique style. From elegant curtains to complete home makeovers.</p>
            <button className="px-8 py-3 bg-terracotta text-white rounded-full text-lg font-medium hover:bg-terracotta/90 transition shadow-lg mt-4">
              Book a Consultation
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-primary">Our Services</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Discover our range of premium interior design services crafted to perfection.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map(service => (
              <div key={service.id} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-border group cursor-pointer">
                <div className="h-48 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{service.title}</h3>
                  <p className="text-muted line-clamp-3">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold tracking-tight">AuraDesign</div>
          <p className="text-primary-foreground/70 text-sm">© 2026 AuraDesign. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
