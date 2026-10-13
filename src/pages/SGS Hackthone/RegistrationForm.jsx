// src/pages/SGS Hackthone/RegistrationForm.jsx
import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import {
  CheckCircle2,
  Send,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  MapPin,
  Building,
  Globe,
  Users,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Printer,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

const FLD = "w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] focus:border-transparent transition-all font-medium text-sm";

function FormField({ label, name, type = 'text', required, value, onChange, placeholder, icon: Icon, error }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#00ACF0] transition-colors pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          name={name}
          type={type}
          placeholder={placeholder || label}
          value={value}
          onChange={onChange}
          required={required}
          className={`${FLD} ${Icon ? 'pl-11' : 'pl-4'} ${error ? 'border-rose-500 ring-1 ring-rose-500/30' : ''}`}
        />
      </div>
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
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
    agreeTerms: true,
    honeypot: '' // Anti-bot honeypot
  });

  const [custom, setCustom] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCustom = (label, val) => {
    setCustom((prev) => ({ ...prev, [label]: val }));
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
      newErrors.teamName = "Team Name is required for squad participation";
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
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    if (!form.agreeTerms) {
      alert("Please accept the terms and code of conduct to register.");
      return;
    }

    // Bot trap check
    if (form.honeypot) {
      setSubmitted(true);
      return;
    }

    setLoading(true);
    try {
      const regId = 'SGS-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
      const submissionPayload = {
        firstName: form.firstName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.replace(/\s/g, ''),
        age: form.age,
        college: form.college.trim(),
        courseSemester: form.courseSemester.trim(),
        teamType: form.teamType,
        teamName: form.teamName.trim(),
        teamMembersCount: form.teamMembersCount,
        addressLine: form.addressLine.trim(),
        cityVillage: form.cityVillage.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        country: form.country,
        githubOrPortfolio: form.githubOrPortfolio.trim(),
        customFields: custom,
        eventId: eventId || 'unknown',
        registrationId: regId,
        createdAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(fireDB, 'event_registrations'), submissionPayload);
      setSubmittedData({ ...submissionPayload, docId: docRef.id });
      setSubmitted(true);
    } catch (err) {
      console.error("Registration error:", err);
      alert('Failed to submit registration. Please verify your connection and try again.');
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
      onChange: (e) => handleCustom(label, e.target.value),
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
        return <textarea rows="3" placeholder={label} {...props} className={`${FLD} pl-4 min-h-[90px] resize-y`} />;
      case 'SELECT':
        return (
          <div className="relative">
            <select {...props} className={`${FLD} pl-4 appearance-none pr-10`}>
              <option value="">Select {label}</option>
              {(options || []).map((o, i) => (
                <option key={i} value={o}>{o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
          </div>
        );
      case 'FILE':
        return (
          <input
            type="file"
            onChange={(e) => handleCustom(label, e.target.files?.[0]?.name || '')}
            required={required}
            className={`${FLD} pl-4 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-100 dark:file:bg-sky-950/60 file:text-[#00ACF0] hover:file:bg-sky-200 cursor-pointer`}
          />
        );
      default:
        return <input type="text" placeholder={label} {...props} />;
    }
  };

  /* SUCCESS PASS / TICKET VIEW */
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
      <div className={`w-full max-w-2xl mx-auto rounded-2xl p-6 sm:p-10 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center relative overflow-hidden shadow-sm ${className}`}>
        {/* Celebration Header */}
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-3">
            <Sparkles size={12} /> Registration Confirmed
          </span>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-2">
            You're Confirmed for {eventTitle}
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md mx-auto mb-8">
            Your registration pass has been generated. Save or print this pass for identity verification during event sessions.
          </p>

          {/* DIGITAL HACKATHON PASS CARD */}
          <div className="relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-6 sm:p-8 text-left mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00ACF0]">Official Entry Pass</span>
                <h4 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">{eventTitle}</h4>
              </div>
              <div className="px-3 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-[#00ACF0] font-mono text-xs font-bold">
                {regId}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-neutral-200 dark:border-neutral-800 items-center">
              <div className="sm:col-span-2 space-y-3">
                <div>
                  <span className="text-xs text-neutral-500 uppercase font-semibold">Participant Name</span>
                  <p className="text-base font-bold text-neutral-900 dark:text-white capitalize">{submittedData.firstName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-neutral-500 uppercase font-semibold">Team / Solo</span>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{submittedData.teamName || 'Solo Participant'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 uppercase font-semibold">Institute</span>
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 truncate">{submittedData.college}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-neutral-500 uppercase font-semibold">Contact</span>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">{submittedData.email} - {submittedData.mobile}</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white text-neutral-900 border border-neutral-200 shadow-sm">
                <QRCodeSVG value={qrPayload} size={110} level="M" />
                <span className="text-[10px] font-mono font-bold mt-1.5 text-neutral-600">SCAN AT GATE</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap justify-between items-center text-xs text-neutral-500 dark:text-neutral-400 gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-500" /> Soft Game Studio Verified
              </span>
              <span className="font-mono text-[11px]">
                {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-sm transition flex items-center gap-2"
            >
              <Printer size={15} /> Print / Save Pass
            </button>
            {onClose ? (
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#00ACF0] hover:bg-[#0092cc] text-white font-semibold text-sm shadow-sm transition flex items-center gap-2"
              >
                Back to Event Details <ArrowRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => { setSubmitted(false); setCurrentStep(1); }}
                className="px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-semibold text-sm transition flex items-center gap-2"
              >
                <RefreshCw size={14} /> Register Another
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* STEPPED FORM VIEW */
  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm p-6 sm:p-10">
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] border border-sky-200 dark:border-sky-800 text-xs font-semibold tracking-wider uppercase mb-3">
              <Sparkles size={12} /> Registration Terminal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Register for {eventTitle}
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1 max-w-lg mx-auto">
              Complete your participation registration in 3 simple steps.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-neutral-200 dark:bg-neutral-800 w-full z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#00ACF0] transition-all duration-300 z-0"
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
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition ${
                        isPassed
                          ? 'bg-[#00ACF0] text-white shadow-sm'
                          : isCurrent
                          ? 'bg-[#00ACF0] text-white ring-4 ring-[#00ACF0]/20 shadow-sm'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {isPassed ? <Check size={16} /> : <Icon size={16} />}
                    </button>
                    <span className={`text-[11px] font-medium mt-2 hidden sm:block ${isCurrent ? 'text-[#00ACF0] font-semibold' : 'text-neutral-500'}`}>
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="honeypot"
                value={form.honeypot}
                onChange={handleChange}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            {/* STEP 1: PERSONAL DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <User size={16} className="text-[#00ACF0]" /> Participant Details
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">Step 1 of 3</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    label="Full Name"
                    name="firstName"
                    placeholder="Enter your name"
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
                    placeholder="name@example.com"
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
                    placeholder="e.g. 21"
                    value={form.age}
                    onChange={handleChange}
                    required
                    icon={Calendar}
                    error={errors.age}
                  />

                  <FormField
                    label="College / Institute / University"
                    name="college"
                    placeholder="Name of your institute"
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
              </div>
            )}

            {/* STEP 2: TEAM & LOCATION */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Users size={16} className="text-[#00ACF0]" /> Team & Location Details
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">Step 2 of 3</span>
                </div>

                {/* Participation Type Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                    Participation Mode *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, teamType: 'team' }))}
                      className={`p-4 rounded-xl border text-left transition ${
                        form.teamType === 'team'
                          ? 'bg-sky-50 dark:bg-sky-950/40 border-[#00ACF0] text-neutral-900 dark:text-white shadow-sm'
                          : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">Squad / Team</span>
                        <Users size={16} className={form.teamType === 'team' ? 'text-[#00ACF0]' : 'text-neutral-400'} />
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Compete with your team (2 to 4 members)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, teamType: 'solo', teamName: '' }))}
                      className={`p-4 rounded-xl border text-left transition ${
                        form.teamType === 'solo'
                          ? 'bg-sky-50 dark:bg-sky-950/40 border-[#00ACF0] text-neutral-900 dark:text-white shadow-sm'
                          : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">Solo Challenger</span>
                        <User size={16} className={form.teamType === 'solo' ? 'text-[#00ACF0]' : 'text-neutral-400'} />
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Participate as an individual engineer</p>
                    </button>
                  </div>
                </div>

                {form.teamType === 'team' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                    <FormField
                      label="Team Name"
                      name="teamName"
                      placeholder="e.g. CodeForge"
                      value={form.teamName}
                      onChange={handleChange}
                      required
                      icon={Users}
                      error={errors.teamName}
                    />

                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                        Team Member Count
                      </label>
                      <div className="relative">
                        <select
                          name="teamMembersCount"
                          value={form.teamMembersCount}
                          onChange={handleChange}
                          className={`${FLD} pl-4 pr-10 appearance-none`}
                        >
                          <option value="2">2 Members</option>
                          <option value="3">3 Members</option>
                          <option value="4">4 Members</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    label="Address Line"
                    name="addressLine"
                    placeholder="Street or locality"
                    value={form.addressLine}
                    onChange={handleChange}
                    icon={MapPin}
                  />

                  <FormField
                    label="City / Town"
                    name="cityVillage"
                    placeholder="e.g. Abohar"
                    value={form.cityVillage}
                    onChange={handleChange}
                    required
                    icon={MapPin}
                    error={errors.cityVillage}
                  />

                  <FormField
                    label="State / Province"
                    name="state"
                    placeholder="e.g. Punjab"
                    value={form.state}
                    onChange={handleChange}
                    required
                    icon={MapPin}
                    error={errors.state}
                  />

                  <FormField
                    label="Pincode"
                    name="pincode"
                    placeholder="e.g. 152116"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                    icon={MapPin}
                    error={errors.pincode}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: CUSTOM FIELDS & REVIEW */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <FileText size={16} className="text-[#00ACF0]" /> Review & Additional Information
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">Step 3 of 3</span>
                </div>

                <FormField
                  label="GitHub / Portfolio Link (Optional)"
                  name="githubOrPortfolio"
                  placeholder="https://github.com/yourprofile"
                  value={form.githubOrPortfolio}
                  onChange={handleChange}
                  icon={Globe}
                />

                {/* Dynamic Fields */}
                {dynamicFields.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <h4 className="text-xs font-bold text-[#00ACF0] uppercase tracking-wider">
                      Event-Specific Questions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {dynamicFields.map((field, idx) => (
                        <div key={idx} className="space-y-1.5 text-left">
                          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                            {field.label} {field.required && <span className="text-rose-500">*</span>}
                          </label>
                          {renderDynField(field, idx)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Card */}
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2 text-left">
                  <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Registration Summary</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <span className="text-neutral-400">Name:</span>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200">{form.firstName || '-'}</p>
                    </div>
                    <div>
                      <span className="text-neutral-400">Mode:</span>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200 capitalize">{form.teamType} {form.teamType === 'team' && `(${form.teamName})`}</p>
                    </div>
                    <div>
                      <span className="text-neutral-400">Institute:</span>
                      <p className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">{form.college || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Terms Acceptance */}
                <label className="flex items-start gap-3 cursor-pointer select-none text-left p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 rounded text-[#00ACF0] focus:ring-[#00ACF0]"
                  />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    I agree to the <span className="text-[#00ACF0] font-semibold">Rules & Code of Conduct</span>, and authorize Soft Game Studio to communicate updates regarding this challenge.
                  </span>
                </label>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Protected submission to Soft Game Studio</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-5 py-2.5 rounded-xl font-semibold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition text-sm w-full sm:w-auto flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl font-semibold bg-[#00ACF0] hover:bg-[#0092cc] text-white transition text-sm w-full sm:w-auto flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Continue <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-2.5 rounded-xl font-semibold bg-[#00ACF0] hover:bg-[#0092cc] text-white transition text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" /> Submitting...
                      </>
                    ) : (
                      <>
                        Complete Registration <Send size={15} />
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
