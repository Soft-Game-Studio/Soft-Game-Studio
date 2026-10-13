// src/pages/SGS Hackthone/RegistrationForm.jsx
// UI-UX Pro Max: Futuristic Cyberpunk + OLED Glassmorphism | Space Grotesk + DM Sans
import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import {
  CheckCircle2, Send, ShieldCheck, Sparkles, ChevronDown, User, Mail, Phone,
  GraduationCap, Calendar, MapPin, Building, Globe, Users, FileText, ArrowRight,
  ArrowLeft, Check, Download, Printer, RefreshCw, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const FLD = "w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/60 dark:bg-black/50 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all font-medium text-sm shadow-inner";

function FormField({ label, name, type = 'text', required, value, onChange, placeholder, icon: Icon, error }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        {label} {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-400 transition-colors pointer-events-none">
            <Icon size={17} />
          </div>
        )}
        <input
          name={name}
          type={type}
          placeholder={placeholder || label}
          value={value}
          onChange={onChange}
          required={required}
          className={`${FLD} ${Icon ? 'pl-11' : 'pl-4'} ${error ? 'border-rose-500/60 ring-1 ring-rose-500/40' : ''}`}
        />
      </div>
      {error && <p className="text-xs text-rose-400 flex items-center gap-1"><AlertCircle size={12} /> {error}</p>}
    </div>
  );
}

