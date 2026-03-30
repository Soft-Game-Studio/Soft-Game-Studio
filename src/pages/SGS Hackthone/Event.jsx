import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Layout from "../../components/layout/Layout";
import Particles from "react-tsparticles";          
import { Rocket, Lightbulb, TrendingUp, MonitorPlay, Users, CalendarDays, Award, ChevronDown, CheckCircle2 } from "lucide-react";
import RegistrationForm from "./RegistrationForm";

// ---------- Static Data ----------
const challengeData = {
  hero: {
    title: "The Ultimate Innovation Challenge",
    subtitle: "Code the Future. Build the Impossible.",
    description: "Bring your boldest ideas to life. Whether it's an app, website, or software solution, pitch it to industry experts, secure funding, and win massive prizes.",
    buttonText: "Register Now",
  },
  problemAreas: [
    { icon: <BookOpen className="w-8 h-8"/>, title: "EdTech Revolution", description: "Build tools to improve learning systems, democratize education, and make learning highly engaging.", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800" },
    { icon: <TrendingUp className="w-8 h-8"/>, title: "Retail & Local Commerce", description: "Empower local shop owners with digital storefronts, inventory tracking, or supply chain optimization.", image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800" },
    { icon: <MonitorPlay className="w-8 h-8"/>, title: "Smart Everyday Utilities", description: "Solve day-to-day hassles with smart, intuitive applications that enhance general productivity.", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800" },
  ],
  timeline: [
    { title: "Registration Opens", date: "10 July 2026", desc: "Build your team and snag your spot before capacity is reached." },
    { title: "Idea Submission Phase", date: "20 July 2026", desc: "Submit your comprehensive pitch deck and prototype wireframes." },
    { title: "Live Presentation Round", date: "30 July 2026", desc: "Pitch live in front of our distinguished panel of judges." },
    { title: "Grand Finale & Awards", date: "1 Aug 2026", desc: "Winners announced, prizes distributed, and networking events begin." },
  ],
  judging: [
    { title: "Innovation & Creativity", desc: "Is the idea novel? Does it cleverly solve a complex issue?" },
    { title: "Problem Solving Impact", desc: "How tangibly does this affect the target demographic?" },
    { title: "Technical Feasibility", desc: "Is the underlying technology sound, scalable, and robust?" },
    { title: "Presentation Quality", desc: "How well can the team communicate their vision and product?" },
  ],
  prizes: [
    { place: "Grand Champion", reward: "₹5000 + Welcome Gift  + Digital Certificate", icon: "🏆", color: "from-yellow-400 to-amber-600" },
    { place: "First Runner-Up", reward: "₹3000  + Welcome Gift + Digital Certificate", icon: "🥈", color: "from-slate-300 to-slate-500" },
    { place: "Second Runner-Up", reward: "₹2000 + Welcome Gift + Digital Certificate", icon: "🥉", color: "from-orange-400 to-amber-800" },
    { place: "Community Favorite", reward: "Welcome Gift + Digital Participation Certificate", icon: "🔥", color: "from-rose-400 to-red-600" },
    { place: "Selected Offline Participants", reward: "Welcome Gift + Digital Participation Certificate", icon: "🏅", color: "from-green-400 to-lime-600" },
{ place: "Participants", reward: "Digital Participation Certificate", icon: "👥", color: "from-purple-400 to-violet-600" },
  ],
  faq: [
    { q: "Who can participate?", a: "This hackathon is open to all students globally. Both technical and non-technical founders are welcome to pitch." },
    { q: "What is the team size limit?", a: "Teams can range from solo founders (1 member) up to a maximum of 2 members." },
    { q: "What deliverables are required?", a: "A detailed presentation (PPT) explaining your solution, the market impact, and a working prototype/MVP if applicable." },
    { q: "Is there a registration fee?", a: "No! Registration and participation are completely free." },
  ],
};

import { BookOpen } from "lucide-react"; // Import missing icons

export default function InnovationChallenge() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth parallax values
  const yHero = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Scroll to register
  const scrollToRegister = () => {
    document.getElementById('register-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout>
      <div ref={containerRef} className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#07070F] text-slate-900 dark:text-white selection:bg-purple-500/30 overflow-hidden">
        
        {/* Animated Particles Background */}
        <Particles
          options={{
            background: { color: "transparent" },
            particles: {
              number: { value: 60, density: { enable: true, value_area: 800 } },
              color: { value: "#8b5cf6" },
              shape: { type: "circle" },
              opacity: { value: 0.3, random: true },
              size: { value: 3, random: true },
              move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out", bounce: false },
              links: { enable: true, distance: 150, color: "#8b5cf6", opacity: 0.1, width: 1 }
            },
            interactivity: {
              events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" }, resize: true },
              modes: { grab: { distance: 200, line_linked: { opacity: 0.3 } } }
            },
            retina_detect: true
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Dynamic Glow Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none translate-x-[-50%]" />

        {/* ---------- HERO SECTION ---------- */}
        <motion.section 
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-purple-500/30 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
          >
            <span className="flex w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase text-purple-700 dark:text-purple-300">Registrations Now Open</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tight max-w-5xl leading-[1.1]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-purple-800 to-indigo-900 dark:from-white dark:via-purple-200 dark:to-indigo-400">
              {challengeData.hero.title}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12 font-medium"
          >
            {challengeData.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <button 
              onClick={scrollToRegister}
              className="group relative px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 overflow-hidden rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-transform hover:scale-105"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
                {challengeData.hero.buttonText} <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </span>
            </button>
          </motion.div>

          {/* Mouse Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-10 opacity-50 flex flex-col items-center text-sm font-semibold tracking-widest uppercase"
          >
            Scroll Down
            <ChevronDown className="mt-2 w-5 h-5" />
          </motion.div>
        </motion.section>

        {/* ---------- PROBLEM AREAS (3D Alternating Layout) ---------- */}
        <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black inline-block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-500 mb-4">
              Problem Categories
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Choose your battlefield. Construct the future.</p>
          </div>

          <div className="space-y-32">
            {challengeData.problemAreas.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: isEven ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                  className={`flex flex-col gap-12 items-center ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Image Side (3D Card) */}
                  <div className="w-full lg:w-1/2 perspective-[1000px]">
                    <motion.div 
                      whileHover={{ rotateY: isEven ? 10 : -10, rotateX: 5, z: 50 }}
                      transition={{ duration: 0.4 }}
                      className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/5 bg-white/10 dark:bg-black/20 backdrop-blur-sm aspect-video transform-style-3d group"
                    >
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                          {item.icon}
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Text Side */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <div className="flex items-center gap-4 text-purple-600 dark:text-purple-400 font-bold tracking-wider">
                      <span className="text-sm bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                        Track 0{i + 1}
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                      {item.title}
                    </h3>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ---------- TIMELINE & JUDGING (Bento Grid Style) ---------- */}
        <section className="relative z-10 py-32 bg-gray-50/50 dark:bg-[#0A0A12]/80 border-y border-gray-200 dark:border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              
              {/* Timeline */}
              <div>
                <h2 className="text-4xl font-bold mb-10 flex items-center gap-3">
                  <CalendarDays className="text-purple-500 w-8 h-8" /> Event Timeline
                </h2>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-indigo-500 before:opacity-30">
                  {challengeData.timeline.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#0A0A12] bg-purple-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg group-hover:-translate-y-1 transition-transform">
                        <div className="text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">{item.date}</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Judging & Details */}
              <div className="space-y-8">
                <h2 className="text-4xl font-bold mb-10 flex items-center gap-3">
                  <Lightbulb className="text-amber-500 w-8 h-8" /> Judging Criteria
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {challengeData.judging.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-purple-500/50 transition-all cursor-crosshair"
                    >
                      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500 mb-3">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>

                {/* FAQ Snippets inside Bento */}
                <div className="mt-8 p-8 rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-900 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-32 h-32" /></div>
                  <h3 className="text-2xl font-bold mb-6 relative z-10 w-full">Quick FAQ Facts</h3>
                  <div className="space-y-4 relative z-10">
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> Global Student Access</p>
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> Teams of 1 to 2 Members</p>
                    <p className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0"/> 100% Free Registration</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ---------- PRIZES (Hover 3D Showcase) ---------- */}
        <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-black flex justify-center items-center text-center  bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600 mb-4">
                Glory & Rewards
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">Massive prize pools and invaluable networking opportunities.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {challengeData.prizes.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative p-[1px] rounded-3xl bg-gradient-to-b ${p.color} shadow-xl`}
              >
                <div className="h-full bg-white dark:bg-[#0A0A12] rounded-[23px] p-8 text-center flex flex-col items-center justify-center relative overflow-hidden group">
                  <div className={`absolute inset-0 bg-gradient-to-b ${p.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="text-6xl mb-6 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500">{p.icon}</div>
                  <h3 className="text-2xl font-bold mb-3 dark:text-white text-gray-900">{p.place}</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">{p.reward}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------- REGISTRATION FORM SECTION ---------- */}
        <section id="register-section" className="relative z-20 py-32 bg-gray-900 dark:bg-black text-white border-t border-white/10">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                The Clock is Ticking.
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                Assemble your greatest team, prepare your best ideas, and register immediately. The world needs your solution.
              </p>
            </motion.div>

            {/* Render Modern Form Inline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <RegistrationForm eventId="Hackathon2026_Main" className="shadow-[0_0_100px_rgba(139,92,246,0.15)]" />
            </motion.div>
          </div>
        </section>

      </div>
    </Layout>
  );
}