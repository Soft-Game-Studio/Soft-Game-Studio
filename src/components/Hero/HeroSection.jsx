import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import Layout from '../layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaGlobe, FaMobileAlt, FaGamepad, FaCloud, FaCheck } from 'react-icons/fa';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { fireDB } from '../../DataBase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';

/* ─── Animated Counter Hook ─────────────────────────────────── */
function useCounter(end, duration = 2000, startOnView = false, ref = null) {
  const [count, setCount] = useState(0);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const shouldStart = startOnView ? inView : true;

  useEffect(() => {
    if (!shouldStart) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, shouldStart]);

  return count;
}

/* ─── Stat counter component ────────────────────────────────── */
function StatCounter({ value, suffix = '+', label }) {
  const ref = useRef(null);
  const count = useCounter(value, 2200, true, ref);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">{label}</div>
    </div>
  );
}

/* ─── Section wrapper ───────────────────────────────────────── */
function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative py-24 lg:py-32 ${className}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        {children}
      </div>
    </section>
  );
}

function SectionHeader({ label, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
    >
      {label && (
        <p className="text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4">
          {label}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-5 leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
/*  HOMEPAGE                                                     */
/* ══════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  /* ── Firebase projects ─────────────────────────────────────── */
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    (async () => {
      const snap = await getDocs(collection(fireDB, 'sgsProjects'));
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    })();
  }, []);

  const handleViewDetails = (id) => navigate(`/SGS-Projects/${id}`);

  /* ── Expertise data ────────────────────────────────────────── */
  const expertise = [
    {
      icon: <FaGlobe className="w-7 h-7" />,
      title: 'Web Development',
      desc: 'Scalable, performant web applications built with modern frameworks and best practices.',
      color: 'from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500',
    },
    {
      icon: <FaMobileAlt className="w-7 h-7" />,
      title: 'Mobile Development',
      desc: 'Cross-platform mobile apps that deliver native experiences on iOS and Android.',
      color: 'from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500',
    },
    {
      icon: <FaGamepad className="w-7 h-7" />,
      title: 'Game Development',
      desc: 'Immersive gaming experiences with stunning visuals and engaging mechanics.',
      color: 'from-pink-600 to-rose-600 dark:from-pink-500 dark:to-rose-500',
    },
    {
      icon: <FaCloud className="w-7 h-7" />,
      title: 'Cloud & Backend',
      desc: 'Robust APIs, microservices, and cloud infrastructure that scales with your business.',
      color: 'from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500',
    },
  ];

  /* ── Pricing data ──────────────────────────────────────────── */
  const pricingTiers = [
    {
      name: 'Starter',
      description: 'Perfect for small projects and MVPs',
      featured: false,
      features: ['Responsive Design', 'Basic SEO Optimization', '3 Page Website', '1 Month Support', 'Basic Contact Form'],
    },
    {
      name: 'Growth',
      description: 'Ideal for growing businesses',
      featured: false,
      features: ['Custom UI/UX Design', 'Advanced SEO', 'Up to 10 Pages', 'CMS Integration', '3 Months Support', 'Basic E-commerce'],
    },
    {
      name: 'Professional',
      description: 'For established businesses',
      featured: true,
      features: ['Premium Design', 'E-commerce Functionality', 'Unlimited Pages', '6 Months Support', 'Mobile App Integration', 'Advanced Analytics'],
    },
    {
      name: 'Enterprise',
      description: 'Tailored solutions at scale',
      featured: false,
      features: ['Custom Web Applications', 'API Integrations', 'Enterprise Security', 'Dedicated Support Team', 'Scalable Infrastructure', '24/7 Monitoring'],
    },
  ];

  /* ── Events data ───────────────────────────────────────────── */
  const events = [
    {
      id: 1,
      img: 'https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Our%20Social%20Work%2FIMG-20250319-WA0005.jpg?alt=media&token=1be384ea-b1c2-4728-a2cd-e26752f0c14e',
      title: 'Code Vortex',
      tag: 'Competition',
      description: 'Full participation, live challenges, and immense enthusiasm — a celebration of real-time problem solving and developer spirit.',
    },
    {
      id: 2,
      img: 'https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Our%20Social%20Work%2FWhatsApp%20Image%202025-10-29%20at%202.41.56%20PM%20(2).jpeg?alt=media&token=f748965f-07dc-4881-9946-6f0c32e18a2c',
      title: 'Code Clash',
      tag: 'Competition',
      description: 'Energetic participation, real-time challenges, and incredible enthusiasm — a true celebration of technology, skills, and creativity.',
    },
  ];

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <Layout>
      <Helmet>
        <title>Soft Game Studio — Scalable Digital Products & Immersive Experiences</title>
        <meta name="description" content="Soft Game Studio provides full-stack web and mobile development, game design, and scalable cloud solutions for modern businesses." />
      </Helmet>
      <div ref={containerRef} className="min-h-screen bg-purple-50 dark:bg-neutral-950 text-gray-900 dark:text-white font-sans overflow-hidden">

        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 bg-purple-50 dark:bg-neutral-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100/50 dark:from-purple-900/20 via-transparent to-transparent" />
          
          {/* Animated orbs */}
          <div className="absolute w-[500px] h-[500px] top-[-10%] left-[-10%] rounded-full bg-purple-400/20 dark:bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute w-[400px] h-[400px] bottom-[5%] right-[-8%] rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-3xl animate-pulse" style={{ animationDuration: '15s' }} />
          <div className="absolute w-[300px] h-[300px] top-[40%] left-[50%] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />

          {/* Content */}
          <motion.div
            className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center"
            style={{ y: yBg }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm text-sm text-gray-700 dark:text-gray-300 mb-8"
            >
              <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" />
              Now Accepting New Projects
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-7"
            >
              Building Scalable{' '}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Digital Products
              </span>
              <br className="hidden sm:block" />
              <span className="text-gray-900 dark:text-white/90"> & </span>
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                Immersive Experiences
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              We design, develop, and deliver high-performance web applications,
              mobile apps, and interactive systems for modern businesses.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-14"
            >
              <Link
                to="/ContactUs"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 dark:shadow-purple-900/30 transition-all duration-300"
              >
                Get Started
                <FaArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/SGS-Projects"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base border border-purple-200 dark:border-white/10 text-gray-700 dark:text-white hover:bg-purple-50 dark:hover:bg-white/5 transition-all duration-300"
              >
                View Our Work
                <HiOutlineArrowNarrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-500"
            >
              {['Trusted by developers', 'Startups', 'Institutions'].map((t, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <a
            href="#stats"
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-5 h-8 border-2 border-current rounded-full flex items-start justify-center pt-1.5"
            >
              <div className="w-1 h-1.5 bg-current rounded-full" />
            </motion.div>
          </a>
        </section>

        {/* ═══════════════ STATS BAR ═══════════════ */}
        <section id="stats" className="relative py-16 lg:py-20 border-y border-purple-200 dark:border-white/5 bg-white/50 dark:bg-neutral-950/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              <StatCounter value={50} suffix="+" label="Projects Delivered" />
              <StatCounter value={10} suffix="+" label="Technologies" />
              <StatCounter value={1000} suffix="+" label="Users Reached" />
              <StatCounter value={500} suffix="+" label="Students" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </section>

        {/* ═══════════════ OUR EXPERTISE ═══════════════ */}
        <Section id="expertise">
          <SectionHeader
            label="What We Do"
            title="Our Expertise"
            description="Full-stack capabilities across multiple technology domains — everything you need to bring your vision to life."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white/80 dark:bg-neutral-900/50 backdrop-blur-sm border border-purple-100 dark:border-neutral-800 rounded-2xl p-8 hover:shadow-xl hover:shadow-purple-500/5 dark:hover:shadow-neutral-800/30 hover:-translate-y-2 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* ═══════════════ OUR WORK ═══════════════ */}
        <Section id="work">
          <SectionHeader
            label="Portfolio"
            title="Our Work"
            description="A curated selection of projects — from scalable web platforms to immersive digital experiences."
          />

          {/* Marquee scroller */}
          {projects.length > 0 && (
            <div className="overflow-hidden w-full -mx-5 px-5">
              <motion.div
                className="flex gap-7"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ repeat: Infinity, duration: 40, ease: 'linear' }}
              >
                {[...projects, ...projects].map((project, idx) => (
                  <div
                    key={`${project.id}-${idx}`}
                    className="group relative min-w-[380px] max-w-[380px] flex-shrink-0 bg-white/80 dark:bg-neutral-900/50 backdrop-blur-sm border border-purple-100 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-purple-500/5 dark:hover:shadow-neutral-800/30 hover:-translate-y-2 transition-all duration-500"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={project.photoUrl}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '';
                          e.target.parentElement.innerHTML =
                            '<div class="w-full h-full bg-gradient-to-br from-purple-900/20 to-purple-100 dark:from-purple-900/40 dark:to-neutral-900 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">Preview unavailable</div>';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-neutral-900/80 via-transparent to-transparent" />

                      {/* Status badge */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm px-3 py-1 rounded-full border border-purple-200 dark:border-white/10">
                        <span className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {project.status || 'Active'}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                        {project.name}
                      </h3>

                      {/* Tags */}
                      {project.technologies && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.slice(0, 3).map((tech, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 text-[11px] font-medium bg-purple-100 dark:bg-white/5 border border-purple-200 dark:border-white/10 rounded-full text-purple-800 dark:text-gray-400"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2.5 py-0.5 text-[11px] text-gray-500 dark:text-gray-500">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-5 leading-relaxed">
                        {project.description}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(project.id);
                        }}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors group/btn"
                      >
                        View Case Study
                        <HiOutlineArrowNarrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          )}

          <div className="flex justify-center mt-12">
            <Link
              to="/SGS-Projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 dark:shadow-purple-900/30 transition-all duration-300"
            >
              Explore All Projects
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Section>

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* ═══════════════ ENGAGEMENT MODELS (PRICING) ═══════════════ */}
        <Section id="pricing">
          <SectionHeader
            label="Pricing"
            title="Engagement Models"
            description="Flexible engagement models tailored for startups to enterprises — pick the plan that fits your scale."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`relative bg-white/80 dark:bg-neutral-900/50 backdrop-blur-sm border rounded-2xl p-7 flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                  tier.featured
                    ? 'border-purple-500/50 dark:border-purple-500/50 shadow-xl shadow-purple-500/10 dark:shadow-purple-900/20 ring-1 ring-purple-500/30'
                    : 'border-purple-100 dark:border-neutral-800 hover:bg-purple-50/50 dark:hover:bg-white/5'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="mb-6 mt-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                      <FaCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/ContactUs"
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    tier.featured
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 dark:shadow-purple-900/30'
                      : 'border border-purple-200 dark:border-white/15 text-gray-700 dark:text-gray-300 hover:border-purple-500 dark:hover:border-purple-400/50 hover:text-purple-700 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-500/10'
                  }`}
                >
                  Get Started
                  <FaArrowRight className="w-3 h-3" />
                </Link>
              </motion.div>
            ))}
          </div>
        </Section>

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* ═══════════════ EVENTS & COMMUNITY ═══════════════ */}
        <Section id="events">
          <SectionHeader
            label="Community"
            title="Events & Community"
            description="We believe in giving back — hosting hackathons, coding competitions, and community-driven tech events."
          />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
  {events.map((item, idx) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: idx * 0.1 }}
      viewport={{ once: true }}
      className="group relative h-72 rounded-2xl overflow-hidden 
      border border-purple-100 dark:border-neutral-800 
      hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-black/40 
      transition-all duration-500"
    >
      
      {/* Background Image */}
      <img
        loading="lazy"
        decoding="async"
        src={item.img}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover 
        group-hover:scale-110 transition-transform duration-700"
      />

      {/* THEME-AWARE OVERLAY */}
      <div className="absolute inset-0 
        bg-purple-500/10 dark:bg-black/50 
        group-hover:bg-white/50 dark:group-hover:bg-black/60 
        transition duration-500"
      />

      {/* GRADIENT OVERLAY */}
      <div className="absolute inset-0 
        bg-gradient-to-t 
        from-white/50 via-white/40 to-transparent 
        dark:from-black/80 dark:via-black/40 dark:to-transparent"
      />

      {/* Tag */}
      <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold 
      bg-purple-600/90 text-white rounded-full z-10">
        {item.tag}
      </span>

      {/* Content */}
      <div className="absolute bottom-0 p-6 z-10 text-left">
        
        <h3 className="text-xl font-bold 
        text-gray-950 dark:text-white 
        mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition">
          {item.title}
        </h3>

        <p className="text-sm 
        text-gray-950 dark:text-gray-300 
        leading-relaxed line-clamp-2">
          {item.description}
        </p>

      </div>

    </motion.div>
  ))}
