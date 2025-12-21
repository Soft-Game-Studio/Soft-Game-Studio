// ContactPage.jsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Helmet } from "react-helmet";
import Layout from "../../components/layout/Layout";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {ToastContainer, toast } from "react-toastify";
import { Send, MapPin, Mail, Phone, Clock, AlertCircle } from "lucide-react";
import { fireDB } from "../../DataBase/firebaseConfig";

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Character limits
const CHARACTER_LIMITS = {
  name: 100,
  email: 255,
  mobile: 15,
  subject: 200,
  message: 2000
};

// Disposable email domains (partial list)
const DISPOSABLE_DOMAINS = [
  'tempmail.com', 'mailinator.com', 'guerrillamail.com', 'sharklasers.com',
  '10minutemail.com', 'throwawaymail.com', 'yopmail.com', 'fakeinbox.com',
  'temp-mail.org', 'trashmail.com'
];

const ContactPage = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: '',
    status: 'pending',
    honeypot: '' // Hidden field for bot detection
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  // Form validation rules
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        if (value.length > CHARACTER_LIMITS.name) 
          return `Name cannot exceed ${CHARACTER_LIMITS.name} characters`;
        if (!/^[A-Za-z\s]+$/.test(value.trim())) return 'Name should contain only letters and spaces';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        if (value.length > CHARACTER_LIMITS.email)
          return `Email cannot exceed ${CHARACTER_LIMITS.email} characters`;
        
        // Check for disposable email domains
        const domain = value.split('@')[1]?.toLowerCase();
        if (domain && DISPOSABLE_DOMAINS.some(d => domain.includes(d))) {
          return 'Please use a permanent email address';
        }
        break;
      case 'mobile':
        if (!value.trim()) return 'Mobile number is required';
        const cleanMobile = value.replace(/[^\d]/g, '');
        if (cleanMobile.length < 10 || cleanMobile.length > 15) return 'Mobile number must be 10-15 digits';
        if (cleanMobile.length > CHARACTER_LIMITS.mobile)
          return `Mobile number cannot exceed ${CHARACTER_LIMITS.mobile} digits`;
        
        // Enhanced phone validation
        const phoneRegex = /^(\+?91|0)?[6789]\d{9}$/;
        if (!phoneRegex.test(cleanMobile) && !phoneRegex.test('+91' + cleanMobile)) {
          return 'Please enter a valid Indian mobile number';
        }
        break;
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.length < 3) return 'Subject must be at least 3 characters';
        if (value.length > CHARACTER_LIMITS.subject)
          return `Subject cannot exceed ${CHARACTER_LIMITS.subject} characters`;
        break;
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.length < 10) return 'Message must be at least 10 characters';
        if (value.length > CHARACTER_LIMITS.message)
          return `Message cannot exceed ${CHARACTER_LIMITS.message} characters`;
        break;
      default:
        return '';
    }
    return '';
  }, []);

  // Debounced validation for performance
  const debouncedValidate = useCallback(
    debounce((name, value, setErrorsFunc) => {
      const error = validateField(name, value);
      setErrorsFunc(prev => ({ ...prev, [name]: error }));
    }, 300),
    [validateField]
  );

  // Handle input change with validation
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Apply specific formatting/rules for each field
    switch (name) {
      case 'name':
        // Allow only letters and spaces for name
        processedValue = value.replace(/[^A-Za-z\s]/g, '');
        if (processedValue.length > CHARACTER_LIMITS.name) {
          processedValue = processedValue.slice(0, CHARACTER_LIMITS.name);
        }
        break;
      case 'mobile':
        // Allow only numbers, plus, minus, parentheses, and spaces
        processedValue = value.replace(/[^\d\s+()-]/g, '');
        // Format as user types
        if (processedValue.replace(/[^\d]/g, '').length > 5) {
          processedValue = processedValue.replace(/(\d{5})(\d+)/, '$1 $2');
        }
        if (processedValue.length > 20) {
          processedValue = processedValue.slice(0, 20);
        }
        break;
      case 'email':
        // Limit email length
        if (value.length > CHARACTER_LIMITS.email) {
          processedValue = value.slice(0, CHARACTER_LIMITS.email);
        } else {
          processedValue = value;
        }
        break;
      case 'subject':
        if (value.length > CHARACTER_LIMITS.subject) {
          processedValue = value.slice(0, CHARACTER_LIMITS.subject);
        }
        break;
      case 'message':
        if (value.length > CHARACTER_LIMITS.message) {
          processedValue = value.slice(0, CHARACTER_LIMITS.message);
        }
        break;
      default:
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Debounced real-time validation for touched fields
    if (touched[name]) {
      debouncedValidate(name, processedValue, setErrors);
    }
  }, [touched, debouncedValidate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    
    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [formData, validateField]);

  // Save form draft to localStorage
  useEffect(() => {
    const saveFormData = debounce(() => {
      try {
        localStorage.setItem('contactFormDraft', JSON.stringify(formData));
      } catch (error) {
        console.error('Error saving form draft:', error);
      }
    }, 1000);
    
    saveFormData();
    
    return () => {
      if (saveFormData.cancel) saveFormData.cancel();
    };
  }, [formData]);

  // Load form draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('contactFormDraft');
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
      }
    } catch (error) {
      console.error('Error loading form draft:', error);
    }
  }, []);

  // Check form validity for submit button
  const formIsValid = useMemo(() => {
    const requiredFields = ['name', 'email', 'mobile', 'subject', 'message'];
    const hasErrors = Object.keys(errors).some(key => errors[key]);
    const allFilled = requiredFields.every(field => formData[field].trim());
    return !hasErrors && allFilled && formData.honeypot === '';
  }, [errors, formData]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Rate limiting: Prevent multiple submissions within 30 seconds
    const now = Date.now();
    if (now - lastSubmissionTime < 30000) {
      toast.error('Please wait 30 seconds before submitting again');
      return;
    }
    
    // Honeypot check
    if (formData.honeypot) {
      console.log('Bot detected via honeypot');
      toast.success("Message sent successfully!");
      resetForm();
      return;
    }
    
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors = {};
    const fieldsToValidate = ['name', 'email', 'mobile', 'subject', 'message'];
    
    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    
    setErrors(newErrors);
    
    // Mark all fields as touched
    const allTouched = {};
    fieldsToValidate.forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);
    
    // Check for errors
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors in the form");
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Prepare data for Firebase
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.replace(/\s/g, ''),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: 'pending',
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        submittedAt: new Date().toISOString()
      };
      
      await addDoc(collection(fireDB, 'contacts'), submissionData);
      
      setLastSubmissionTime(now);
      
      toast.success(
        <div className="p-2">
          <p className="font-bold text-lg">🎉 Message sent successfully!</p>
        </div>,
        {
          autoClose: 10000,
          closeOnClick: false
        }
      );
      
      resetForm();
      
    } catch (error) {
      console.error('Error saving contact form:', error);
      toast.error(
        <div>
          <p>Failed to send message.</p>
          <p className="text-sm mt-1">Please try again or email us directly.</p>
        </div>
      );
    } finally {
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000); // stop loader after 5 sec
      
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      subject: '',
      message: '',
      status: 'pending',
      honeypot: ''
    });
    setErrors({});
    setTouched({});
    localStorage.removeItem('contactFormDraft');
  };

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 300], [0, -50]);
  const fadeIn = useTransform(scrollY, [0, 300], [1, 0.9]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] 
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 30px -10px rgba(124, 58, 237, 0.5)"
    },
    tap: { scale: 0.98 },
    loading: {
      scale: 0.98,
      backgroundColor: "#4F46E5"
    }
  };

  // Helper function to render input field
  const renderInputField = (fieldName, label, type = 'text', placeholder = '', isTextarea = false) => {
    const isError = errors[fieldName] && touched[fieldName];
    const charCount = formData[fieldName]?.length || 0;
    const charLimit = CHARACTER_LIMITS[fieldName];
    const showCharCount = fieldName === 'message' || fieldName === 'subject';
    
    return (
      <div className="relative mb-6">
        <label 
          htmlFor={fieldName}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          id={`${fieldName}-label`}
        >
          {label}
          <span className="text-red-500 ml-1">*</span>
          {showCharCount && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {charCount}/{charLimit}
            </span>
          )}
        </label>
        
        {isTextarea ? (
          <textarea
            id={fieldName}
            name={fieldName}
            value={formData[fieldName]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={5}
            aria-labelledby={`${fieldName}-label`}
            aria-describedby={isError ? `${fieldName}-error` : undefined}
            aria-invalid={isError ? "true" : "false"}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all duration-200
              ${isError 
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
              }
              bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none
              resize-none
            `}
            required
          />
        ) : (
          <input
            id={fieldName}
            name={fieldName}
            type={type}
            value={formData[fieldName]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            aria-labelledby={`${fieldName}-label`}
            aria-describedby={isError ? `${fieldName}-error` : undefined}
            aria-invalid={isError ? "true" : "false"}
            className={`
              w-full px-4 py-3 rounded-lg border transition-all duration-200
              ${isError 
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500' 
                : 'border-gray-300 dark:border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500'
              }
              bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm
              text-gray-900 dark:text-gray-100
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none
            `}
            required
          />
        )}
        
        {isError && (
          <div 
            id={`${fieldName}-error`}
            className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
            {errors[fieldName]}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 overflow-hidden relative">
        <Helmet>
          <title>Contact Us - Soft Game Studio | Game Development & Education</title>
          <meta name="title" content="Contact Soft Game Studio - Game Development Experts" />
          <meta name="description" content="Get in touch with Soft Game Studio for game development services, educational programs, and innovative tech solutions." />
          <link rel="canonical" href="https://softgamestudios.web.app/ContactUs" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://softgamestudios.web.app/ContactUs" />
          <meta property="og:title" content="Contact Our Team - Soft Game Studio" />
          <meta property="og:description" content="Reach out to our game development experts. We specialize in Unity development, educational games, and interactive experiences." />
          <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FContact-Us-Soft-Game-Studio-Game-Development-Education-06-07-2025_02_26_PM.png?alt=media&token=3f0e04bb-be8a-46cf-b1f7-6c5d5de6745e" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:locale" content="en_US" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@SoftGameStudio" />
          <meta name="twitter:creator" content="@SGS_Devs" />
        </Helmet>

 <ToastContainer/>
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-purple-200 dark:bg-purple-900/20 blur-3xl opacity-50" />
          <div className="absolute bottom-40 right-20 w-64 h-64 rounded-full bg-indigo-200 dark:bg-indigo-900/20 blur-3xl opacity-40" />
          <div className="absolute top-1/2 left-1/3 w-96 h-96 rounded-full bg-blue-100 dark:bg-blue-900/10 blur-3xl opacity-30" />
        </motion.div>

        {/* Floating Particles */}
        <motion.div
          className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-purple-500/20 backdrop-blur-sm"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/3 w-6 h-6 rounded-full bg-indigo-500/20 backdrop-blur-sm"
          animate={{
            y: [0, -40, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />

        {/* Main Content */}
        <motion.section
          style={{ y: parallaxY, opacity: fadeIn }}
          className="min-h-screen relative z-10 text-gray-900 dark:text-gray-200 px-4 py-12 sm:py-16 md:py-20 transition-colors duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              className="text-center mb-12 sm:mb-16 md:mb-20"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Get in Touch
              </motion.h1>
              <motion.p
                className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Have questions or want to work together? Reach out to our team and we'll respond within 24 hours.
              </motion.p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Contact Information */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="lg:w-2/5 space-y-6 sm:space-y-8"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                    Contact Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Connect with us through any of these channels
                  </p>
                </motion.div>

                {/* Contact Cards */}
                <motion.div variants={itemVariants} className="space-y-4">
                  <motion.div
                    className="group bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg border border-purple-200/50 dark:border-neutral-700/50 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-xl"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                        <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Address</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                          House No. 574, Street No. 5<br />
                          Nai Abadi, Abohar<br />
                          Punjab 152116
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="group bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg border border-indigo-200/50 dark:border-neutral-700/50 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-xl"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                        <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                        <a
                          href="mailto:team.softgamestudio@gmail.com"
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors text-sm sm:text-base"
                        >
                          team.softgamestudio@gmail.com
                        </a>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="group bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg border border-blue-200/50 dark:border-neutral-700/50 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-xl"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                        <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                        <div className="space-y-1">
                          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <span className="font-medium">Hindi:</span> +91 9914267704
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <span className="font-medium">English:</span> +91 6283400770
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="group bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-lg border border-green-200/50 dark:border-neutral-700/50 hover:border-green-300 dark:hover:border-green-500 transition-all duration-300 hover:shadow-xl"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                        <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Service Hours</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                          Monday – Saturday<br />
                          9:00 AM – 5:00 PM
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Google Maps */}
                <motion.div variants={itemVariants} className="mt-6">
                  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-700 shadow-lg bg-white dark:bg-neutral-800 p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Our Location
                    </h3>
                    <div className="relative h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden">
                      {GOOGLE_MAPS_API_KEY ? (
                        <iframe
                          title="Soft Game Studio Location"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=Soft+Game+Studio,Abohar,Punjab&zoom=15`}
                          className="absolute inset-0"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <p className="text-gray-500 dark:text-gray-400">Map unavailable</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="lg:w-3/5"
              >
                <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-neutral-700/50 p-6 sm:p-8 lg:p-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      Send us a Message
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </motion.div>

                  <form onSubmit={handleSubmit} className="space-y-1">
                    {/* Honeypot field for bot detection */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="honeypot">Leave this field empty</label>
                      <input
                        type="text"
                        id="honeypot"
                        name="honeypot"
                        value={formData.honeypot}
                        onChange={handleChange}
                        tabIndex="-1"
                        autoComplete="off"
                        className="hidden"
                      />
                    </div>

                    {/* Name Field */}
                    <div>
                      {renderInputField(
                        'name',
                        'Full Name',
                        'text',
                        'Enter your full name (letters only)'
                      )}
                    </div>

                    {/* Email and Mobile in grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        {renderInputField(
                          'email',
                          'Email Address',
                          'email',
                          'Enter your email address'
                        )}
                      </div>
                      
                      <div>
                        {renderInputField(
                          'mobile',
                          'Mobile Number',
                          'tel',
                          'Enter your mobile number'
                        )}
                      </div>
                    </div>

                    {/* Subject Field */}
                    <div>
                      {renderInputField(
                        'subject',
                        'Subject',
                        'text',
                        'What is this regarding?'
                      )}
                    </div>

                    {/* Message Field */}
                    <div>
                      {renderInputField(
                        'message',
                        'Message',
                        'text',
                        'Type your message here...',
                        true
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="pt-4"
                    >
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || !formIsValid}
                        variants={buttonVariants}
                        initial="initial"
                        whileHover={!isSubmitting && formIsValid ? "hover" : ""}
                        whileTap={!isSubmitting && formIsValid ? "tap" : ""}
                        animate={isSubmitting ? "loading" : ""}
                        className={`
                          w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg 
                          hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 
                          disabled:opacity-50 disabled:cursor-not-allowed 
                          flex items-center justify-center gap-3 shadow-lg
                          ${!formIsValid && !isSubmitting ? 'opacity-70' : ''}
                        `}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>

                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          We typically respond within 24 hours
                        </p>
                        {!formIsValid && !isSubmitting && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                            Please fill in all required fields correctly
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
};

export default ContactPage;