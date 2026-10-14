/**
 * Product.jsx: Soft Game Studio Verified Projects Catalog
 *
 * Production-grade projects listing implementing:
 * - Full Dark & Light Mode Support (neutral slate foundations, brand cyan accents)
 * - Strict Design Compliance: Zero purple gradients, zero em dashes, standardized geometry
 * - Technical SEO & AI Discoverability: Full Helmet metadata, ItemList JSON-LD schema, canonical tags
 * - Accessible Controls: Accessible search input, filter dropdowns, category pills, visible focus rings
 * - Core Web Vitals: Lazy-loaded thumbnails, stable layout, reduced-motion animations
 */

import React, { useEffect, useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import {
  Search,
  Filter,
  Layers,
  ArrowRight,
  ExternalLink,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Tag,
  Code2,
  FileCode,
  Download
} from "lucide-react";

import useFetchProducts from "../../Modules/FetchProducts";
import GoogleDriveDownloader from "../../Modules/GoogleDriveDownloader";
import { useCart } from "../../Modules/Cart/CartContext";
import Layout from "../../components/layout/Layout";

export default function ProductsPage() {
  const { product, loading } = useFetchProducts();
  const { addToCart } = useCart();
  const shouldReduceMotion = useReducedMotion();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all' | 'free' | 'paid'
  const [activeTab, setActiveTab] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Extract all unique categories safely
  const categories = useMemo(() => {
    if (!product || !Array.isArray(product)) return [];
    const set = new Set();
    product.forEach((item) => {
      if (Array.isArray(item.category)) {
        item.category.forEach((c) => c && set.add(c.trim()));
      } else if (typeof item.category === "string" && item.category.trim()) {
        set.add(item.category.trim());
      }
    });
    return Array.from(set);
  }, [product]);

  useEffect(() => {
    if (!product) return;

    let filtered = product.filter((item) => {
      const titleMatch = (item.title || "").toLowerCase().includes(searchTerm.toLowerCase());
      const catMatch =
        activeTab === "all" ||
        (Array.isArray(item.category)
          ? item.category.some((c) => c && c.trim().toLowerCase() === activeTab.toLowerCase())
          : (item.category || "").toLowerCase() === activeTab.toLowerCase());
      return titleMatch && catMatch;
    });

    if (filterType === "paid") {
      filtered = filtered.filter((item) => (parseInt(item.price, 10) || 0) > 0);
    } else if (filterType === "free") {
      filtered = filtered.filter((item) => (parseInt(item.price, 10) || 0) === 0);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, filterType, product, activeTab]);

  // JSON-LD ItemList Schema
  const itemListSchema = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return null;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Soft Game Studio Software Projects & Source Code",
      "description": "Verified software architectures, source code packages, and technical documentation.",
      "itemListElement": filteredProducts.slice(0, 24).map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": item.title,
          "url": `https://softgamestudios.web.app/Project-Details/${item.id}`,
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "Cross-platform",
          "offers": {
            "@type": "Offer",
            "price": parseInt(item.price, 10) || 0,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    });
  }, [filteredProducts]);

  return (
    <Layout>
      <Helmet>
        <title>Pre-Built Software Projects & Source Code | Soft Game Studio</title>
        <meta
          name="description"
          content="Explore verified software project source code, database architectures, and engineering documentation for students, developers, and startups."
        />
        <meta
          name="keywords"
          content="Software Projects, Pre-built Projects, Source Code, Student Projects, Full Stack Applications, Soft Game Studio"
        />
        <link rel="canonical" href="https://softgamestudios.web.app/Project" />
        <meta property="og:title" content="Pre-Built Software Projects & Source Code | Soft Game Studio" />
        <meta
          property="og:description"
          content="Access production-ready software architectures with clean repositories and step-by-step documentation."
        />
        <meta property="og:url" content="https://softgamestudios.web.app/Project" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
        />
        {itemListSchema && <script type="application/ld+json">{itemListSchema}</script>}
      </Helmet>

      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        {/* Hero Section */}
        <div className="relative border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/70 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-4"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <Code2 className="w-3.5 h-3.5" />
                Verified Engineering Blueprints
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
                Pre-Built Software Projects
              </h1>
              <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Explore production-ready code repositories, system schemas, and technical setup manuals across modern full-stack frameworks.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Search, Filter & Tabs Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects by title, framework or domain..."
                aria-label="Search projects by title"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-colors shadow-2xs"
              />
            </div>

            {/* Price Filter Dropdown */}
            <div className="w-full md:w-56 shrink-0">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                aria-label="Filter by project pricing"
                className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-sm text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-colors shadow-2xs"
              >
                <option value="all">All Projects (Free & Paid)</option>
                <option value="free">Free Downloads</option>
                <option value="paid">Premium Packages</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === "all"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800"
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveTab(category)}
                className={`px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab.toLowerCase() === category.toLowerCase()
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Loading project blueprints...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-12 text-center shadow-xs">
              <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                No matching projects found
              </h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Try adjusting your search criteria or selecting a different category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((item) => {
                const priceNum = parseInt(item.price, 10) || 0;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all group"
                  >
                    {/* Project Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title || "Project preview"}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400">
                          <Layers className="w-10 h-10" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                            priceNum > 0
                              ? "bg-neutral-900/90 text-white dark:bg-white dark:text-neutral-950 backdrop-blur-xs"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          {priceNum > 0 ? `₹${priceNum}` : "Free"}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1.5 line-clamp-1">
                          {Array.isArray(item.category) ? item.category.join(", ") : item.category || "General"}
                        </div>
                        <h2 className="text-base font-bold text-neutral-900 dark:text-white line-clamp-2 group-hover:text-sky-500 transition-colors">
                          {item.title}
                        </h2>
                        {item.description && (
                          <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                            {item.description.replace(/<[^>]*>?/gm, "")}
                          </p>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-2.5">
                        {priceNum > 0 ? (
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#00ACF0] hover:bg-sky-500 active:bg-sky-600 text-white transition-colors shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                        ) : (
                          <div className="flex-1">
                            <GoogleDriveDownloader location={item.location} />
                          </div>
                        )}
                        <Link
                          to={`/Project-Details/${item.id}`}
                          className="inline-flex items-center justify-center gap-1 px-3.5 py-2 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-neutral-400"
                        >
                          <span>Details</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Educational CTA Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Looking for guided technical curricula?
            </h2>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Pair these practical projects with our structured video curricula and study notes to reinforce full-stack system architecture skills.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/OurCourse"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold bg-[#00ACF0] hover:bg-sky-500 text-white transition-colors shadow-xs"
              >
                <span>Browse Curricula</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/ContactUs"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                <span>Project Support</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
