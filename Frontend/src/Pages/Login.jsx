import React, { useState, useEffect } from 'react';
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Img from '../assets/pic2.png'
import { useAuth } from '../context/AuthContext';
import Footer from '../Components/Footer';
import Background from '../assets/Back.png';
import config from '../config/config';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (user) {
      navigate('/summary');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Check if backend URL is configured
    if (!config.isValidBackendUrl()) {
      setError('Backend URL not configured. Please check your environment variables.');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login for:', formData.email);
      const response = await login(formData.email, formData.password);
      if (response.data.token && response.data.user) {
        navigate('/summary');
      } else {
        console.error('Login error:', response.data?.message || 'Login failed. Please try again.');
        setError(response.data?.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      if (err.message.includes('Backend URL not configured')) {
        setError('Backend URL not configured. Please check your environment variables.');
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black" style={{ backgroundColor: '#000' }}>
      <div className="flex flex-1">
        {/* Left Side - Image with Overlay */}
        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 z-10"></div>
          <img
            src={Img}
            alt="Login Image"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <a href="/">
                <h1 className="text-5xl font-semibold mb-6 text-white tracking-wide">
                  NexBrief
                </h1>
              </a>
              <h2 className="text-3xl font-semibold mb-4 text-white tracking-wide">
                Welcome Back
              </h2>
              <p className="text-white/60">Sign in to continue your news journey</p>
            </div>
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/20 text-red-300 px-4 py-3 rounded-xl relative mb-6" role="alert">
                <span className="block sm:inline font-medium">{error}</span>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="h-5 w-5" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-5 w-5 rounded border-white/20 bg-white/8 text-white focus:ring-white/20"
                />
                <label htmlFor="remember-me" className="ml-3 block text-sm text-white/60">
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white/12 backdrop-blur-sm text-white font-medium border border-white/10 hover:bg-white/16 hover:border-white/20 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : (
                  <>
                    <LogIn className="w-5 h-5" strokeWidth={1.5} />
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                  </>
                )}
              </button>

              <p className="text-center text-white/60">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-white hover:text-white/80 font-medium transition-colors"
                >
                  Create an account
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
