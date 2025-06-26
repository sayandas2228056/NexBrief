import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, X, Eye, EyeOff, Linkedin, Github, Twitter, Facebook, Instagram, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import Background from '../assets/Back.png';

const Profile = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);
  const backendurl=import.meta.env.VITE_BACKEND_URL;
  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${backendurl}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFormData(prev => ({
        ...prev,
        ...response.data,
        socialLinks: {
          ...prev.socialLinks,
          ...response.data.socialLinks
        }
      }));
    } catch (err) {
      setError('Failed to fetch profile data');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const platform = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [platform]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords if changing password
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      if (!formData.currentPassword) {
        setError('Current password is required to set new password');
        return;
      }
    }

    try {
      const response = await axios.put(
        `${backendurl}/api/profile/update`,
        {
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          socialLinks: formData.socialLinks,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update auth context with new user data
      login(response.data, localStorage.getItem('token'));

      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-white/8 backdrop-blur-2xl rounded-2xl p-8 border border-white/12">
          <div className="flex items-center gap-4 text-white/90">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            <span className="font-medium text-lg tracking-wide">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-6 lg:px-8">
      <div className="mt-10 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className='text-5xl font-semibold text-white tracking-wide mb-4'>NexBrief</h1>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-12 bg-white/12 rounded-2xl flex items-center justify-center">
              <Settings className="h-6 w-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-white tracking-wide">Profile Settings</h2>
              <p className="text-white/60 text-sm mt-1">Manage your account preferences</p>
            </div>
          </div>
        </div>

        <div className="bg-white/8 backdrop-blur-2xl rounded-2xl border border-white/12 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-2xl font-semibold text-white tracking-wide">Account Information</h3>
              <p className="text-white/60 text-sm mt-1">Update your personal details</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/12 backdrop-blur-sm text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 ease-out border border-white/10 hover:bg-white/16 hover:border-white/20"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/20 rounded-xl text-red-300 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-sm border border-green-500/20 rounded-xl text-green-300 font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white tracking-wide">Basic Information</h4>
              
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Email Field */}
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
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Bio Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="3"
                  className="w-full px-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50 resize-none"
                />
              </div>

              {/* Location Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                />
              </div>

              {/* Website Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-white tracking-wide">Social Links</h4>
              
              {/* LinkedIn */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">LinkedIn</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <input
                    type="url"
                    name="social.linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full pl-12 pr-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* GitHub */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">GitHub</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Github className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <input
                    type="url"
                    name="social.github"
                    value={formData.socialLinks.github}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://github.com/your-profile"
                    className="w-full pl-12 pr-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Twitter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Twitter</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Twitter className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <input
                    type="url"
                    name="social.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://twitter.com/your-profile"
                    className="w-full pl-12 pr-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Facebook */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Facebook</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Facebook className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <input
                    type="url"
                    name="social.facebook"
                    value={formData.socialLinks.facebook}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://facebook.com/your-profile"
                    className="w-full pl-12 pr-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Instagram */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">Instagram</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Instagram className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                  </div>
                  <input
                    type="url"
                    name="social.instagram"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="https://instagram.com/your-profile"
                    className="w-full pl-12 pr-4 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300 disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <>
                {/* Password Change Section */}
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white tracking-wide">Change Password</h4>
                  
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">Current Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
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

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                        ) : (
                          <Eye className="h-5 w-5" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/80">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-white/40" strokeWidth={1.5} />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-12 pr-12 py-4 bg-white/8 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all duration-300"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white/60 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                        ) : (
                          <Eye className="h-5 w-5" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 group flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/12 backdrop-blur-sm text-white font-medium border border-white/10 hover:bg-white/16 hover:border-white/20 transition-all duration-300"
                  >
                    <Save className="w-5 h-5" strokeWidth={1.5} />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(prev => ({
                        ...prev,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                    }}
                    className="flex-1 group flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/8 backdrop-blur-sm text-white font-medium border border-white/10 hover:bg-white/12 hover:border-white/20 transition-all duration-300"
                  >
                    <X className="w-5 h-5" strokeWidth={1.5} />
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile; 