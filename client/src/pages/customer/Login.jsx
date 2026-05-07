import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <Helmet><title>Login | Vitthaldas Singhal Saraf</title></Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .auth-page { font-family: 'Jost', sans-serif; }
        .auth-heading { font-family: 'Cormorant Garamond', serif; }
        .gold-line { background: linear-gradient(90deg, transparent, #C5A059, transparent); }
        .auth-input {
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
        .auth-input:focus { border-color: #C5A059; }
        .auth-input::placeholder { color: #b8a898; font-size: 13px; }
        .gold-btn {
          background: linear-gradient(135deg, #C5A059 0%, #e8c97a 50%, #C5A059 100%);
          background-size: 200% auto;
          transition: background-position 0.4s, transform 0.2s, box-shadow 0.3s;
          box-shadow: 0 4px 20px rgba(197,160,89,0.35);
        }
        .gold-btn:hover {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(197,160,89,0.5);
        }
        .left-panel {
          background: linear-gradient(160deg, #1a0e04 0%, #2d1a08 40%, #3d2510 100%);
        }
        .ornament {
          width: 40px; height: 1px;
          background: linear-gradient(90deg, transparent, #C5A059, transparent);
          display: inline-block;
        }
        .float-anim { animation: floatUp 0.6s ease both; }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .float-anim:nth-child(1) { animation-delay: 0.1s; }
        .float-anim:nth-child(2) { animation-delay: 0.2s; }
        .float-anim:nth-child(3) { animation-delay: 0.3s; }
        .float-anim:nth-child(4) { animation-delay: 0.4s; }
        .input-label { font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: #8a7060; font-weight: 500; margin-bottom: 4px; display: block; }
        .eye-btn { position: absolute; right: 0; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #b8a898; padding: 4px; }
        .eye-btn:hover { color: #C5A059; }
      `}</style>

      <div className="auth-page min-h-screen flex">
        {/* Left decorative panel */}
        <div className="left-panel hidden lg:flex flex-col justify-center items-center w-5/12 relative overflow-hidden px-16">
          {/* Background ornaments */}
          <div style={{position:'absolute',top:'15%',left:'10%',width:'180px',height:'180px',border:'1px solid rgba(197,160,89,0.15)',borderRadius:'50%'}} />
          <div style={{position:'absolute',bottom:'20%',right:'8%',width:'120px',height:'120px',border:'1px solid rgba(197,160,89,0.1)',borderRadius:'50%'}} />
          <div style={{position:'absolute',top:'40%',right:'-30px',width:'200px',height:'200px',border:'1px solid rgba(197,160,89,0.08)',borderRadius:'50%'}} />

          <div className="text-center relative z-10">
            <div style={{fontSize:'11px',letterSpacing:'0.4em',color:'#C5A059',marginBottom:'32px',textTransform:'uppercase'}}>
              Est. 1960 · Gwalior
            </div>
            <h1 className="auth-heading" style={{fontSize:'52px',color:'#f5ede0',lineHeight:'1.1',marginBottom:'24px',fontWeight:'300'}}>
              Crafted<br /><em style={{color:'#C5A059'}}>in Gold</em>
            </h1>
            <div className="gold-line" style={{height:'1px',margin:'24px auto',width:'80px'}} />
            <p style={{color:'#8a7868',fontSize:'13px',lineHeight:'1.9',fontWeight:'300',maxWidth:'280px'}}>
              Six decades of heritage, artistry, and trust. 
              Every piece tells a story of timeless elegance.
            </p>
            <div style={{marginTop:'48px',display:'flex',flexDirection:'column',gap:'14px'}}>
              {['BIS Hallmark Certified','Lifetime Exchange Guarantee','Transparent Pricing'].map(t => (
                <div key={t} style={{display:'flex',alignItems:'center',gap:'12px',color:'#a08870',fontSize:'12px',letterSpacing:'0.05em'}}>
                  <span style={{width:'5px',height:'5px',background:'#C5A059',borderRadius:'50%',display:'inline-block',flexShrink:0}} />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex-1 flex items-center justify-center px-8 py-12" style={{background:'#fdf8f2'}}>
          <div className="w-full max-w-sm float-anim">
            {/* Logo / brand */}
            <div className="text-center mb-12">
              <div style={{fontSize:'10px',letterSpacing:'0.4em',color:'#C5A059',textTransform:'uppercase',marginBottom:'12px'}}>
                Vitthaldas Singhal Saraf
              </div>
              <h2 className="auth-heading" style={{fontSize:'36px',color:'#1a1208',fontWeight:'400',marginBottom:'8px'}}>
                Welcome Back
              </h2>
              <div className="gold-line" style={{height:'1px',margin:'12px auto',width:'60px'}} />
              <p style={{color:'#8a7060',fontSize:'13px',fontWeight:'300',marginTop:'12px'}}>
                Sign in to your account
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{marginBottom:'32px'}} className="float-anim">
                <label className="input-label">Email Address</label>
                <div style={{position:'relative'}}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="auth-input"
                  />
                </div>
              </div>

              <div style={{marginBottom:'40px'}} className="float-anim">
                <label className="input-label">Password</label>
                <div style={{position:'relative'}}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="auth-input"
                    style={{paddingRight:'28px'}}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '○' : '●'}
                  </button>
                </div>
              </div>

              <div className="float-anim">
                <button
                  type="submit"
                  disabled={loading}
                  className="gold-btn w-full text-white font-medium py-4 rounded-none disabled:opacity-50"
                  style={{fontSize:'11px',letterSpacing:'0.25em',textTransform:'uppercase'}}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div style={{textAlign:'center',marginTop:'32px',paddingTop:'28px',borderTop:'1px solid #e8ddd2'}}>
              <p style={{color:'#8a7060',fontSize:'13px',fontWeight:'300'}}>
                New to VSS?{' '}
                <Link to="/register" style={{color:'#C5A059',fontWeight:'500',textDecoration:'none',borderBottom:'1px solid rgba(197,160,89,0.4)'}}>
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}