import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const FAQPage = () => {

  const navigate = useNavigate(); // Call the hook at the top

  const sectionRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: '',
    title: ''
  });


  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  // Close context menu on outside click
  const handleClickOutside = (event) => {
    if (contextMenu.visible) {
      closeContextMenu();
    }
  };

  // Close context menu on Escape key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        closeContextMenu();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // FAQ data (unchanged)
  const faqs = [{
    id: 1,
    title: "How to create an account?",
    content: "To create an account, navigate to our sign-up page and enter your email address, choose a secure password, and complete the verification process. You'll receive a confirmation email to activate your account.",
    tags: ["account", "sign-up"]
  },
  {
    id: 2,
    title: "How can I make payment using Paypal?",
    content: "During checkout, select PayPal as your payment method. You'll be redirected to PayPal's secure site to log in and authorize the payment. Once confirmed, you'll return to our site to complete the transaction.",
    tags: ["payment", "paypal"]
  },
  {
    id: 3,
    title: "Can I cancel my subscription plan?",
    content: "Yes, you can cancel your subscription at any time. Go to your account settings, select 'Subscriptions', and choose the plan you wish to cancel. Your access will continue until the end of your current billing period.",
    tags: ["subscription", "billing"]
  },
  {
    id: 4,
    title: "How can I reach technical support?",
    content: "Our support team is available 24/7. You can contact us via live chat on our website, email support@softgamestudio.com, or call +1 (800) 555-1234. Response time is typically under 30 minutes during business hours.",
    tags: ["support", "contact"]
  },
  {
    id: 5,
    title: "What platforms do your games support?",
    content: "Our games are available on Windows, macOS, iOS, and Android. Some titles also support PlayStation, Xbox, and Nintendo Switch. Check individual game pages for specific platform compatibility.",
    tags: ["platforms", "compatibility"]
  },
  {
    id: 6,
    title: "Do you offer educational discounts?",
    content: "Yes, we provide special pricing for educational institutions. Contact our sales team at edu@softgamestudio.com with proof of your academic affiliation to receive a custom quote and discount code.",
    tags: ["education", "discount"]
  }];

  // Handle right-click on FAQ items (unchanged)
  // ...

  const handleContextMenu = (event, faq) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      content: faq.content,
      title: faq.title
    });
  }
  return (
    <Layout>
      <Helmet>
        <title>FAQs | Soft Game Studio - Your Questions Answered</title>
        <meta
          name="description"
          content="Get answers to the most frequently asked questions about Soft Game Studio's online exams, study resources, certifications, game development services, and more."
        />
        <meta
          name="keywords"
          content="Soft Game Studio FAQ, online exams help, free education, affordable courses, certification support, exam registration, technical support"
        />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="FAQs | Soft Game Studio" />
        <meta
          property="og:description"
          content="Browse frequently asked questions about Soft Game Studio's educational services and digital products."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://softgamestudios.web.app/FAQs" />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQs | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Need help? Explore our FAQ section to find answers to common questions about exams, features, and support."
        />
        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
        />
        <link rel="canonical" href="https://softgamestudios.web.app/FAQs" />
      </Helmet>
      <div
        className="min-h-screen transition-colors duration-300 
                   bg-purple-100 text-gray-900
                   dark:bg-neutral-950 dark:text-white"
        onClick={handleClickOutside}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden opacity-10 dark:opacity-[0.03]">
          <div className="absolute inset-0 bg-[url('/path-to-light-pattern.svg')] dark:bg-[url('/path-to-dark-pattern.svg')] bg-cover bg-center"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-cyan-600 dark:bg-gradient-to-r dark:from-purple-400 dark:to-cyan-400   "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Frequently Asked Questions
            </motion.h1>


            <motion.p
              className="max-w-2xl mx-auto text-lg md:text-xl text-purple-700 dark:text-purple-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Find answers to common questions about our game development services, educational programs, and technical support.
            </motion.p>
          </motion.div>

          {/* FAQ Grid */}
          <div
            ref={sectionRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                className="rounded-xl border p-6 transition-all duration-300 backdrop-blur-lg
                          bg-white/80 border-gray-200 hover:border-purple-500 shadow-sm
                          dark:bg-white/10 dark:border-white/20 dark:hover:border-purple-400"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                onContextMenu={(e) => handleContextMenu(e, faq)}
              >
                <div className="flex items-start">
                  <div className="p-2 rounded-lg mr-4 bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                      {faq.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-purple-200">
                      {faq.content.substring(0, 100)}...
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {faq.tags.map((tag, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded
                                  bg-purple-100 text-purple-700
                                  dark:bg-purple-900/50 dark:text-purple-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs flex items-center text-gray-500 dark:text-purple-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Right-click for full details
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            className="mt-16 text-center p-8 rounded-2xl backdrop-blur-sm border
                      bg-gradient-to-r from-purple-100 to-cyan-100 border-gray-200
                      dark:bg-gradient-to-r dark:from-purple-900/30 dark:to-cyan-900/30 dark:border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Need more help?
            </h2>
            <p className="max-w-2xl mx-auto mb-6 text-purple-700 dark:text-purple-200">
              Our support team is ready to assist you with any questions not covered in our FAQ.
            </p>
            <button onClick={() => navigate("/ContactUs")} className="px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-lg
                              bg-gradient-to-r from-purple-500 to-cyan-400 shadow-purple-300/30 text-white
                              dark:bg-gradient-to-r dark:from-purple-600 dark:to-cyan-500 dark:shadow-purple-500/20">
              Contact Support
            </button>
          </motion.div>
        </div>

        {/* Context Menu */}
        {contextMenu.visible && (
          <motion.div
            className="fixed z-50 backdrop-blur-lg rounded-lg shadow-xl p-4 max-w-sm
                      bg-white/95 border border-purple-300 shadow-lg
                      dark:bg-gray-800/90 dark:border-purple-500/30"
            style={{
              top: contextMenu.y,
              left: contextMenu.x,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-purple-600 dark:text-purple-300">
                {contextMenu.title}
              </h3>
              <button
                onClick={closeContextMenu}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-200">
              {contextMenu.content}
            </p>
            <div className="mt-3 pt-3 flex justify-end border-t border-gray-200 dark:border-gray-700">
              <button
                className="text-xs px-3 py-1 rounded transition-colors
                          bg-purple-600 hover:bg-purple-700 text-white
                          dark:bg-purple-700 dark:hover:bg-purple-600"
                onClick={closeContextMenu}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default FAQPage;