export default function RegistrationForm({ eventId, eventTitle = "SGS Hackathon", dynamicFields = [], onClose, className = "" }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    mobile: '',
    age: '',
    college: '',
    courseSemester: '',
    teamType: 'team', // 'solo' or 'team'
    teamName: '',
    teamMembersCount: '2',
    addressLine: '',
    cityVillage: '',
    state: '',
    pincode: '',
    country: 'India',
    githubOrPortfolio: '',
    agreeTerms: true
  });

  const [custom, setCustom] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCustom = (label, val) => {
    setCustom(prev => ({ ...prev, [label]: val }));
  };

  // Step 1 validation
  const validateStep1 = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Valid Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Enter a valid email address";
    if (!form.mobile.trim()) newErrors.mobile = "Mobile Number is required";
    else if (form.mobile.replace(/\D/g, '').length < 10) newErrors.mobile = "Enter a valid 10-digit number";
    if (!form.age) newErrors.age = "Age is required";
    if (!form.college.trim()) newErrors.college = "College/Institute name is required";
    if (!form.courseSemester.trim()) newErrors.courseSemester = "Course & Semester is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const newErrors = {};
    if (form.teamType === 'team' && !form.teamName.trim()) {
      newErrors.teamName = "Team Name is required for team participation";
    }
    if (!form.cityVillage.trim()) newErrors.cityVillage = "City/Town is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.pincode.trim()) newErrors.pincode = "Pincode is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    if (!form.agreeTerms) {
      alert("Please accept the terms and guidelines to register.");
      return;
    }

    setLoading(true);
    try {
      const regId = 'SGS-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
      const submissionPayload = {
        ...form,
        customFields: custom,
        eventId: eventId || 'unknown',
        registrationId: regId,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(fireDB, 'event_registrations'), submissionPayload);
      setSubmittedData({ ...submissionPayload, docId: docRef.id });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit registration. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDynField = (field, idx) => {
    const { type, label, required, options } = field;
    const val = custom[label] || '';
    const props = {
      id: `cf-${idx}`,
      value: val,
      onChange: e => handleCustom(label, e.target.value),
      required,
      className: `${FLD} pl-4`
    };

    switch (type?.toUpperCase()) {
      case 'TEXT':
      case 'EMAIL':
      case 'NUMBER':
      case 'DATE':
        return <input type={type.toLowerCase()} placeholder={label} {...props} />;
      case 'PHONE':
        return <input type="tel" placeholder={label} {...props} />;
      case 'TEXTAREA':
        return <textarea rows="3" placeholder={label} {...props} className={`${FLD} pl-4 min-h-[90px]`} />;
      case 'SELECT':
        return (
          <div className="relative">
            <select {...props} className={`${FLD} pl-4 appearance-none pr-10 bg-[#0e0e1a]`}>
              <option value="" className="bg-[#0e0e1a]">Select {label}</option>
              {(options || []).map((o, i) => (
                <option key={i} value={o} className="bg-[#0e0e1a]">{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        );
      case 'FILE':
        return (
          <input
            type="file"
            onChange={e => handleCustom(label, e.target.files?.[0]?.name || '')}
            required={required}
            className={`${FLD} pl-4 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-600/30 file:text-violet-300 hover:file:bg-violet-600/50 cursor-pointer`}
          />
        );
      default:
        return <input type="text" placeholder={label} {...props} />;
    }
  };

  /* ═══ SUCCESS PASS / TICKET VIEW ═══ */
  if (submitted && submittedData) {
    const regId = submittedData.registrationId || 'SGS-REG-CONFIRMED';
    const qrPayload = JSON.stringify({
      regId,
      name: submittedData.firstName,
      event: eventTitle,
      team: submittedData.teamName || 'Solo',
      time: new Date().toISOString()
    });

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-2xl mx-auto rounded-3xl p-6 sm:p-10 bg-[#0c0d1a]/95 backdrop-blur-2xl border border-violet-500/30 text-center relative overflow-hidden shadow-2xl shadow-violet-950/50 ${className}`}
      >
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-80px] w-64 h-64 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Celebration Header */}
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 mb-3">
            <Sparkles size={12} /> Registration Confirmed
          </span>

          <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
            You're In The Arena!
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
            Your registration pass has been generated. Keep your Registration ID safe for check-in on event day.
          </p>

          {/* DIGITAL HACKATHON PASS CARD */}
          <div className="relative rounded-2xl bg-gradient-to-br from-violet-600/30 via-indigo-900/40 to-black p-[1px] text-left mb-8 shadow-2xl">
            <div className="bg-[#090a14] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              {/* decorative watermark */}
              <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none font-black text-9xl text-white select-none">
                SGS
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-violet-400">Official Entry Pass</span>
                  <h4 className="text-xl font-bold text-white mt-0.5">{eventTitle}</h4>
                </div>
                <div className="px-3 py-1 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-300 font-mono text-xs font-bold">
                  {regId}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-white/10 items-center">
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Participant Name</span>
                    <p className="text-base font-bold text-white capitalize">{submittedData.firstName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold">Team / Solo</span>
                      <p className="text-sm font-semibold text-slate-200">{submittedData.teamName || 'Solo Participant'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-semibold">Institute</span>
                      <p className="text-sm font-semibold text-slate-200 truncate">{submittedData.college}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Email & Phone</span>
                    <p className="text-xs font-medium text-slate-400">{submittedData.email} · {submittedData.mobile}</p>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white text-slate-900 shadow-md">
                  <QRCodeSVG value={qrPayload} size={110} level="M" />
                  <span className="text-[10px] font-mono font-bold mt-1 text-slate-700">SCAN AT GATE</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap justify-between items-center text-xs text-slate-400 gap-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" /> Soft Game Studio Verified
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all border border-white/20 flex items-center gap-2 shadow-lg"
            >
              <Printer size={15} /> Print / Save Pass
            </button>
            {onClose ? (
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all flex items-center gap-2"
              >
                Back to Event <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => { setSubmitted(false); setCurrentStep(1); }}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all border border-white/10 flex items-center gap-2"
              >
                <RefreshCw size={14} /> Register Another
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  /* ═══ STEPPED FORM VIEW ═══ */
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-[#0b0c17]/90 backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl shadow-black/60">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-400 text-xs font-bold tracking-widest uppercase mb-3">
              <Sparkles size={12} /> Official Registration Portal
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Claim Your Spot in the Arena
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
              Join top developers, creators, and innovators. Complete your registration in 3 simple steps.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* background line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white/10 w-full z-0" />
              {/* active progress line */}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500 z-0"
                style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
              />

              {[
                { step: 1, title: 'Personal Info', icon: User },
                { step: 2, title: 'Team & Location', icon: Users },
                { step: 3, title: 'Confirm & Submit', icon: Check }
              ].map(({ step, title, icon: Icon }) => {
                const isPassed = currentStep > step;
                const isCurrent = currentStep === step;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (step < currentStep) setCurrentStep(step);
                      }}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                        isPassed
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                          : isCurrent
                          ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white ring-4 ring-violet-500/20 shadow-xl'
                          : 'bg-slate-800 text-slate-400 border border-white/10'
                      }`}
                    >
                      {isPassed ? <Check size={18} /> : <Icon size={18} />}
                    </button>
                    <span className={`text-[11px] font-semibold mt-2 hidden sm:block ${isCurrent ? 'text-violet-400' : 'text-slate-400'}`}>
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {/* ═══ STEP 1: PERSONAL DETAILS ═══ */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <User size={18} className="text-violet-400" /> Participant Information
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">Step 1 of 3</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      label="Full Name"
                      name="firstName"
                      placeholder="e.g. Alex Sharma"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      icon={User}
                      error={errors.firstName}
                    />

                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="alex@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      icon={Mail}
                      error={errors.email}
                    />

                    <FormField
                      label="Mobile Number (WhatsApp)"
                      name="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={form.mobile}
                      onChange={handleChange}
                      required
                      icon={Phone}
                      error={errors.mobile}
                    />

                    <FormField
                      label="Age"
                      name="age"
                      type="number"
                      placeholder="e.g. 20"
                      value={form.age}
                      onChange={handleChange}
                      required
                      icon={Calendar}
                      error={errors.age}
                    />

                    <FormField
                      label="College / Institute / University"
                      name="college"
                      placeholder="e.g. IIT Bombay / Amity University"
                      value={form.college}
                      onChange={handleChange}
                      required
                      icon={Building}
                      error={errors.college}
                    />

                    <FormField
                      label="Course & Semester"
                      name="courseSemester"
                      placeholder="e.g. B.Tech CSE (6th Sem)"
                      value={form.courseSemester}
                      onChange={handleChange}
                      required
                      icon={GraduationCap}
                      error={errors.courseSemester}
                    />
                  </div>
                </motion.div>
              )}

              {/* ═══ STEP 2: TEAM & LOCATION ═══ */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users size={18} className="text-violet-400" /> Team & Location Details
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">Step 2 of 3</span>
                  </div>

                  {/* Participation Type Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Participation Mode *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, teamType: 'team' }))}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          form.teamType === 'team'
                            ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/10'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white">Team Participation</span>
                          <Users size={16} className={form.teamType === 'team' ? 'text-violet-400' : 'text-slate-500'} />
                        </div>
                        <p className="text-xs text-slate-400">Compete with your squad of 2 to 4 members</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, teamType: 'solo', teamName: '' }))}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          form.teamType === 'solo'
                            ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/10'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-white">Solo Developer</span>
                          <User size={16} className={form.teamType === 'solo' ? 'text-violet-400' : 'text-slate-500'} />
                        </div>
                        <p className="text-xs text-slate-400">Participate as an individual challenger</p>
                      </button>
                    </div>
                  </div>

                  {form.teamType === 'team' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-violet-950/20 border border-violet-500/20">
                      <FormField
                        label="Team Name"
                        name="teamName"
                        placeholder="e.g. CyberKnights"
                        value={form.teamName}
                        onChange={handleChange}
                        required
                        icon={Users}
                        error={errors.teamName}
                      />

                      <div className="space-y-1.5 text-left">
                        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                          Expected Team Size
                        </label>
                        <div className="relative">
                          <select
                            name="teamMembersCount"
                            value={form.teamMembersCount}
                            onChange={handleChange}
                            className={`${FLD} pl-4 pr-10 appearance-none bg-[#0e0e1a]`}
                          >
                            <option value="2" className="bg-[#0e0e1a]">2 Members</option>
                            <option value="3" className="bg-[#0e0e1a]">3 Members</option>
                            <option value="4" className="bg-[#0e0e1a]">4 Members</option>
                          </select>
                          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      label="Address Line"
                      name="addressLine"
                      placeholder="e.g. Flat 402, Skyline Residency"
                      value={form.addressLine}
                      onChange={handleChange}
                      icon={MapPin}
                    />

                    <FormField
                      label="City / Town / Village"
                      name="cityVillage"
                      placeholder="e.g. Bengaluru"
                      value={form.cityVillage}
                      onChange={handleChange}
                      required
                      icon={MapPin}
                      error={errors.cityVillage}
                    />

                    <FormField
                      label="State / Province"
                      name="state"
                      placeholder="e.g. Karnataka"
                      value={form.state}
                      onChange={handleChange}
                      required
                      icon={MapPin}
                      error={errors.state}
                    />

                    <FormField
                      label="Pincode / Postal Code"
                      name="pincode"
                      placeholder="e.g. 560001"
                      value={form.pincode}
                      onChange={handleChange}
                      required
                      icon={MapPin}
                      error={errors.pincode}
                    />
                  </div>
                </motion.div>
              )}

              {/* ═══ STEP 3: CUSTOM FIELDS & REVIEW ═══ */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <FileText size={18} className="text-violet-400" /> Additional Info &amp; Review
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">Step 3 of 3</span>
                  </div>

                  <FormField
                    label="GitHub / Portfolio / LinkedIn (Optional)"
                    name="githubOrPortfolio"
                    placeholder="https://github.com/yourhandle or portfolio url"
                    value={form.githubOrPortfolio}
                    onChange={handleChange}
                    icon={Globe}
                  />

                  {/* Dynamic Fields injected by Event Organizer */}
                  {dynamicFields.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-white/10">
                      <h4 className="text-sm font-bold text-violet-300 uppercase tracking-wider">
                        Event Specific Questions
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {dynamicFields.map((field, idx) => (
                          <div key={idx} className="space-y-1.5 text-left">
                            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                              {field.label} {field.required && <span className="text-rose-400">*</span>}
                            </label>
                            {renderDynField(field, idx)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Summary Card */}
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-left">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Registration Summary</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-slate-500">Name:</span>
                        <p className="font-semibold text-white">{form.firstName || '—'}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Mode:</span>
                        <p className="font-semibold text-white capitalize">{form.teamType} {form.teamType === 'team' && `(${form.teamName})`}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">College:</span>
                        <p className="font-semibold text-white truncate">{form.college || '—'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Consent */}
                  <label className="flex items-start gap-3 cursor-pointer select-none text-left p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={form.agreeTerms}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-white/20 bg-black/40"
                    />
                    <span className="text-xs text-slate-400 leading-relaxed">
                      I agree to the <span className="text-violet-400 font-semibold">Code of Conduct</span>, terms of participation, and give Soft Game Studio permission to send event updates via email &amp; WhatsApp.
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stepper Footer Controls */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted 256-bit submission</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-5 py-3.5 rounded-xl font-semibold border border-white/15 text-slate-300 hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-7 py-3.5 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-violet-600 hover:brightness-110 text-white transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Complete Registration <Send size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
