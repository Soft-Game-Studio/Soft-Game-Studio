// src/components/events/RegistrationForm.jsx
import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import { CheckCircle, Send, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegistrationForm({ eventId, dynamicFields = [], onClose, className = "" }) {
  // Base form state for standard fields
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
    country: 'India',
  });

  // Dynamic fields state as an object { label: value }
  const [customFields, setCustomFields] = useState({});

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCustomFieldChange = (label, value) => {
    setCustomFields(prev => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(fireDB, 'event_registrations'), {
        ...form,
        customFields, // dynamic answers
        eventId: eventId || 'unknown',
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

  // Render dynamic field input based on type
  const renderDynamicField = (field, index) => {
    const { type, label, required, options } = field;
    const value = customFields[label] || '';

    const commonProps = {
      id: `custom-${index}`,
      value,
      onChange: (e) => handleCustomFieldChange(label, e.target.value),
      required,
      className: "w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium",
    };

    switch (type?.toUpperCase()) {
      case 'TEXT':
      case 'EMAIL':
      case 'NUMBER':
      case 'DATE':
        return <input type={type.toLowerCase()} placeholder={label} {...commonProps} />;
      case 'PHONE':
        return <input type="tel" placeholder={label} {...commonProps} />;
      case 'TEXTAREA':
        return <textarea rows="3" placeholder={label} {...commonProps} />;
      case 'SELECT':
        return (
          <select {...commonProps} className={`${commonProps.className} appearance-none bg-white dark:bg-neutral-900 text-slate-900 dark:text-white`}>
            <option value="" className="text-slate-500 bg-white dark:bg-neutral-900">Select {label}</option>
            {(options || []).map((opt, i) => (
              <option key={i} value={opt} className="text-slate-900 dark:text-white bg-white dark:bg-neutral-900">{opt}</option>
            ))}
          </select>
        );
      case 'FILE':
        // File input cannot be fully controlled; use a separate handler
        return (
          <input
            type="file"
            onChange={(e) => handleCustomFieldChange(label, e.target.files?.[0]?.name || '')}
            className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            required={required}
          />
        );
      default:
        return <input type="text" placeholder={label} {...commonProps} />;
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-2xl mx-auto rounded-3xl p-10 bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] text-center relative overflow-hidden ${className}`}
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
          You are officially registered. We've saved your details and will send updates to your email.
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 p-8 sm:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 inline-flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-500" />
              Secure Your Spot
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3 font-medium">Fill in the details below to complete your registration.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Standard Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name *" name="firstName" value={form.firstName} onChange={handleChange} required />
              <Input label="Team Name (Optional)" name="teamName" value={form.teamName} onChange={handleChange} />
              <Input label="Course & Semester *" name="courseSemester" value={form.courseSemester} onChange={handleChange} required />
              <Input label="College/University *" name="college" value={form.college} onChange={handleChange} required />
              <Input label="Age *" name="age" type="number" value={form.age} onChange={handleChange} required />
              <Input label="Mobile Number *" name="mobile" type="tel" value={form.mobile} onChange={handleChange} required />
              <Input label="Email Address *" name="email" type="email" value={form.email} onChange={handleChange} required />
              <Input label="Address Line *" name="addressLine" value={form.addressLine} onChange={handleChange} required />
              <Input label="City/Village *" name="cityVillage" value={form.cityVillage} onChange={handleChange} required />
              <Input label="State *" name="state" value={form.state} onChange={handleChange} required />
              <Input label="Pincode *" name="pincode" value={form.pincode} onChange={handleChange} required />
              <Input label="Country *" name="country" value={form.country} onChange={handleChange} required />
            </div>

            {/* Dynamic Custom Fields */}
            {dynamicFields.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dynamicFields.map((field, index) => (
                    <div key={index} className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
                        {field.label} {field.required && '*'}
                      </label>
                      {renderDynamicField(field, index)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
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

// Reusable input component for standard fields
function Input({ label, name, type = 'text', required, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full p-4 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-black/20 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 font-medium"
      />
    </div>
  );
}