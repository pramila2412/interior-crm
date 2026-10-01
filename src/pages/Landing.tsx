import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicServices } from '../api/services';
import { type PublicService } from '../api/db';
import { Mail, MapPin, Phone } from 'lucide-react';

export function Landing() {
  const [services, setServices] = useState<PublicService[]>([]);

  useEffect(() => {
    getPublicServices().then(setServices);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans scroll-smooth">
      <header className="px-8 py-6 flex justify-between items-center border-b border-border bg-card sticky top-0 z-10">
        <div className="text-2xl font-bold text-primary tracking-tight">AuraDesign</div>
        <nav className="space-x-6">
          <Link to="/" className="text-muted hover:text-primary transition-colors font-medium">Home</Link>
          <a href="#services" className="text-muted hover:text-primary transition-colors font-medium">Services</a>
          <a href="#contact" className="text-muted hover:text-primary transition-colors font-medium">Contact Us</a>
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

        {/* Features Section (Inspired by Competitor) */}
        <section id="features" className="py-24 px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Simple and powerful online project manager</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">A super easy software to track, monitor & manage your entire furnishing operation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground">Create and Manage Projects easily</h3>
              <p className="text-lg text-muted">Built for Furnishing houses in India, using our platform is simple and intuitive - and covers the entire furnishing workflow from enquiry to installation.</p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-center gap-3 text-foreground font-medium"><div className="w-2 h-2 rounded-full bg-primary"></div> Create and Close new projects</li>
                <li className="flex items-center gap-3 text-foreground font-medium"><div className="w-2 h-2 rounded-full bg-primary"></div> Assign tasks to your team</li>
                <li className="flex items-center gap-3 text-foreground font-medium"><div className="w-2 h-2 rounded-full bg-primary"></div> Keep customer details organized</li>
              </ul>
            </div>
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border shadow-inner min-h-[300px] flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Dashboard Preview" className="rounded-xl shadow-lg border border-border" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 md:flex-row-reverse">
            <div className="order-2 md:order-1 bg-secondary/30 rounded-2xl p-8 border border-border shadow-inner min-h-[300px] flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80" alt="Quotation Preview" className="rounded-xl shadow-lg border border-border" />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="text-3xl font-bold text-foreground">Generate and share quotations instantly</h3>
              <p className="text-lg text-muted">Create quotations and invoices with a click of a button - and share them with another! Never manually calculate again.</p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-center gap-3 text-foreground font-medium"><div className="w-2 h-2 rounded-full bg-primary"></div> Generate Quotations</li>
                <li className="flex items-center gap-3 text-foreground font-medium"><div className="w-2 h-2 rounded-full bg-primary"></div> Public Magic Tracking Links</li>
                <li className="flex items-center gap-3 text-foreground font-medium"><div className="w-2 h-2 rounded-full bg-primary"></div> One-click client approvals</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground">Track everything about your project</h3>
              <p className="text-lg text-muted">Never miss an update. Access your workspace on all devices. Anytime. Anywhere.</p>
              <div className="grid grid-cols-2 gap-6 mt-6">
                <div className="p-4 bg-card border border-border rounded-xl">
                  <h4 className="font-bold text-primary mb-1">Save money and time</h4>
                  <p className="text-sm text-muted">Get rid of manual entry and human error.</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-xl">
                  <h4 className="font-bold text-primary mb-1">Track goods</h4>
                  <p className="text-sm text-muted">Never miss a delivery or order status.</p>
                </div>
              </div>
            </div>
            <div className="bg-secondary/30 rounded-2xl p-8 border border-border shadow-inner min-h-[300px] flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" alt="Tracking Preview" className="rounded-xl shadow-lg border border-border" />
            </div>
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

        {/* Contact Us Section */}
        <section id="contact" className="py-24 px-8 bg-secondary/30 border-t border-border">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
                <p className="text-muted text-lg">Ready to transform your space? Send us a message and our design team will get back to you within 24 hours.</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-muted">Visit Us</h4>
                    <p className="font-medium">Check Post, Siliguri, 734001, WB - India</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-muted">Email Us</h4>
                    <a href="mailto:info@auradesign.com" className="font-medium hover:text-primary transition-colors">info@auradesign.com</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-12 h-12 bg-card border border-border rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-muted">Call Us</h4>
                    <a href="tel:+919800111244" className="font-medium hover:text-primary transition-colors">+91 98001 11244</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">First Name</label>
                    <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="John" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Last Name</label>
                    <input type="text" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <input type="email" className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <textarea className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors min-h-[120px]" placeholder="Tell us about your project..." required></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                  Send Message
                </button>
              </form>
            </div>
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
