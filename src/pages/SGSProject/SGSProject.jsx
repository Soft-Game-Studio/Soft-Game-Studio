import React, { useState, useEffect } from 'react';
import { fireDB } from '../../DataBase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Code2, ArrowRight, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';
import Particles from "react-tsparticles";

export default function SGSProject() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(fireDB, 'sgsProjects'));
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      console.error("Error fetching projects: ", err);
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (projectId) => {
    navigate(`/SGS-Projects/${projectId}`);
  };

  useEffect(() => {
    fetchProjects();
  },[]);

  const renderImagePreview = (url, name) => (
    <div className="relative h-[240px] overflow-hidden rounded-t-[1.5rem] group-hover:rounded-t-[2rem] transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-10 opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
      <motion.img 
        loading="lazy" 
        src={url} 
        alt={`${name} preview`}
        initial={{ scale: 1.2, filter: "blur(10px)" }}
        animate={{ scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        onError={(e) => {
          e.target.onerror = null;
          e.target.parentElement.innerHTML = `
            <div class="w-full h-full bg-gradient-to-br from-purple-900/20 to-indigo-900/40 flex flex-col items-center justify-center text-gray-400 absolute inset-0">
              <div class="p-4 rounded-full bg-white/5 backdrop-blur-md mb-3 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
              </div>
              <span class="text-sm font-medium tracking-wide z-20">Preview Unavailable</span>
            </div>
          `;
        }}
      />
    </div>
  );

  return (
    <Layout>
      <div className="relative min-h-screen bg-[#FAFAFA] dark:bg-[#07070F] text-slate-900 dark:text-white overflow-hidden py-24 selection:bg-purple-500/30">
        
        {/* Animated Particles Background */}
        <Particles
          options={{
            background: { color: "transparent" },
            particles: {
              number: { value: 40, density: { enable: true, value_area: 800 } },
              color: { value: "#8b5cf6" },
              shape: { type: "circle" },
              opacity: { value: 0.2, random: true },
              size: { value: 2, random: true },
              move: { enable: true, speed: 0.5, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: { events: { onhover: { enable: true, mode: "grab" } }, modes: { grab: { distance: 150, line_linked: { opacity: 0.2 } } } },
            retina_detect: true
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-purple-500/30 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
            >
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">Our Portfolio</span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-purple-800 to-indigo-900 dark:from-white dark:via-purple-200 dark:to-indigo-400 drop-shadow-sm">
              Featured Projects
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
              Explore our innovative solutions, built with precision and designed to solve complex real-world challenges.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              // Luxury Skeleton Loader
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white/50 dark:bg-white/5 rounded-[2rem] shadow-xl border border-gray-200/50 dark:border-white/5 overflow-hidden backdrop-blur-xl relative">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5 z-20" />
                    <div className="h-[240px] bg-gray-200 dark:bg-neutral-800/50" />
                    <div className="p-8">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded-full mb-4" />
                      <div className="h-8 w-3/4 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-6" />
                      <div className="space-y-3 mb-8">
                         <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded-full w-full" />
                         <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded-full w-5/6" />
                         <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded-full w-4/6" />
                      </div>
                      <div className="h-12 w-full bg-gray-200 dark:bg-neutral-800 rounded-xl" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : error ? (
              // Error State
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto bg-red-50/80 dark:bg-red-900/10 backdrop-blur-xl border border-red-200 dark:border-red-500/20 rounded-[2rem] p-12 text-center shadow-2xl"
              >
                <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-500/20 mb-6 relative">
                  <div className="absolute inset-0 bg-red-500/20 animate-ping rounded-full" />
                  <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 relative z-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Connection Failed</h3>
                <p className="text-lg text-red-600 dark:text-red-400 mb-8 max-w-md mx-auto">{error}</p>
                <button 
                  onClick={fetchProjects}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all flex items-center gap-2 mx-auto"
                >
                  Try Again <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            ) : projects.length === 0 ? (
              // Empty State
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto bg-gradient-to-br from-white/60 to-white/30 dark:from-white/5 dark:to-transparent backdrop-blur-2xl rounded-[3rem] p-16 text-center border border-purple-100/50 dark:border-white/10 shadow-2xl"
              >
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/20 mb-8 border border-white/50 dark:border-white/5 shadow-inner">
                  <FolderGit2 className="w-16 h-16 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Launching Soon</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
                  Our development team is currently forging new digital experiences. Check back shortly to view our latest creations.
                </p>
                <button 
                  onClick={fetchProjects}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 flex items-center gap-3 mx-auto"
                >
                  <Code2 className="w-5 h-5" /> Refresh Repository
                </button>
              </motion.div>
            ) : (
              // Projects Grid
              <motion.div 
                key="grid"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              >
                {projects.map((project, index) => (
                  <motion.div 
                    key={project.id}
                    variants={{
                      hidden: { opacity: 0, y: 50 },
                      visible: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3, duration: 0.8 } }
                    }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="group relative bg-white/80 dark:bg-[#11111A]/80 backdrop-blur-xl rounded-[2rem] shadow-xl hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.2)] transition-all duration-500 border border-gray-200 dark:border-white/5 flex flex-col perspective-[1000px]"
                  >
                    {/* Glowing border effect on hover */}
                    <div className="absolute -inset-[1px] bg-gradient-to-b from-purple-500/0 to-indigo-500/0 group-hover:from-purple-500/50 group-hover:to-indigo-500/50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
                    
                    {/* 3D Image Container */}
                    <div className="relative transform-style-3d group-hover:rotate-x-2 transition-transform duration-500 rounded-t-[2rem]">
                      {renderImagePreview(project.photoUrl, project.name)}
                      
                      {/* Floating Status Badge */}
                      <div className="absolute top-5 right-5 z-20">
                        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full shadow-lg">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                          <span className="text-xs font-bold tracking-wider text-white uppercase">
                            {project.status || "Live"}
                          </span>
                        </div>
                      </div>

                      {/* Floating Category Badge */}
                      {project.category && (
                        <div className="absolute bottom-5 left-5 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                           <span className="px-4 py-1.5 bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold rounded-lg shadow-xl uppercase tracking-wider">
                            {project.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div className="relative p-8 flex-grow flex flex-col z-10 bg-white dark:bg-transparent rounded-b-[2rem]">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-indigo-400 transition-all duration-300 mb-4 line-clamp-1">
                        {project.name}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-8 line-clamp-3 leading-relaxed font-medium flex-grow">
                        {project.description}
                      </p>
                      
                      {/* Technologies Pill Container */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8 h-[60px] overflow-hidden">
                          {project.technologies.slice(0, 4).map((tech, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1.5 bg-gray-100/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-xl transition-colors hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-900/20"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="px-3 py-1.5 text-gray-500 dark:text-gray-500 text-xs font-bold flex items-center">
                              +{project.technologies.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Premium Action Button */}
                      <div className="mt-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(project.id);
                          }}
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl font-bold text-gray-900 dark:text-white flex items-center justify-between group/btn hover:bg-purple-600 hover:border-purple-600 dark:hover:bg-purple-500 dark:hover:border-purple-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-purple-500/25"
                        >
                          <span className="tracking-wide">Case Study</span>
                          <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white flex items-center justify-center group-hover/btn:bg-white/20 group-hover/btn:text-white transition-colors group-hover/btn:-rotate-45">
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && projects.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-20 text-center pb-8"
            >
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-white/5 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Displaying {projects.length} curated projects
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </Layout>
  );
}