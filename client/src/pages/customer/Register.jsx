import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.phone, form.password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <Helmet><title>Create Account | Vitthaldas Singhal Saraf</title></Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .reg-page { font-family: 'Jost', sans-serif; }
        .reg-heading { font-family: 'Cormorant Garamond', serif; }
        .reg-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid #d4b896;
          border-radius: 0;
          padding: 10px 0;
          width: 100%;
          font-size: 14px;
          color: #1a1208;
          outline: none;
          transition: border-color 0.3s;
          font-family: 'Jost', sans-serif;
        }
        .reg-input:focus { border-color: #C5A059; }
        .reg-input::placeholder { color: #b8a898; font-size: 13px; }
        .gold-gradient-btn {
          background: linear-gradient(135deg, #C5A059 0%, #e8c97a 50%, #C5A059 100%);
          background-size: 200% auto;
          transition: background-position 0.4s, transform 0.2s, box-shadow 0.3s;
          box-shadow: 0 4px 20px rgba(197,160,89,0.35);
        }
        .gold-gradient-btn:hover {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(197,160,89,0.5);
        }
        .right-panel-reg {
          background: linear-gradient(160deg, #1a0e04 0%, #2d1a08 40%, #3d2510 100%);
        }
        .reg-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #8a7060; font-weight: 500; margin-bottom: 4px; display: block; }
        .slide-in { animation: slideIn 0.5s ease both; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in:nth-child(1) { animation-delay: 0.05s; }
        .slide-in:nth-child(2) { animation-delay: 0.1s; }
        .slide-in:nth-child(3) { animation-delay: 0.15s; }
        .slide-in:nth-child(4) { animation-delay: 0.2s; }
        .slide-in:nth-child(5) { animation-delay: 0.25s; }
      `}</style>

      <div className="reg-page min-h-screen flex">
        {/* Left form panel */}
        <div className="flex-1 flex items-center justify-center px-8 py-12" style={{background:'#fdf8f2'}}>
          <div className="w-full max-w-sm">
            {/* Brand */}
            <div className="text-center mb-10">
              <div style={{fontSize:'10px',letterSpacing:'0.4em',color:'#C5A059',textTransform:'uppercase',marginBottom:'12px'}}>
                Vitthaldas Singhal Saraf
              </div>
              <h2 className="reg-heading" style={{fontSize:'34px',color:'#1a1208',fontWeight:'400',marginBottom:'6px'}}>
                Join the Family
              </h2>
              <div style={{height:'1px',background:'linear-gradient(90deg,transparent,#C5A059,transparent)',margin:'12px auto',width:'60px'}} />
              <p style={{color:'#8a7060',fontSize:'13px',fontWeight:'300',marginTop:'10px'}}>
                Create your VSS account
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{display:'flex',flexDirection:'column',gap:'28px'}}>
                <div className="slide-in">
                  <label className="reg-label">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    placeholder="Your full name"
                    className="reg-input"
                  />
                </div>

                <div className="slide-in">
                  <label className="reg-label">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="you@example.com"
                    className="reg-input"
                  />
                </div>

                <div className="slide-in">
                  <label className="reg-label">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="reg-input"
                  />
                </div>

                <div className="slide-in" style={{position:'relative'}}>
                  <label className="reg-label">Password</label>
                  <div style={{position:'relative'}}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                      className="reg-input"
                      style={{paddingRight:'28px'}}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      style={{position:'absolute',right:0,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'#b8a898',fontSize:'12px'}}
                    >
                      {showPass ? '○' : '●'}
                    </button>
                  </div>
                </div>

                <div className="slide-in">
                  <button
                    type="submit"
                    disabled={loading}
                    className="gold-gradient-btn w-full text-white font-medium py-4 rounded-none disabled:opacity-50"
                    style={{fontSize:'11px',letterSpacing:'0.25em',textTransform:'uppercase'}}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </div>
            </form>

            <div style={{textAlign:'center',marginTop:'28px',paddingTop:'24px',borderTop:'1px solid #e8ddd2'}}>
              <p style={{color:'#8a7060',fontSize:'13px',fontWeight:'300'}}>
                Already a member?{' '}
                <Link to="/login" style={{color:'#C5A059',fontWeight:'500',textDecoration:'none',borderBottom:'1px solid rgba(197,160,89,0.4)'}}>
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right decorative panel */}
        <div className="right-panel-reg hidden lg:flex flex-col justify-center items-center w-5/12 relative overflow-hidden px-16">
          <div style={{position:'absolute',top:'20%',right:'15%',width:'150px',height:'150px',border:'1px solid rgba(197,160,89,0.12)',borderRadius:'50%'}} />
          <div style={{position:'absolute',bottom:'15%',left:'10%',width:'200px',height:'200px',border:'1px solid rgba(197,160,89,0.08)',borderRadius:'50%'}} />

          <div className="text-center relative z-10">
            <div style={{fontSize:'11px',letterSpacing:'0.4em',color:'#C5A059',marginBottom:'32px',textTransform:'uppercase'}}>
              Member Benefits
            </div>
            <h3 className="reg-heading" style={{fontSize:'42px',color:'#f5ede0',lineHeight:'1.15',marginBottom:'20px',fontWeight:'300'}}>
              Your Own<br /><em style={{color:'#C5A059'}}>Jewellery</em><br />Journey
            </h3>
            <div style={{height:'1px',background:'linear-gradient(90deg,transparent,#C5A059,transparent)',margin:'20px auto',width:'60px'}} />

            <div style={{marginTop:'36px',display:'flex',flexDirection:'column',gap:'20px',textAlign:'left'}}>
              {[
                ['Order Tracking', 'Track every piece from our workshop to your door'],
                ['Exclusive Offers', 'Member-only discounts and early collection access'],
                ['Wishlist', 'Save your favourite designs for later'],
                ['Purchase History', 'Quick reorder and lifetime warranty claims'],
              ].map(([title, desc]) => (
                <div key={title} style={{display:'flex',gap:'12px',alignItems:'flex-start'}}>
                  <span style={{width:'6px',height:'6px',background:'#C5A059',borderRadius:'50%',marginTop:'6px',flexShrink:0}} />
                  <div>
                    <p style={{color:'#d4c0a8',fontSize:'12px',fontWeight:'500',marginBottom:'2px'}}>{title}</p>
                    <p style={{color:'#6a5848',fontSize:'11px',fontWeight:'300',lineHeight:'1.5'}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}