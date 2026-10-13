import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Layout from "../../components/layout/Layout";
import { Helmet } from "react-helmet";
const ReturnPolicy = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <Layout>
      <Helmet>
        <title>Return & Refund Policy | Soft Game Studio</title>
        <meta
          name="description"
          content="Read Soft Game Studio’s Return and Refund Policy to understand our no-return, no-refund terms and how to contact our support team for any inquiries."
        />
        <meta
          name="keywords"
          content="Return Policy, Refund Policy, Soft Game Studio, No Returns, No Refunds, Customer Support, Purchase Terms"
        />
        <meta name="author" content="Soft Game Studio" />
        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="Return & Refund Policy | Soft Game Studio" />
        <meta
          property="og:description"
          content="Understand Soft Game Studio’s strict no-return, no-refund policy and learn how to reach out for any questions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://softgamestudios.web.app/ReturnPolicy" />
        <meta property="og:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Return & Refund Policy | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Review Soft Game Studio’s Return and Refund Policy to know your purchase rights and our contact info."
        />
        <meta name="twitter:image" content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" />
        <meta name="twitter:site" content="@SoftGameStudio" />

        <link rel="canonical" href="https://softgamestudios.web.app/ReturnPolicy" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-950 dark:to-neutral-950 text-gray-800 dark:text-gray-200 overflow-hidden">
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
          className="absolute top-[15%] left-[15%] w-64 h-64 rounded-full blur-3xl"
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
          className="absolute bottom-[25%] right-[15%] w-48 h-48 rounded-full blur-3xl"
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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-600 dark:bg-purple-700 overflow-hidden flex items-center justify-center">
                <img loading="lazy" src="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media" alt="" />
              </div>
              <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-400">Soft Game Studio</h1>
            </div>

            <motion.h1
              className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Return & Refund Policy
            </motion.h1>
            <motion.p
              className="text-lg text-purple-600 dark:text-purple-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Last Updated: January 09, 2025
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
              className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-xl">
                  <span className="text-3xl">📝</span>
                </div>
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">Our Policy</h2>
              </div>
              <p className="mb-4">
                Thank you for shopping at <strong className="text-blue-600 dark:text-blue-400">Soft Game Studio</strong>.
              </p>
              <p className="mb-4">
                We hope that you are satisfied with your purchase. However, please
                note that due to the nature of our products, all sales are final. We
                do not accept returns or issue refunds under any circumstances.
              </p>
            </motion.div>

            {/* Definitions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-3 rounded-xl">
                  <span className="text-3xl">📖</span>
                </div>
                <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400">Interpretation and Definitions</h2>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-200">Interpretation</h3>
                <p className="mb-4">
                  The words, with the initial letter capitalized, have the meanings
                  defined under the following conditions. These definitions shall
                  apply regardless of whether they appear in the singular or plural.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-200">Definitions</h3>
                <p className="mb-4">For the purposes of this Return and Refund Policy:</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <strong className="text-purple-700 dark:text-purple-300">Company</strong>
                      <p>(referred to as "the Company," "We," "Us," or "Our") refers to SOFT GAME STUDIO.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <strong className="text-purple-700 dark:text-purple-300">Goods</strong>
                      <p>Refer to the items offered for sale on the Service.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <strong className="text-purple-700 dark:text-purple-300">Orders</strong>
                      <p>Mean a request by You to purchase Goods from Us.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <strong className="text-purple-700 dark:text-purple-300">Website</strong>
                      <p>
                        Refers to SOFT GAME STUDIO, accessible from{" "}
                        <a
                          href="https://softgamestudios.web.app"
                          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://softgamestudios.web.app
                        </a>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* No Return Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-xl">
                  <span className="text-3xl">🚫</span>
                </div>
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">No Return and No Refund Policy</h2>
              </div>

              <p className="mb-4">
                Once an order is placed and the product is delivered, the product
                cannot be returned or refunded under any circumstances. Please
                ensure that you carefully review your order before confirming your
                purchase.
              </p>

              <div className="mt-6 p-4 bg-red-50 dark:bg-gray-800 rounded-xl border border-red-100 dark:border-gray-700">
                <h3 className="font-bold mb-3 flex items-center gap-2 text-red-700 dark:text-red-400">
                  <span>⚠️</span> Important Notice
                </h3>
                <p className="mb-3">By purchasing from us, you acknowledge and agree that:</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <span>No refunds will be issued under any conditions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <span>No returns will be accepted after the product has been delivered</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center"
            >
              <div className="flex items-center gap-4 mb-6 justify-center">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-xl">
                  <span className="text-3xl">📬</span>
                </div>
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">Contact Us</h2>
              </div>
              <p className="mb-6 max-w-2xl mx-auto">
                If you have any questions about our Return and Refund Policy, please contact our team:
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="mailto:team.softgamestudio@gmail.com"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Email Our Team
                </a>
                <a
                  href="https://softgamestudios.web.app/ContactUs"
                  className="px-6 py-3 bg-white dark:bg-gray-800 border border-blue-600 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
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

export default ReturnPolicy;