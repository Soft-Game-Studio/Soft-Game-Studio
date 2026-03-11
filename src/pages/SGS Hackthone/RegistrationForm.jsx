import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import { CheckCircle, Users, MapPin, Sparkles, Send, ShieldCheck, Mail, Phone, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegistrationForm({ eventId, onClose, className = "" }) {
  const [form, setForm] = useState({
    firstName: '',
    teamName: '',
    courseSemester: '',
    college: '',
    age: '',
    mobile: '',
    email: '',
    addressLine: '',
    cityVillage: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(fireDB, 'event_registrations'), {
        ...form,
        eventId: eventId || 'hackathon_2026',
        createdAt: Timestamp.now()
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-2xl mx-auto rounded-3xl p-10 bg-white/5 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-center relative overflow-hidden ${className}`}
      >
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
        >
          <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
        </motion.div>
        
        <h3 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
          Registration Successful!
        </h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-md mx-auto">
          You are officially registered. We've securely saved your details and will send updates to your email.
        </p>
        
        {onClose && (
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 text-gray-900 dark:text-white px-8 py-3 rounded-xl backdrop-blur-md border border-white/20 transition-all font-semibold shadow-xl"
          >
            Go Back
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-white/70 dark:bg-[#0B0B15]/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/40 dark:border-white/10 overflow-hidden relative">
        
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 inline-flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-500" />
              Secure Your Spot
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3 font-medium">Fill in the details below to complete your registration request.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* ── Personal Info ── */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Full Name *</label>
                  <input name="firstName" placeholder="John Doe" value={form.firstName} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Team Name (Optional)</label>
                  <input name="teamName" placeholder="Tech Titans" value={form.teamName} onChange={handleChange} className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Course & Semester *</label>
                  <input name="courseSemester" placeholder="e.g. B.Tech 4th Sem" value={form.courseSemester} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">College/University *</label>
                  <input name="college" placeholder="Your College Name" value={form.college} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Age *</label>
                  <input name="age" type="number" placeholder="18" value={form.age} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                </div>
              </div>
            </div>

            {/* ── Contact Info ── */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contact Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Mobile Number *</label>
                  <input name="mobile" type="tel" placeholder="+91 9876543210" value={form.mobile} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address *</label>
                  <input name="email" type="email" placeholder="you@domain.com" value={form.email} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                </div>
              </div>
            </div>

            {/* ── Address ── */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Postal Address</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Address Line *</label>
                  <input name="addressLine" placeholder="House No, Street Area" value={form.addressLine} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">City/Village *</label>
                    <input name="cityVillage" placeholder="City" value={form.cityVillage} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">State *</label>
                    <input name="state" placeholder="State/Province" value={form.state} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Pincode *</label>
                    <input name="pincode" placeholder="ZIP Code" value={form.pincode} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Country *</label>
                    <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="pt-8 mt-8 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Your data is secure and encrypted.
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {onClose && (
                  <button type="button" onClick={onClose} className="px-6 py-4 rounded-2xl font-semibold border border-gray-200 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all w-full sm:w-auto">
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto transform hover:-translate-y-1 active:translate-y-0"
                >
                  {loading ? 'Processing...' : 'Submit Registration'}
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}