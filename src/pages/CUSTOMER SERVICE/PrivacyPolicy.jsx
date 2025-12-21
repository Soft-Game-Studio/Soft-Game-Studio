import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';

const PrivacyPolicy = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <Layout>
      <Helmet>
  <title>Privacy Policy | Soft Game Studio</title>
  <meta
    name="description"
    content="Read the privacy policy of Soft Game Studio to learn how we collect, use, and protect your personal information while you use our services and products."
  />
  <meta
    name="keywords"
    content="Privacy Policy, Data Protection, Soft Game Studio, User Privacy, Online Exam Security, GDPR, Information Use"
  />
  <meta name="author" content="Soft Game Studio Pvt. Ltd." />
  <meta name="robots" content="index, follow" />

  <meta property="og:title" content="Privacy Policy | Soft Game Studio" />
  <meta
    property="og:description"
    content="Understand how Soft Game Studio handles your personal data, ensures privacy, and complies with regulations like GDPR."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://softgamestudios.web.app/PrivacyPolicy" />
  <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Privacy Policy | Soft Game Studio" />
  <meta
    name="twitter:description"
    content="Learn how Soft Game Studio protects your personal information and ensures your data privacy while using our services."
  />
  <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

  <link rel="canonical" href="https://softgamestudios.web.app/PrivacyPolicy" />
</Helmet>

       <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-neutral-950 dark:to-gray-950 text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* Parallax background */}
      <motion.div 
        className="absolute inset-0 opacity-20 dark:opacity-10"
        style={{ 
          y,
          backgroundImage: "url('https://webjl26.web.app/static/media/stars.7d85fe42.png')",
          backgroundSize: "cover"
        }}
      />
      
      {/* Floating elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: "radial-gradient(circle, rgba(192, 132, 252, 0.4) 0%, transparent 70%)"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-48 h-48 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.25, 0.15]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          background: "radial-gradient(circle, rgba(129, 140, 248, 0.4) 0%, transparent 70%)"
        }}
      />
      
      {/* Content Container */}
      <div className="relative max-w-5xl mx-auto px-4 py-16 z-10">
        {/* Header with logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-600 dark:bg-purple-700 overflow-hidden flex items-center justify-center">
              <img loading="lazy"  src="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" alt="" />
            </div>
            <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-400">Soft Game Studio</h1>
          </div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            className="text-lg text-purple-600 dark:text-purple-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Effective: June 7, 2025
          </motion.p>
        </motion.div>

        {/* Policy sections */}
        <div className="space-y-10">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl dark:shadow-purple-900/10"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-400">Our Commitment to Your Privacy</h2>
            <p className="mb-4">
              At Soft Game Studio, we prioritize the protection of your personal information. 
              This Privacy Policy outlines how we collect, use, and safeguard your data when 
              you interact with our services and products.
            </p>
            <p className="mb-4">
              This policy has been carefully crafted by our legal team to ensure compliance 
              with international privacy standards and to clearly communicate our practices. 
              We do not rely on automated policy generators - every aspect of this document 
              reflects our company's specific practices and values.
            </p>
            <p>
              By using our services, you consent to the data practices described in this policy.
            </p>
          </motion.div>

          {/* Core Principles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl dark:shadow-purple-900/10"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-400">Our Core Privacy Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  title: "Transparency", 
                  icon: "🔍",
                  desc: "We clearly communicate what data we collect and why we need it" 
                },
                { 
                  title: "Minimal Data", 
                  icon: "📉",
                  desc: "We only collect what's necessary to provide our services" 
                },
                { 
                  title: "Security First", 
                  icon: "🔒",
                  desc: "Industry-standard encryption and security protocols protect your data" 
                }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="p-5 bg-purple-50 dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-gray-700"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-lg mb-2 text-purple-800 dark:text-purple-300">{item.title}</h3>
                  <p className="text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Data Collection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl dark:shadow-purple-900/10"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-400">Information We Collect</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">Personal Information</h3>
              <p className="mb-4">
                When you register for an account, purchase our products, or contact support, 
                we may collect:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {[
                  "Full name",
                  "Email address",
                  "Billing address",
                  "Phone number",
                  "Payment information",
                  "Company details (if applicable)"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-1 w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-200">Automated Data Collection</h3>
              <p className="mb-4">
                To improve our services and user experience, we automatically collect:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Device information (type, OS, browser)",
                  "IP address and approximate location",
                  "Usage patterns and interaction data",
                  "Crash reports and performance metrics",
                  "Game progress and achievements"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Data Usage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl dark:shadow-purple-900/10"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-700 dark:text-purple-400">How We Use Your Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg mr-4">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Service Delivery</h3>
                  <p>To provide and maintain our services, process transactions, and authenticate users.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg mr-4">
                  <span className="text-xl">📈</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Product Improvement</h3>
                  <p>To analyze usage patterns and enhance functionality, performance, and security.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg mr-4">
                  <span className="text-xl">📣</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Communication</h3>
                  <p>To respond to inquiries, provide updates, and share important service information.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-lg mr-4">
                  <span className="text-xl">🔐</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Security & Compliance</h3>
                  <p>To detect and prevent fraud, comply with legal obligations, and enforce our terms.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl dark:shadow-purple-900/10 text-center"
          >
            <h2 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-400">Contact Our Privacy Team</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              If you have questions about this policy or your personal data, 
              our dedicated privacy team is ready to assist you.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="mailto:team.softgamestudio@gmail.com"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Email Privacy Team
              </a>
              <a
                href="https://softgamestudios.web.app/ContactUs"
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-purple-600 text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Contact Form
              </a>
            </div>
          </motion.div>
        </div>
        
      
      </div>
    </div>
    </Layout>
   
  );
};

export default PrivacyPolicy;