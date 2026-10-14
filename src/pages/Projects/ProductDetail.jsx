/**
 * ProductDetail.jsx: Soft Game Studio Verified Project Details
 *
 * Production-grade implementation conforming to strict standards:
 * - Elimination of all purple design tokens: Built on high-contrast neutral foundations with brand cyan accents
 * - Removal of full-viewport parallax: Clean, responsive hero composition optimized for LCP and accessibility
 * - Technical SEO & AI Discoverability: Full Helmet metadata and Schema.org SoftwareApplication / Product JSON-LD
 * - Standardized Geometry: Replaced oversized rounded-full buttons with structured, modern rounded-lg controls
 * - Authentic Copywriting: Pure factual technical copy, zero fake metrics or simulated customer counters
 */

import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";
import {
  Layers,
  ShoppingCart,
  Download,
  Play,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  FileCode,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Info,
  PackageCheck
} from "lucide-react";

import useFetchProducts from "../../Modules/FetchProducts";
import { useCart } from "../../Modules/Cart/CartContext";
import Layout from "../../components/layout/Layout";
import GoogleDriveDownloader from "../../Modules/GoogleDriveDownloader";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { product: products, loading } = useFetchProducts();
  const { addToCart } = useCart();
  const shouldReduceMotion = useReducedMotion();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (products && id) {
      const foundProduct = products.find((p) => String(p.id) === String(id));
      setProduct(foundProduct || null);
    }
  }, [products, id]);

  // Schema.org Product / SoftwareApplication JSON-LD Structured Data
  const productSchema = useMemo(() => {
    if (!product) return null;
    const cleanDesc = product.description ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 300) : "Verified software project source code and architecture files.";
    const priceNum = parseInt(product.price, 10) || 0;

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": product.title,
      "description": cleanDesc,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Cross-platform",
      "image": product.imageUrl || "https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media",
      "offers": {
        "@type": "Offer",
        "price": priceNum,
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `https://softgamestudios.web.app/Project-Details/${id}`
      },
      "brand": {
        "@type": "Brand",
        "name": "Soft Game Studio"
      }
    });
  }, [product, id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center py-24">
          <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Loading project specifications...
          </p>
        </div>
      </Layout>
    );
  }

  if (!product && !loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col items-center justify-center px-4 py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Project Blueprint Not Found
          </h1>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
            The project you requested does not exist or has been relocated to another catalogue index.
          </p>
          <Link
            to="/Project"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-[#00ACF0] hover:bg-sky-500 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Projects Catalog
          </Link>
        </div>
      </Layout>
    );
  }

  const priceNum = parseInt(product.price, 10) || 0;
  const categoriesList = Array.isArray(product.category)
    ? product.category.join(", ")
    : product.category || "Full Stack Application";
  const cleanDescriptionText = product.description ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 160) : "Download verified project code.";

  return (
    <Layout>
      <Helmet>
        <title>{`${product.title} | Software Project | Soft Game Studio`}</title>
        <meta name="description" content={cleanDescriptionText} />
        <meta
          name="keywords"
          content={`Software Project, ${product.title}, Source Code, Soft Game Studio, Pre-built projects`}
        />
        <link rel="canonical" href={`https://softgamestudios.web.app/Project-Details/${id}`} />
        <meta property="og:title" content={`${product.title} | Soft Game Studio`} />
        <meta property="og:description" content={cleanDescriptionText} />
        <meta property="og:url" content={`https://softgamestudios.web.app/Project-Details/${id}`} />
        <meta property="og:type" content="article" />
        {product.imageUrl && <meta property="og:image" content={product.imageUrl} />}
        {productSchema && <script type="application/ld+json">{productSchema}</script>}
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        {/* Navigation Breadcrumb Bar */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
            <Link
              to="/Project"
              className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </Link>
            <span className="text-neutral-400 dark:text-neutral-500 font-mono">
              ID: {id}
            </span>
          </div>
        </div>

        {/* Project Header Overview Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Visual Thumbnail */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-6"
            >
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-auto aspect-video sm:aspect-4/3 object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                    <Layers className="w-16 h-16" />
                  </div>
                )}
              </div>

              {/* Verified Architecture Metadata */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Domain Category</span>
                  <span className="font-semibold text-neutral-900 dark:text-white truncate block mt-0.5">
                    {categoriesList}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                  <span className="text-neutral-500 dark:text-neutral-400 block text-[11px]">Source Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified & Tested
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Project Details & Order Action */}
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              className="lg:col-span-6 space-y-6"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-3">
                  <Cpu className="w-3.5 h-3.5" />
                  Complete Project Package
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight">
                  {product.title}
                </h1>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {categoriesList}
                </p>
              </div>

              {/* Price Banner */}
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-baseline justify-between shadow-2xs">
                <div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block">Package Price</span>
                  <span className="text-3xl font-extrabold text-neutral-900 dark:text-white mt-1 block">
                    {priceNum > 0 ? `₹${priceNum}` : "Free Download"}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Instant File Delivery
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {priceNum > 0 ? (
                  <button
                    type="button"
                    onClick={() => addToCart({ ...product, quantity })}
                    className="w-full py-3.5 px-6 rounded-lg text-sm font-bold text-white bg-[#00ACF0] hover:bg-sky-500 active:bg-sky-600 transition-colors shadow-xs flex items-center justify-center gap-2 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart (₹{priceNum * quantity})</span>
                  </button>
                ) : (
                  <div className="w-full">
                    <GoogleDriveDownloader location={product.location} />
                  </div>
                )}

                {product.videoUrl && (
                  <a
                    href={product.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 rounded-lg text-sm font-semibold border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 text-sky-500 fill-current" />
                    <span>Watch System Architecture Video</span>
                  </a>
                )}
              </div>

              {/* Guarantees */}
              <div className="space-y-2.5 pt-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2">
                  <PackageCheck className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Includes frontend, backend endpoints, and database initialization scripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Clean codebase organized with standard development conventions</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Permanent access stored in your user profile after acquisition</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Detailed Technical Description Section */}
        {product.description && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                Project Architecture & Overview
              </h2>
              <div className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4">
                {parse(product.description)}
              </div>
            </div>
          </div>
        )}

        {/* Features Checklist Section */}
        {product.features && product.features.length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white text-center mb-8">
                Key Modules & Engineering Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {product.features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-xs mb-3">
                      {index + 1}
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                      Module {index + 1}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Technical Specifications Table */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
                Technical Specifications
              </h2>
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800 text-left text-xs">
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors">
                        <td className="px-6 py-3.5 font-semibold text-neutral-900 dark:text-neutral-200 bg-neutral-50/50 dark:bg-neutral-800/30 w-1/3">
                          {key}
                        </td>
                        <td className="px-6 py-3.5 text-neutral-700 dark:text-neutral-300">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Developer Support Action Banner */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-14">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Have questions about deploying this project?
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Our engineering team is available to assist with environmental configurations, database migrations, and integration setup questions.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/ContactUs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#00ACF0] hover:bg-sky-500 text-white transition-colors shadow-xs"
              >
                <span>Contact Engineering Support</span>
              </Link>
              <Link
                to="/Project"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <span>Browse Other Blueprints</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}