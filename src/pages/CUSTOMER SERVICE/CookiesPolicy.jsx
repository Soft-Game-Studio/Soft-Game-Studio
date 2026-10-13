import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";

const CookiesPolicy = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const cookieData = [
    {
      name: "termsAccepted",
      purpose: "Remembers if the user accepted Terms & Conditions",
      type: "First-party",
      data: "true / false",
      duration: "1 year",
      essential: "Yes",
    },
    {
      name: "_ga, _gid",
      purpose: "Tracks usage behavior via Google Analytics for site improvement",
      type: "Third-party",
      data: "Anonymous user ID and session data",
      duration: "2 years / 24 hours",
      essential: "No",
    },
    {
      name: "firebase-auth",
      purpose: "Maintains user login session using Firebase authentication (Email, Google, GitHub)",
      type: "First-party",
      data: "Firebase Auth ID token (JWT)",
      duration: "Session (until browser close)",
      essential: "Yes",
    },
    {
      name: "userProfile",
      purpose: "Stores user information like name, email, phone, and address after login",
      type: "First-party",
      data: "User name, email, phone, address",
      duration: "1 year",
      essential: "Yes",
    },
    {
      name: "cartData",
      purpose: "Stores selected product IDs and their quantity for shopping cart",
      type: "First-party",
      data: "Array of product IDs, quantity, selected variants",
      duration: "30 days",
      essential: "No",
    },
    {
      name: "orderHistory",
      purpose: "Saves a temporary record of placed orders for confirmation and local reference",
      type: "First-party",
      data: "Order ID, items, payment status",
      duration: "30 days",
      essential: "No",
    },
    {
      name: "paymentSession",
      purpose: "Tracks ongoing payment session details for Razorpay or other integrations",
      type: "Third-party / First-party (depending on provider)",
      data: "Transaction ID, status, session info",
      duration: "Session",
      essential: "Yes",
    },
    {
      name: "theme",
      purpose: "Remembers user’s selected UI theme (dark/light)",
      type: "First-party",
      data: "dark / light",
      duration: "1 year",
      essential: "No",
    }
  ];


  return (
    <Layout>
      <Helmet>
        <title>Cookies Policy | Soft Game Studio</title>
        <meta
          name="description"
          content="Learn how Soft Game Studio uses cookies to enhance your experience and manage your preferences on our website."
        />
        <meta
          name="keywords"
          content="Cookies Policy, Soft Game Studio, Cookie Usage, Website Cookies, Privacy, Tracking, Online Experience"
        />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Cookies Policy | Soft Game Studio" />
        <meta
          property="og:description"
          content="Find out about the types of cookies used by Soft Game Studio and how they improve your browsing experience."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://softgamestudios.web.app/CookiesPolicy" />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cookies Policy | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Understand Soft Game Studio’s cookie usage and how it affects your online experience."
        />
        <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        <link rel="canonical" href="https://softgamestudios.web.app/CookiesPolicy" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-gray-950 dark:to-neutral-950 text-gray-800 dark:text-gray-200 overflow-hidden">
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            y,
            backgroundImage: "url('https://webjl26.web.app/static/media/stars.7d85fe42.png')",
            backgroundSize: "cover"
          }}
        />

        {/* Floating cookies */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-12 h-12 rounded-full bg-amber-200 dark:bg-amber-400 opacity-80"
            initial={{
              y: Math.random() * 100,
              x: Math.random() * 100,
              scale: 0.8
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 15, 0],
              x: [0, Math.random() > 0.5 ? 20 : -20, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              top: `${10 + i * 15}%`,
              left: `${10 + i * 10}%`,
              borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)"
            }}
          >
            <div className="absolute w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-600 top-2 left-3"></div>
            <div className="absolute w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-600 top-2 right-3"></div>
            <div className="absolute w-3 h-3 rounded-full bg-amber-400 dark:bg-amber-600 bottom-2 left-6"></div>
          </motion.div>
        ))}

        {/* Content Container */}
        <div className="relative max-w-5xl mx-auto px-4 py-16 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 text-blue-600 dark:text-blue-400"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              🍪 Cookie Policy
            </motion.h1>
            <motion.p
              className="text-xl text-purple-600 dark:text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Last Updated: June 7, 2025
            </motion.p>
          </motion.div>

          <div className="space-y-10">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-xl">
                  <span className="text-3xl">ℹ️</span>
                </div>
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">Understanding Cookies</h2>
              </div>
              <p className="mb-4">
                At <strong className="text-blue-600 dark:text-blue-400">Soft Game Studio</strong>, we use cookies to enhance your experience,
                analyze traffic, and deliver personalized content. This policy explains what
                cookies we use and how they work.
              </p>
              <p>
                Cookies are small text files stored on your browser or device by websites
                you visit. They help remember your preferences, login sessions, and improve
                functionality.
              </p>
            </motion.div>

            {/* Cookie Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-xl">
                  <span className="text-3xl">📋</span>
                </div>
                <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400">Cookies We Use</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-blue-50 dark:bg-gray-800">
                    <tr>
                      <th className="p-3 border-b dark:border-gray-700 font-semibold text-blue-700 dark:text-blue-300">Cookie Name</th>
                      <th className="p-3 border-b dark:border-gray-700 font-semibold text-blue-700 dark:text-blue-300">Purpose</th>
                      <th className="p-3 border-b dark:border-gray-700 font-semibold text-blue-700 dark:text-blue-300">Type</th>
                      <th className="p-3 border-b dark:border-gray-700 font-semibold text-blue-700 dark:text-blue-300">Stored Data</th>
                      <th className="p-3 border-b dark:border-gray-700 font-semibold text-blue-700 dark:text-blue-300">Duration</th>
                      <th className="p-3 border-b dark:border-gray-700 font-semibold text-blue-700 dark:text-blue-300">Essential</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieData.map((cookie, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="border-t dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800"
                      >
                        <td className="p-3 font-medium">{cookie.name}</td>
                        <td className="p-3">{cookie.purpose}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${cookie.type === "First-party"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300"
                            }`}>
                            {cookie.type}
                          </span>
                        </td>
                        <td className="p-3">{cookie.data}</td>
                        <td className="p-3">{cookie.duration}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${cookie.essential === "Yes"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                            }`}>
                            {cookie.essential}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Third-party Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-100 dark:bg-orange-900/50 p-3 rounded-xl">
                  <span className="text-3xl">🌐</span>
                </div>
                <h2 className="text-2xl font-bold text-orange-700 dark:text-orange-400">Third-Party Cookies</h2>
              </div>
              <p className="mb-4">
                We use services like Google Analytics and Firebase. These services may set
                their own cookies. Learn more at:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <a
                  href="https://policies.google.com/technologies/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-gray-800 rounded-xl hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-xl">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Google Cookie Policy</h3>
                    <p className="text-sm opacity-80">policies.google.com</p>
                  </div>
                </a>
                <a
                  href="https://firebase.google.com/support/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-gray-800 rounded-xl hover:bg-orange-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-xl">
                    <span className="text-3xl">🔥</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Firebase Privacy Policy</h3>
                    <p className="text-sm opacity-80">firebase.google.com</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Management Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-xl">
                  <span className="text-3xl">⚙️</span>
                </div>
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Managing Cookies</h2>
              </div>
              <p className="mb-4">
                You can control or disable cookies via your browser settings. However, some
                essential features like login or quizzes may not work properly without
                them.
              </p>
              <div className="mt-6 p-4 bg-green-50 dark:bg-gray-800 rounded-xl">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <span>💡</span> Browser Cookie Settings
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Chrome: Settings → Privacy → Cookies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Firefox: Options → Privacy → Cookies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Safari: Preferences → Privacy → Cookies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Edge: Settings → Cookies and permissions
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-xl">
                  <span className="text-3xl">📬</span>
                </div>
                <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400">Contact Us</h2>
              </div>
              <p className="mb-6">
                If you have any questions regarding our use of cookies, please contact us:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="mailto:team.softgamestudio@gmail.com"
                  className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-gray-800 rounded-xl hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-xl">
                    <span className="text-3xl">📧</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Email Us</h3>
                    <p className="text-sm opacity-80">team.softgamestudio@gmail.com</p>
                  </div>
                </a>
                <a
                  href="https://softgamestudios.web.app/ContactUs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-gray-800 rounded-xl hover:bg-purple-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-xl">
                    <span className="text-3xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="font-bold">Contact Form</h3>
                    <p className="text-sm opacity-80">softgamestudio.web.app</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>


        </div>
      </div>
    </Layout>
  );
};

export default CookiesPolicy;