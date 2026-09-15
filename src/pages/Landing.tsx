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
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=80" 
              alt="Interior Design" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="relative z-10 max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-md">Elevate Your Living Space</h1>
            <p className="text-lg md:text-xl text-white/90 drop-shadow">Bespoke interior solutions tailored to your unique style. From elegant curtains to complete home makeovers.</p>
            <button className="px-8 py-3 bg-accent text-accent-foreground rounded-full text-lg font-medium hover:bg-accent/90 transition shadow-lg mt-4">
              Book a Consultation
            </button>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Our Services</h2>
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

        {/* How It Works Section */}
        <section className="py-24 px-8 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Our Process</h2>
              <p className="text-muted text-lg max-w-2xl mx-auto">From concept to reality in four simple steps.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
              {[
                { step: '01', title: 'Consultation', desc: 'We discuss your vision, budget, and timeline.' },
                { step: '02', title: 'Measurement', desc: 'Our experts take precise measurements of your space.' },
                { step: '03', title: 'Production', desc: 'Custom crafting of your selections begins.' },
                { step: '04', title: 'Installation', desc: 'Flawless delivery and installation by our team.' },
              ].map(item => (
                <div key={item.step} className="relative space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground flex items-center justify-center rounded-full text-2xl font-bold shadow-md">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">What Our Clients Say</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Don't just take our word for it.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Jenkins', role: 'Homeowner', text: 'AuraDesign transformed my living room completely. The custom curtains and sofa are stunning!' },
              { name: 'Michael Chen', role: 'Property Developer', text: 'Professional team, on-time delivery, and the modular kitchen quality exceeded expectations.' },
              { name: 'Emma Watson', role: 'Homeowner', text: 'Their measurement and installation process is flawless. Everything fits perfectly.' },
            ].map((testimonial, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-border shadow-sm relative">
                <div className="text-accent text-4xl font-serif absolute top-4 left-4 opacity-20">"</div>
                <p className="text-foreground italic mb-6 relative z-10">{testimonial.text}</p>
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted">{testimonial.role}</div>
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
