import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import LuxuryPageBanner from '../../components/common/LuxuryPageBanner';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/inquiries', form);
      toast.success(data.message || 'Message sent! We will contact you soon.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact Us | Vitthaldas Singhal Saraf</title></Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .contact-page { font-family: 'Jost', sans-serif; background: #fdf8f2; }
        .ch { font-family: 'Cormorant Garamond', serif; }
        .contact-hero {
          background: linear-gradient(160deg, #1a0e04 0%, #2d1a08 60%, #3a2010 100%);
          padding: 80px 0 60px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .contact-hero::before {
          content: '';
          position: absolute;
          top: -60px; left: 50%; transform: translateX(-50%);
          width: 400px; height: 400px;
          border: 1px solid rgba(197,160,89,0.08);
          border-radius: 50%;
        }
        .contact-hero::after {
          content: '';
          position: absolute;
          bottom: -80px; right: 10%;
          width: 250px; height: 250px;
          border: 1px solid rgba(197,160,89,0.06);
          border-radius: 50%;
        }
        .gold-line { height: 1px; background: linear-gradient(90deg, transparent, #C5A059, transparent); }
        .form-field-lux {
          background: transparent;
          border: none;
          border-bottom: 1px solid #d8ccc0;
          border-radius: 0;
          padding: 10px 0;
          width: 100%;
          font-size: 14px;
          color: #1a1208;
          outline: none;
          transition: border-color 0.3s;
          font-family: 'Jost', sans-serif;
        }
        .form-field-lux:focus { border-color: #C5A059; }
        .form-field-lux::placeholder { color: #b8a898; font-size: 13px; }
        .field-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #8a7060; font-weight: 500; margin-bottom: 4px; display: block; }
        .info-card {
          background: white;
          border: 1px solid #ede0d0;
          padding: 32px;
          position: relative;
        }
        .info-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: linear-gradient(180deg, #C5A059, #e8c97a, #C5A059);
        }
        .gold-btn {
          background: linear-gradient(135deg, #C5A059 0%, #e8c97a 50%, #C5A059 100%);
          background-size: 200% auto;
          transition: background-position 0.4s, transform 0.2s, box-shadow 0.3s;
          box-shadow: 0 4px 20px rgba(197,160,89,0.3);
          color: white; border: none; cursor: pointer;
          font-family: 'Jost', sans-serif;
        }
        .gold-btn:hover { background-position: right center; transform: translateY(-1px); box-shadow: 0 6px 28px rgba(197,160,89,0.45); }
        .gold-btn:disabled { opacity: 0.5; transform: none; }
        .wa-btn {
          border: 1px solid rgba(197,160,89,0.5);
          color: #8a6830;
          background: rgba(197,160,89,0.06);
          transition: all 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          padding: 14px 20px;
          font-size: 13px; font-weight: 500;
          text-decoration: none;
          font-family: 'Jost', sans-serif;
        }
        .wa-btn:hover { background: #C5A059; color: white; border-color: #C5A059; }
        .contact-icon { color: #C5A059; flex-shrink: 0; }
        .fade-up { animation: fadeUp 0.6s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .map-container { border: 1px solid #ede0d0; overflow: hidden; }
      `}</style>

      <div className="contact-page">
        {/* Hero */}
        <LuxuryPageBanner 
          title="We're Here for You"
          subtitle="Visit our showroom or reach out — we'd love to guide you to the perfect piece."
          bgImage="https://images.unsplash.com/photo-1531988042231-d39a9cc12a9a?auto=format&fit=crop&q=80&w=2000"
          breadcrumbs={[{ label: 'Contact Us' }]}
        />

        {/* Main content */}
        <div style={{maxWidth:'1100px',margin:'0 auto',padding:'60px 24px 80px'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'48px',alignItems:'start'}} className="contact-grid-resp">
            
            {/* Left: Info */}
            <div className="fade-up" style={{display:'flex',flexDirection:'column',gap:'24px'}}>
              <div className="info-card">
                <h2 className="ch" style={{fontSize:'22px',color:'#1a1208',fontWeight:'400',marginBottom:'24px'}}>
                  Store Details
                </h2>
                <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
                  {[
                    { icon: <MapPin size={18} className="contact-icon" />, main: 'Sarafa Bazar, Lashkar', sub: 'Gwalior, Madhya Pradesh — 474001' },
                    { icon: <Phone size={18} className="contact-icon" />, main: <a href="tel:+917512345678" style={{color:'#1a1208',textDecoration:'none'}}>+91 751 234 5678</a>, sub: 'Mon–Sat 10AM–9PM' },
                    { icon: <Mail size={18} className="contact-icon" />, main: <a href="mailto:info@vssaraf.com" style={{color:'#1a1208',textDecoration:'none'}}>info@vssaraf.com</a>, sub: null },
                    { icon: <Clock size={18} className="contact-icon" />, main: '10:00 AM – 9:00 PM', sub: 'Open all days (Sun: 11AM–7PM)' },
                  ].map((item, i) => (
                    <div key={i} style={{display:'flex',gap:'14px',alignItems:'flex-start'}}>
                      <div style={{marginTop:'1px'}}>{item.icon}</div>
                      <div>
                        <p style={{fontSize:'14px',fontWeight:'500',color:'#1a1208',marginBottom:item.sub?'2px':0}}>{item.main}</p>
                        {item.sub && <p style={{fontSize:'12px',color:'#8a7060',fontWeight:'300'}}>{item.sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp */}
              <a href="https://wa.me/917512345678" target="_blank" rel="noopener noreferrer" className="wa-btn">
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>

              {/* Map */}
              <div className="map-container" style={{height:'200px'}}>
                <iframe
                  title="VSS Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.123!2d78.1724!3d26.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSarafa+Bazar+Gwalior!5e0!3m2!1sen!2sin!4v1"
                  width="100%" height="100%"
                  style={{border:0}}
                  allowFullScreen loading="lazy"
                />
              </div>
            </div>

            {/* Right: Form */}
            <div className="fade-up" style={{background:'white',border:'1px solid #ede0d0',padding:'40px'}}>
              <h2 className="ch" style={{fontSize:'24px',color:'#1a1208',fontWeight:'400',marginBottom:'8px'}}>
                Send a Message
              </h2>
              <div className="gold-line" style={{width:'40px',marginBottom:'28px'}} />

              <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'28px'}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'28px'}}>
                  <div>
                    <label className="field-label">Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="form-field-lux" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="field-label">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="form-field-lux" placeholder="9876543210" />
                  </div>
                </div>

                <div>
                  <label className="field-label">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="form-field-lux" placeholder="you@example.com" />
                </div>

                <div>
                  <label className="field-label">Subject *</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required className="form-field-lux" placeholder="How can we help?" />
                </div>

                <div>
                  <label className="field-label">Message *</label>
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} className="form-field-lux" placeholder="Tell us more..." style={{resize:'none'}} />
                </div>

                <button type="submit" disabled={sending} className="gold-btn" style={{padding:'16px',fontSize:'11px',letterSpacing:'0.2em',textTransform:'uppercase',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
                  <Send size={14} />
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid-resp { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}