// src/pages/CUSTOMER SERVICE/Contact_Us.jsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Helmet } from "react-helmet";
import Layout from "../../components/layout/Layout";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import {
  Send,
  MapPin,
  Mail,
  Phone,
  Clock,
  AlertCircle,
  Info,
  CheckCircle2,
  Building2
} from "lucide-react";
import { fireDB } from "../../DataBase/firebaseConfig";

// Debounce helper
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

// Disposable email domains
const DISPOSABLE_DOMAINS = [
  "tempmail.com", "mailinator.com", "guerrillamail.com", "sharklasers.com",
  "10minutemail.com", "throwawaymail.com", "yopmail.com", "fakeinbox.com",
  "temp-mail.org", "trashmail.com"
];

const ContactPage = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API;
  const [searchParams] = useSearchParams();
  const [isProjectEnquiry, setIsProjectEnquiry] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
    status: "pending",
    honeypot: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 300], shouldReduceMotion ? [0, 0] : [0, -30]);

  // Form validation rules
  const validateField = useCallback((name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > CHARACTER_LIMITS.name)
          return `Name cannot exceed ${CHARACTER_LIMITS.name} characters`;
        if (!/^[A-Za-z\s]+$/.test(value.trim()))
          return "Name should contain letters and spaces only";
        break;

      case "email":
        if (!value.trim()) return "Email address is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
        if (value.length > CHARACTER_LIMITS.email)
          return `Email cannot exceed ${CHARACTER_LIMITS.email} characters`;

        const domain = value.split("@")[1]?.toLowerCase();
        if (domain && DISPOSABLE_DOMAINS.some((d) => domain.includes(d))) {
          return "Please provide a permanent, valid email address";
        }
        break;

      case "mobile":
        if (!value.trim()) return "Mobile number is required";
        const cleanMobile = value.replace(/[^\d]/g, "");
        if (cleanMobile.length < 10 || cleanMobile.length > 15)
          return "Mobile number must be between 10 and 15 digits";
        if (cleanMobile.length > CHARACTER_LIMITS.mobile)
          return `Mobile number cannot exceed ${CHARACTER_LIMITS.mobile} digits`;

        const phoneRegex = /^(\+?91|0)?[6789]\d{9}$/;
        if (!phoneRegex.test(cleanMobile) && !phoneRegex.test("+91" + cleanMobile)) {
          return "Please enter a valid 10-digit mobile number";
        }
        break;

      case "subject":
        if (!value.trim()) return "Subject is required";
        if (value.length < 3) return "Subject must be at least 3 characters";
        if (value.length > CHARACTER_LIMITS.subject)
          return `Subject cannot exceed ${CHARACTER_LIMITS.subject} characters`;
        break;

      case "message":
        if (!value.trim()) return "Message cannot be empty";
        if (value.length < 10) return "Message must be at least 10 characters";
        if (value.length > CHARACTER_LIMITS.message)
          return `Message cannot exceed ${CHARACTER_LIMITS.message} characters`;
        break;

      default:
        return "";
    }
    return "";
  }, []);

  const debouncedValidate = useCallback(
    debounce((name, value, setErrorsFunc) => {
      const error = validateField(name, value);
      setErrorsFunc((prev) => ({ ...prev, [name]: error }));
    }, 250),
    [validateField]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      let processedValue = value;

      switch (name) {
        case "name":
          processedValue = value.replace(/[^A-Za-z\s]/g, "");
          if (processedValue.length > CHARACTER_LIMITS.name) {
            processedValue = processedValue.slice(0, CHARACTER_LIMITS.name);
          }
          break;
        case "mobile":
          processedValue = value.replace(/[^\d\s+()-]/g, "");
          if (processedValue.replace(/[^\d]/g, "").length > 5) {
            processedValue = processedValue.replace(/(\d{5})(\d+)/, "$1 $2");
          }
          if (processedValue.length > 20) {
            processedValue = processedValue.slice(0, 20);
          }
          break;
        case "email":
          if (value.length > CHARACTER_LIMITS.email) {
            processedValue = value.slice(0, CHARACTER_LIMITS.email);
          }
          break;
        case "subject":
          if (value.length > CHARACTER_LIMITS.subject) {
            processedValue = value.slice(0, CHARACTER_LIMITS.subject);
          }
          break;
        case "message":
          if (value.length > CHARACTER_LIMITS.message) {
            processedValue = value.slice(0, CHARACTER_LIMITS.message);
          }
          break;
        default:
          break;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: processedValue
      }));

      if (touched[name]) {
        debouncedValidate(name, processedValue, setErrors);
      }
    },
    [touched, debouncedValidate]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, formData[name]);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [formData, validateField]
  );

  // Save form draft
  useEffect(() => {
    const saveFormData = debounce(() => {
      try {
        localStorage.setItem("contactFormDraft", JSON.stringify(formData));
      } catch (error) {
        console.error("Error saving form draft:", error);
      }
    }, 1000);

    saveFormData();
    return () => {
      if (saveFormData.cancel) saveFormData.cancel();
    };
  }, [formData]);

  // Load draft or prefill from query params
  useEffect(() => {
    const subjectParam = searchParams.get("subject");
    const projectName = searchParams.get("projectName");
    const projectLink = searchParams.get("projectLink");
    const projecturl = searchParams.get("projecturl");
    const projectDesc = searchParams.get("projectDesc");

    if (subjectParam && projectName) {
      const autoMessage = `I would like to request source code or information for project: ${projectName}.\nProject link: ${projectLink || "N/A"}.\nProject URL: ${projecturl || "N/A"}.${projectDesc ? `\nDetails: ${projectDesc}` : ""}\nPlease share details on access and licensing.`;
      setFormData((prev) => ({
        ...prev,
        subject: subjectParam,
        message: autoMessage
      }));
      setIsProjectEnquiry(true);
      localStorage.removeItem("contactFormDraft");
      return;
    }

    try {
      const savedDraft = localStorage.getItem("contactFormDraft");
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setFormData(draftData);
      }
    } catch (error) {
      console.error("Error loading form draft:", error);
    }
  }, [searchParams]);

  const formIsValid = useMemo(() => {
    const requiredFields = ["name", "email", "mobile", "subject", "message"];
    const hasErrors = Object.keys(errors).some((key) => errors[key]);
    const allFilled = requiredFields.every((field) => formData[field].trim());
    return !hasErrors && allFilled && formData.honeypot === "";
  }, [errors, formData]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      subject: "",
      message: "",
      status: "pending",
      honeypot: ""
    });
    setErrors({});
    setTouched({});
    localStorage.removeItem("contactFormDraft");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmissionTime < 30000) {
      toast.error("Please wait 30 seconds before submitting another request.");
      return;
    }

    if (formData.honeypot) {
      toast.success("Message received successfully!");
      resetForm();
      return;
    }

    setIsSubmitting(true);

    const newErrors = {};
    const fieldsToValidate = ["name", "email", "mobile", "subject", "message"];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    const allTouched = {};
    fieldsToValidate.forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please correct the marked errors before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      const submissionData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.replace(/\s/g, ""),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: "pending",
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        submittedAt: new Date().toISOString()
      };

      await addDoc(collection(fireDB, "contacts"), submissionData);
      setLastSubmissionTime(now);

      toast.success(
        <div className="flex items-center gap-2 p-1">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="font-semibold text-sm">Message received! Our team will respond within 24 hours.</span>
        </div>,
        { autoClose: 6000 }
      );

      resetForm();
    } catch (error) {
      console.error("Error saving contact form:", error);
      toast.error("Failed to send message. Please reach out via sgs.web.app@gmail.com directly.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Soft Game Studio",
    "url": "https://softgamestudios.web.app/ContactUs",
    "description": "Get in touch with Soft Game Studio for game development services, project source code, education, and support.",
    "mainEntity": {
      "@type": "LocalBusiness",
      "name": "Soft Game Studio Pvt. Ltd.",
      "telephone": ["+91 9914267704", "+91 6283400770"],
      "email": "sgs.web.app@gmail.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "House No. 574, Street No. 5, Nai Abadi",
        "addressLocality": "Abohar",
        "addressRegion": "Punjab",
        "postalCode": "152116",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "17:00"
      }
    }
  };

  const renderInputField = (fieldName, label, type = "text", placeholder = "", isTextarea = false) => {
    const isError = Boolean(errors[fieldName] && touched[fieldName]);
    const charCount = formData[fieldName]?.length || 0;
    const charLimit = CHARACTER_LIMITS[fieldName];
    const showCharCount = fieldName === "message" || fieldName === "subject";

    return (
      <div className="relative mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <label
            htmlFor={fieldName}
            className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300"
            id={`${fieldName}-label`}
          >
            {label} <span className="text-rose-500">*</span>
          </label>
          {showCharCount && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {charCount} / {charLimit}
            </span>
          )}
        </div>

        {isTextarea ? (
          <textarea
            id={fieldName}
            name={fieldName}
            rows={5}
            value={formData[fieldName]}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            aria-labelledby={`${fieldName}-label`}
            aria-describedby={isError ? `${fieldName}-error` : undefined}
            aria-invalid={isError}
            required
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors duration-200 resize-y bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none ${
              isError
                ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-neutral-300 dark:border-neutral-700 focus:border-[#00ACF0] focus:ring-2 focus:ring-[#00ACF0]/20"
            }`}
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
            aria-invalid={isError}
            required
            className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors duration-200 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none ${
              isError
                ? "border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-neutral-300 dark:border-neutral-700 focus:border-[#00ACF0] focus:ring-2 focus:ring-[#00ACF0]/20"
            }`}
          />
        )}

        {isError && (
          <div
            id={`${fieldName}-error`}
            role="alert"
            aria-live="polite"
            className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errors[fieldName]}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact Us | Soft Game Studio</title>
        <meta
          name="description"
          content="Get in touch with Soft Game Studio for game development services, project source code, educational materials, and technical consultations."
        />
        <link rel="canonical" href="https://softgamestudios.web.app/ContactUs" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://softgamestudios.web.app/ContactUs" />
        <meta property="og:title" content="Contact Our Team | Soft Game Studio" />
        <meta
          property="og:description"
          content="Reach out to Soft Game Studio for Unity game development, educational courses, and project source code inquiries."
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FContact-Us-Soft-Game-Studio-Game-Development-Education-06-07-2025_02_26_PM.png?alt=media&token=3f0e04bb-be8a-46cf-b1f7-6c5d5de6745e"
        />
        <meta property="og:site_name" content="Soft Game Studio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SoftGameStudio" />
        <meta name="twitter:title" content="Contact Us | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Connect with our development and education specialists. We respond within 24 hours."
        />
        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FContact-Us-Soft-Game-Studio-Game-Development-Education-06-07-2025_02_26_PM.png?alt=media&token=3f0e04bb-be8a-46cf-b1f7-6c5d5de6745e"
        />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(contactSchema)}</script>
      </Helmet>

      <ToastContainer position="bottom-right" theme="colored" autoClose={4000} />

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        {/* Header Section */}
        <header className="relative pt-24 pb-14 px-4 bg-gradient-to-b from-neutral-100 via-neutral-50 to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <motion.div
            style={{ y: parallaxY }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] dark:text-sky-400 border border-sky-200 dark:border-sky-900/50 mb-6">
              <Building2 className="w-3.5 h-3.5" />
              Direct Support & Inquiries
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Get in Touch
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Have questions about our games, learning resources, or project source code? Our team is here to assist.
            </p>
          </motion.div>
        </header>

        {/* Main Content Layout */}
        <main className="py-12 sm:py-16 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Contact Details & Location */}
            <aside className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Contact Information
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Connect directly with our headquarters in Abohar, Punjab.
                </p>
              </div>

              {/* Verified Contact Cards */}
              <div className="space-y-4">
                {/* Physical Address */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start gap-4 hover:border-[#00ACF0]/40 transition">
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-[#00ACF0] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Registered Address
                    </h3>
                    <address className="not-italic text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                      House No. 574, Street No. 5<br />
                      Nai Abadi, Abohar<br />
                      Punjab 152116, India
                    </address>
                  </div>
                </div>

                {/* Email Inquiries */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start gap-4 hover:border-[#00ACF0]/40 transition">
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-[#00ACF0] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Official Email
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      General inquiries and project licensing
                    </p>
                    <a
                      href="mailto:sgs.web.app@gmail.com"
                      className="inline-block mt-1 text-sm font-medium text-[#00ACF0] hover:underline"
                    >
                      sgs.web.app@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone Lines */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start gap-4 hover:border-[#00ACF0]/40 transition">
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-[#00ACF0] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Direct Helplines
                    </h3>
                    <div className="mt-1 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                      <p>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">Hindi Support:</span>{" "}
                        <a href="tel:+919914267704" className="hover:text-[#00ACF0] transition">
                          +91 9914267704
                        </a>
                      </p>
                      <p>
                        <span className="font-medium text-neutral-700 dark:text-neutral-300">English Support:</span>{" "}
                        <a href="tel:+916283400770" className="hover:text-[#00ACF0] transition">
                          +91 6283400770
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-start gap-4 hover:border-[#00ACF0]/40 transition">
                  <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-[#00ACF0] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Service Hours
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Monday to Saturday: 9:00 AM - 5:00 PM IST
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Sundays & Gazetted Holidays: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* Google Maps Integration */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-900 p-4">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#00ACF0]" />
                  Studio Location
                </h3>
                <div className="relative h-60 w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
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
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <MapPin className="w-8 h-8 text-neutral-400 mb-2" />
                      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        Abohar, Punjab 152116
                      </p>
                      <a
                        href="https://maps.google.com/?q=Abohar,Punjab"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#00ACF0] underline mt-1"
                      >
                        Open in Google Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* Right Column: Interactive Contact Form */}
            <section aria-labelledby="send-message-heading" className="lg:col-span-7">
              <div className="p-6 sm:p-10 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <div className="mb-8">
                  <h2 id="send-message-heading" className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
                    Send us a Message
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Fill out the fields below. We typically review and respond within 24 hours.
                  </p>
                </div>

                {isProjectEnquiry && (
                  <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-sm">
                    <Info className="w-5 h-5 shrink-0 text-[#00ACF0] mt-0.5" />
                    <div>
                      <p className="font-semibold text-xs tracking-wide uppercase">Project Enquiry Prefilled</p>
                      <p className="text-xs mt-1 text-neutral-600 dark:text-neutral-300">
                        Subject and message details were auto-loaded from the project catalogue. You may edit them freely.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Honeypot anti-spam trap */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="honeypot">Leave blank</label>
                    <input
                      type="text"
                      id="honeypot"
                      name="honeypot"
                      value={formData.honeypot}
                      onChange={handleChange}
                      tabIndex="-1"
                      autoComplete="off"
                    />
                  </div>

                  {renderInputField("name", "Full Name", "text", "Enter your full name")}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    {renderInputField("email", "Email Address", "email", "name@example.com")}
                    {renderInputField("mobile", "Mobile Number", "tel", "10-digit mobile number")}
                  </div>

                  {renderInputField("subject", "Subject", "text", "What is this inquiry regarding?")}

                  {renderInputField(
                    "message",
                    "Message",
                    "text",
                    "Describe your requirements, questions, or project inquiry...",
                    true
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || !formIsValid}
                      className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-[#00ACF0] hover:bg-[#0092cc] active:scale-[0.99] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="mt-4 text-center">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Protected by honeypot anti-spam. Your contact details are stored securely.
                      </p>
                      {!formIsValid && !isSubmitting && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          Please complete all required fields correctly to enable submission.
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default ContactPage;