</div>
        </Section>

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* ═══════════════ ABOUT / TRUST SECTION ═══════════════ */}
        <Section id="about">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4">
                About Us
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                We build products that{' '}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  make an impact
                </span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                Soft Game Studio is a technology company focused on building
                scalable digital solutions. From enterprise web platforms to
                immersive mobile experiences, we combine design excellence with
                engineering precision to deliver products that perform.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                Our team of designers, developers, and strategists work together
                to transform ideas into impactful digital products used by
                thousands of users across the globe.
              </p>
              <Link
                to="/About-SGS"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 dark:shadow-purple-900/30 transition-all duration-300"
              >
                Learn More About Us
                <FaArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Right — Stats */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { value: 50, suffix: '+', label: 'Projects Completed', icon: '🚀' },
                { value: 10, suffix: '+', label: 'Technologies Used', icon: '⚡' },
                { value: 1000, suffix: '+', label: 'Users Worldwide', icon: '🌍' },
                { value: 5, suffix: '+', label: 'Years of Excellence', icon: '🏆' },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 dark:bg-neutral-900/50 backdrop-blur-sm border border-purple-100 dark:border-neutral-800 rounded-2xl p-6 text-center hover:bg-purple-50/50 dark:hover:bg-white/5 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-3xl mb-3">{s.icon}</div>
                  <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-1">
                    {s.value}{s.suffix}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </Section>

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        {/* ═══════════════ CONTACT CTA ═══════════════ */}
        <section className="relative py-24 lg:py-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-purple-50 to-white dark:from-purple-900/20 dark:via-neutral-950 dark:to-neutral-950" />
          <div className="absolute w-[600px] h-[600px] top-[-20%] right-[-15%] rounded-full bg-purple-400/20 dark:bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '14s' }} />
          <div className="absolute w-[400px] h-[400px] bottom-[-10%] left-[-10%] rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-3xl animate-pulse" style={{ animationDuration: '11s' }} />

          <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-4">
                Get in Touch
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-5 leading-tight">
                Let's Build Something{' '}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Great Together
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Tell us about your idea — we'll help you bring it to life.
                From concept to launch, we're with you every step of the way.
              </p>
            </motion.div>

            {/* Contact tiles */}
           <div className="max-w-5xl mx-auto px-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    {/* EMAIL CARD */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative bg-gradient-to-br from-white/80 to-purple-50/40 dark:from-neutral-900/60 dark:to-neutral-900/30 backdrop-blur-xl border border-purple-100 dark:border-neutral-800 rounded-2xl p-8 text-center hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
    >
      <div className="text-4xl mb-4">✉️</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Email Us
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
        For project inquiries & collaboration
      </p>
      <a
        href="mailto:sgs.web.app@gmail.com"
        className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
      >
        sgs.web.app@gmail.com
      </a>
    </motion.div>

    {/* PHONE CARD */}
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      className="group relative bg-gradient-to-br from-white/80 to-purple-50/40 dark:from-neutral-900/60 dark:to-neutral-900/30 backdrop-blur-xl border border-purple-100 dark:border-neutral-800 rounded-2xl p-8 text-center hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
    >
      <div className="text-4xl mb-4">📱</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Call Us
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Available in Hindi & English
      </p>

      <div className="space-y-2 text-sm">
        <p className="text-gray-700 dark:text-gray-300">
          Hindi:{" "}
          <a href="tel:+919914267704" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
            +91 9914267704
          </a>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          English:{" "}
          <a href="tel:+916283400770" className="text-purple-600 dark:text-purple-400 font-medium hover:underline">
            +91 6283400770
          </a>
        </p>
      </div>
    </motion.div>

  </div>
  
</div>
   <div className="mt-12 flex flex-col items-center gap-4">
  
  <Link
    to="/ContactUs"
    className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-semibold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/25 dark:shadow-purple-900/30 transition-all duration-300 hover:scale-105"
  >
    Start a Conversation
    <FaArrowRight className="w-4 h-4" />
  </Link>

  {/* Optional trust line */}
  <p className="text-sm text-gray-500 dark:text-gray-400">
    Usually responds within 48 hours
  </p>

</div>
        
          </div>
          
        </section>

      </div>
    </Layout>
  );
};

export default HomePage;