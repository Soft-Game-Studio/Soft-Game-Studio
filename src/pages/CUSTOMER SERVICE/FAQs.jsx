// src/pages/CUSTOMER SERVICE/FAQs.jsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Mail,
  ArrowRight,
  CreditCard,
  User,
  Headphones,
  Laptop,
  GraduationCap
} from 'lucide-react';

const FAQPage = () => {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(1); // First item open by default

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'account', label: 'Accounts & Registration' },
    { id: 'payment', label: 'Payments & Billing' },
    { id: 'academic', label: 'Exams & Courses' },
    { id: 'support', label: 'Technical Support' },
  ];

  const faqs = [
    {
      id: 1,
      category: 'account',
      title: "How do I create and verify an account on Soft Game Studio?",
      content: "Navigate to our Sign Up page and enter your name, email address, and a secure password. Once submitted, you will receive an account confirmation link or OTP to complete verification and gain access to notes and dashboard features.",
      tags: ["account", "sign-up", "verification"]
    },
    {
      id: 2,
      category: 'payment',
      title: "What payment methods are supported for paid course notes and publications?",
      content: "We accept all major UPI applications (Google Pay, PhonePe, Paytm, BHIM), Net Banking, RuPay, Visa, and MasterCard credit/debit cards via secure payment gateways. Transactions are executed with end-to-end TLS encryption.",
      tags: ["payment", "upi", "cards"]
    },
    {
      id: 3,
      category: 'academic',
      title: "Can I download e-books and study notes as offline PDF files?",
      content: "Yes. All technical publications in our E-Books library allow you to export individual chapters or download all modules collectively as formatted PDF documents for offline studying.",
      tags: ["ebooks", "pdf", "download"]
    },
    {
      id: 4,
      category: 'academic',
      title: "How do the coding quizzes and skill certifications work?",
      content: "Our online assessment platform allows students to test their syntax and algorithmic knowledge in C, C++, Python, Java, and Web Development. Upon achieving a passing threshold, a verifiable digital certificate is generated.",
      tags: ["quiz", "certification", "exams"]
    },
    {
      id: 5,
      category: 'support',
      title: "How can I reach technical support if I encounter a platform error?",
      content: "Our engineering and customer care team can be reached directly at team.softgamestudio@gmail.com or via our Contact Us portal. Technical inquiries are typically resolved within one business day.",
      tags: ["support", "contact", "help"]
    },
    {
      id: 6,
      category: 'account',
      title: "Do you offer academic discounts for student batches or colleges?",
      content: "Yes. We offer institutional access and discount codes for accredited colleges, universities, and student coding clubs. Reach out through our contact desk with institutional details to receive custom provisions.",
      tags: ["education", "discount", "college"]
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = !searchQuery.trim() || 
        faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const toggleFaq = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  // Structured Data FAQPage Schema for Search Engines & Google AI
  const structuredData = useMemo(() => {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://softgamestudios.web.app/FAQs#faq",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.title,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.content
        }
      }))
    });
  }, []);

  const pageTitle = "Frequently Asked Questions | Soft Game Studio";
  const pageDescription = "Find answers to common questions about accounts, course notes, PDF downloads, quizzes, certifications, and technical support on Soft Game Studio.";
  const canonicalUrl = "https://softgamestudios.web.app/FAQs";

  return (
    <Layout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Soft Game Studio FAQ, Coding Notes Help, E-Book Download Help, Exam Certification Support, Student Learning FAQ" />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Soft Game Studio" />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {structuredData}
        </script>
      </Helmet>

      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-neutral-900">
        
        {/* ── Header ────────────────────────────────────────────────── */}
        <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              <Link to="/" className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-neutral-900 dark:text-neutral-200 font-medium">
                FAQs
              </span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-medium tracking-wide uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-[#00ACF0]" />
              <span>Help Center & Knowledge Base</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
              Frequently Asked Questions
            </h1>

            <p className="mt-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Quick, authoritative answers to common inquiries regarding our study materials, examinations, certifications, and technical support.
            </p>

            {/* Real-time Search Filter Input */}
            <div className="mt-8 max-w-md mx-auto relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, exams, or payments..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-xs sm:text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] dark:focus:ring-[#00ACF0] transition-shadow shadow-xs"
                aria-label="Search frequently asked questions"
              />
            </div>
          </div>
        </header>

        {/* ── Content Body ──────────────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion Questions List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="py-16 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8">
                <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                  No matching answers found
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Try adjusting your query or send a message directly to our support desk.
                </p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isOpen = expandedId === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left select-none hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-400"
                    >
                      <span className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        {faq.title}
                      </span>
                      <span className="shrink-0 p-1 text-neutral-400">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${faq.id}`}
                          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="border-t border-neutral-100 dark:border-neutral-800/80 px-4 sm:px-5 py-4 bg-neutral-50/50 dark:bg-neutral-800/20"
                        >
                          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            {faq.content}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          {/* Contact Support Banner */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-white p-6 sm:p-8 text-center shadow-xs">
            <h2 className="text-lg font-bold text-white mb-1.5">
              Still Have Questions?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto mb-6 leading-relaxed">
              Our engineering and student support staff are available to assist with any questions not listed above.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="mailto:team.softgamestudio@gmail.com?subject=FAQ%20Inquiry"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4 text-[#00ACF0]" />
                <span>Email Customer Support</span>
              </a>
              <Link
                to="/ContactUs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium border border-neutral-700 hover:bg-white/10 transition-colors"
              >
                <span>Submit Ticket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </main>
    </Layout>
  );
};

export default FAQPage;