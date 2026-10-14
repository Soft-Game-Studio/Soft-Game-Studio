/**
 * Cart.jsx: Soft Game Studio Production Shopping Cart & Checkout
 *
 * Production-grade implementation conforming to strict standards:
 * - Fixed React Hook Rule Violation: useAuth() hoisted to top-level component scope
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, unified brand cyan & neutral palette
 * - SEO Optimization: Helmet meta configuration with noindex directive for checkout privacy
 * - Core Web Vitals & Accessibility: Reduced-motion variants, responsive card/table layout, focus rings
 * - Resilient Transactions: Direct Firebase order creation for zero-priced items and Razorpay gateway for paid projects
 */

import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { addDoc, collection, updateDoc, serverTimestamp } from "firebase/firestore";
import { motion, useReducedMotion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Lock,
  Zap,
  PackageOpen,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Layers
} from "lucide-react";

import { fireDB } from "../../DataBase/firebaseConfig";
import { useCart } from "../../Modules/Cart/CartContext";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../AuthProvide";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const { user } = useAuth(); // Hook correctly hoisted to top level
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [subAmount, setSubAmount] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Synchronize cart subtotal and tax computations
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setSubAmount(0);
      setTaxAmount(0);
      setTotalAmount(0);
      return;
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + (parseInt(item.price, 10) || 0) * (item.quantity || 1),
      0
    );
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    setSubAmount(subtotal);
    setTaxAmount(tax);
    setTotalAmount(total);
  }, [cartItems]);

  const handleDelete = (id) => {
    removeFromCart(id);
    toast.info("Item removed from your cart.");
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please log in to proceed with checkout.");
      navigate("/login");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.warn("Your cart is empty.");
      return;
    }

    setIsProcessing(true);

    const zeroPriced = cartItems.filter((item) => (parseInt(item.price, 10) || 0) === 0);
    const pricedItems = cartItems.filter((item) => (parseInt(item.price, 10) || 0) > 0);

    // 1. Process free items directly via Firestore
    if (zeroPriced.length > 0) {
      try {
        for (const item of zeroPriced) {
          const docRef = await addDoc(collection(fireDB, "orders"), {
            ...item,
            quantity: item.quantity || 1,
            date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
            email: user.email,
            userId: user.uid,
            paymentId: "FREE_DOWNLOAD",
            status: "Completed",
            createdAt: serverTimestamp()
          });
          await updateDoc(docRef, { orderId: docRef.id });
        }
        toast.success("Free download resources unlocked successfully.");
        if (pricedItems.length === 0) {
          clearCart();
          setIsProcessing(false);
          navigate("/Profile");
          return;
        }
      } catch (err) {
        console.error("Free order allocation failure:", err);
        toast.error("Unable to allocate free resources. Please check your network connection.");
        setIsProcessing(false);
        return;
      }
    }

    // 2. Process paid projects through Razorpay secure gateway
    if (pricedItems.length > 0) {
      const razorpayKey = import.meta.env.VITE__RAZORPAY_KEY_SGS;
      if (!razorpayKey) {
        toast.error("Payment configuration is missing. Contact support.");
        setIsProcessing(false);
        return;
      }

      const totalPaise = pricedItems.reduce(
        (sum, item) => sum + (parseInt(item.price, 10) || 0) * (item.quantity || 1),
        0
      ) * 100;

      const options = {
        key: razorpayKey,
        amount: totalPaise,
        currency: "INR",
        name: "Soft Game Studio",
        description: "Verified Software Architecture & Source Files",
        image: "https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media",
        handler: async (response) => {
          const paymentId = response.razorpay_payment_id;
          try {
            for (const item of pricedItems) {
              const docRef = await addDoc(collection(fireDB, "orders"), {
                ...item,
                quantity: item.quantity || 1,
                paymentId,
                date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
                email: user.email,
                userId: user.uid,
                status: "Paid",
                createdAt: serverTimestamp()
              });
              await updateDoc(docRef, { orderId: docRef.id });
            }
            toast.success("Payment confirmed. Your project access is active.");
            clearCart();
            setIsProcessing(false);
            navigate("/Profile");
          } catch (err) {
            console.error("Payment order logging failure:", err);
            toast.error("Payment was captured but order logging encountered a delay. Please contact support.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || ""
        },
        theme: {
          color: "#00ACF0" // Brand Cyan (Neutral/Compliant, zero purple)
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          console.error("Razorpay payment failed:", response.error);
          toast.error(response.error.description || "Payment failed. Please try again.");
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        toast.error("Payment gateway is initializing. Please refresh the page.");
        setIsProcessing(false);
      }
    }
  };

  const hasItems = cartItems && cartItems.length > 0;

  return (
    <Layout>
      <Helmet>
        <title>Shopping Cart | Soft Game Studio</title>
        <meta
          name="description"
          content="Review items in your Soft Game Studio shopping cart and proceed to secure checkout for verified software projects."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://softgamestudios.web.app/Cart" />
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-3">
                <ShoppingCart className="w-7 h-7 text-sky-500" />
                Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                Review your selected pre-built project packages and proceed to instant delivery.
              </p>
            </div>
            {hasItems && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 self-start sm:self-auto">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"} Selected
              </span>
            )}
          </motion.div>

          {!hasItems ? (
            /* Empty Cart State */
            <motion.div
              initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 p-12 text-center shadow-xs"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-5">
                <PackageOpen className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                Your cart is currently empty
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-8 leading-relaxed">
                You have not added any software packages or source code bundles yet. Explore our verified project catalogue to get started.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/Project"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-[#00ACF0] hover:bg-sky-500 text-white transition-colors shadow-xs"
                >
                  <Layers className="w-4 h-4" />
                  Explore Projects
                </Link>
                <Link
                  to="/OurCourse"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  Browse Courses
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Active Cart Items & Checkout Breakdown */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Items List */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="lg:col-span-8 space-y-4"
              >
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
                  <div className="hidden sm:grid sm:grid-cols-12 px-6 py-3.5 bg-neutral-100/70 dark:bg-neutral-800/60 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                    <span className="col-span-7">Project Package</span>
                    <span className="col-span-3 text-right">Price</span>
                    <span className="col-span-2 text-right">Action</span>
                  </div>

                  <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {cartItems.map((item, index) => {
                      const priceNum = parseInt(item.price, 10) || 0;
                      return (
                        <li
                          key={item.id || index}
                          className="p-5 sm:p-6 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30"
                        >
                          <div className="flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-4">
                            {/* Project Information */}
                            <div className="sm:col-span-7 flex items-center gap-4">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                {item.imageUrl ? (
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title || "Project package"}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <Layers className="w-6 h-6 text-neutral-400" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h2 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-white truncate">
                                  {item.title}
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                                  {Array.isArray(item.category) ? item.category.join(", ") : item.category || "Full Project Bundle"}
                                </p>
                                <span className="inline-block mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                  Instant Digital Source Code Delivery
                                </span>
                              </div>
                            </div>

                            {/* Price */}
                            <div className="sm:col-span-3 sm:text-right flex items-center justify-between sm:justify-end">
                              <span className="sm:hidden text-xs text-neutral-500">Price:</span>
                              <span className="text-base font-bold text-neutral-900 dark:text-white">
                                {priceNum > 0 ? `₹${priceNum}` : "Free"}
                              </span>
                            </div>

                            {/* Remove Action */}
                            <div className="sm:col-span-2 sm:text-right flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500"
                                aria-label={`Remove ${item.title} from cart`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Return to Projects Link */}
                <div className="pt-2">
                  <Link
                    to="/Project"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 transition-colors"
                  >
                    <span>← Continue browsing more projects</span>
                  </Link>
                </div>
              </motion.div>

              {/* Order Summary Checkout Panel */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.45 }}
                className="lg:col-span-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-xs space-y-6"
              >
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Subtotal</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">₹{subAmount}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>GST (18% Digital Service)</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">₹{taxAmount}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                    <span>Delivery</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">Free (Instant Download)</span>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3.5 flex justify-between items-baseline">
                    <span className="text-base font-bold text-neutral-900 dark:text-white">Grand Total</span>
                    <span className="text-xl font-extrabold text-[#00ACF0]">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 rounded-lg text-sm font-bold text-white bg-[#00ACF0] hover:bg-sky-500 active:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-xs flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Proceed to Checkout</span>
                    </>
                  )}
                </button>

                {/* Trust and Security Assurance */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>256-bit TLS encrypted transaction</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Instant access to code repositories & schema files</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                    <CreditCard className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Supports UPI, Cards, Net Banking & Wallets</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
