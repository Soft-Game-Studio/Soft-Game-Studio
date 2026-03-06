import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Layout from '../layout/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowRight, FaChartLine, FaTrophy, FaShieldAlt, FaEye, FaHeart } from 'react-icons/fa';
import { fireDB } from '../../DataBase/firebaseConfig';
import {
  collection,
  getDocs,
} from 'firebase/firestore';
const HomePage = () => {

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('development');
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const yText = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], ['1', '0']);



const handleViewDetails = (projectId) => {
    navigate(`/SGS-Projects/${projectId}`); // Navigate to details page
  };



const [projects, setProjects] = useState([]);

const loopProjects = [...projects, ...projects];
      
        const fetchProjects = async () => {
          const querySnapshot = await getDocs(collection(fireDB, 'sgsProjects'));
          const projectsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProjects(projectsData);
        };
          useEffect(() => {
            fetchProjects();
          }, []);
  
      const renderImagePreview = (url, className = '') => (
      <img loading="lazy" 
        src={url} 
        alt="Project preview" 
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.parentElement.innerHTML = '<div class="bg-gray-200 border-2 border-dashed w-full h-full flex items-center justify-center text-gray-500">Image failed to load</div>';
        }}
      />
    );


  // Development pricing tiers
  const pricingTiers = [
    {
      name: "Basic Pack",
      description: "Perfect for small projects and startups",
      features: [
        "Responsive Design",
        "Basic SEO Optimization",
        "3 Page Website",
        "1 Month Support",
        "Basic Contact Form"
      ]
    },
    {
      name: "Startup Pack",
      description: "Ideal for growing businesses",
      features: [
        "Custom UI/UX Design",
        "Advanced SEO",
        "Up to 10 Pages",
        "CMS Integration",
        "3 Months Support",
        "Basic E-commerce"
      ]
    },
    {
      name: "Professional Pack",
      description: "For established businesses",
      features: [
        "Premium Design",
        "E-commerce Functionality",
        "Unlimited Pages",
        "6 Months Support",
        "Mobile App Integration",
        "Advanced Analytics"
      ]
    },
    {
      name: "Enterprise Pack",
      description: "Tailored solutions for large organizations",
      features: [
        "Custom Web Applications",
        "API Integrations",
        "Enterprise Security",
        "Dedicated Support Team",
        "Scalable Infrastructure",
        "24/7 Monitoring"
      ]
    }
  ];

  // Education resources
  const educationResources = [
    {
      id: 1,
      title: "Notes & Books",
      description: "Detailed study materials for all subjects",
      icon: "📝",
      link: "/Notes&Books"
    },
    {
      id: 2,
      title: "Online Courses",
      description: "Interactive learning with expert instructors",
      icon: "🎓",
      link: "/OurCourse"
    },
    {
      id: 3,
      title: "E-Books Library",
      description: "Thousands of reference books and materials",
      icon: "📚",
      link: "/E-Books"
    },
  ];

  // Exam Competition
  const examPic = [
    {
      id: 1,
      img: "https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Our%20Social%20Work%2F2025-04-30.jpg?alt=media&token=82cdbc13-0dee-4850-b26e-4264030fbc8f",
      title: "Code Vortex - SGS",
      description: "🎉 Soft Game Studio successfully hosted CODE VORTEX — a thrilling coding competition at MIMIT College for BCA students, featuring tracks in C, C++, Python, and Web Dev. With full participation, live challenges, and immense enthusiasm, it was a celebration of tech, teamwork, and innovation. 🙌💻",
    },
    {
      id: 2,
      img: "https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Our%20Social%20Work%2FIMG-20250319-WA0005.jpg?alt=media&token=1be384ea-b1c2-4728-a2cd-e26752f0c14e",
      title: "Code Vortex - SGS",
      description: "🎉 Soft Game Studio successfully hosted CODE VORTEX — a thrilling coding competition at MIMIT College for BCA students, featuring tracks in C, C++, Python, and Web Dev. With full participation, live challenges, and immense enthusiasm, it was a celebration of tech, teamwork, and innovation. 🙌💻",
    },
     {
      id: 3,
      img: "https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Our%20Social%20Work%2FWhatsApp%20Image%202025-10-29%20at%202.41.56%20PM%20(1).jpeg?alt=media&token=8fc352cd-c64f-448b-9bc3-7f30249907d3",
      title: "Code Clash - SGS",
      description: "🎉 Soft Game Studio successfully hosted CODE CLASH — an exciting and competitive coding event at MIMIT College for BCA students!The competition featured diverse tracks including C, C++, Python, Java, SQL, PHP, and Web Development.With energetic participation, real-time challenges, and incredible enthusiasm from all students, the event became a true celebration of technology, skills, creativity, and problem-solving. 🙌💻",
    },
     {
      id: 4,
      img: "https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Our%20Social%20Work%2FWhatsApp%20Image%202025-10-29%20at%202.41.56%20PM%20(2).jpeg?alt=media&token=f748965f-07dc-4881-9946-6f0c32e18a2c",
      title: "Code Clash - SGS",
      description: "🎉 Soft Game Studio successfully hosted CODE CLASH — an exciting and competitive coding event at MIMIT College for BCA students!The competition featured diverse tracks including C, C++, Python, Java, SQL, PHP, and Web Development.With energetic participation, real-time challenges, and incredible enthusiasm from all students, the event became a true celebration of technology, skills, creativity, and problem-solving. 🙌💻",
    },
  ];

  return (
    <Layout>
      <div ref={containerRef} className="min-h-screen bg-purple-100 dark:bg-neutral-950 text-purple-900 dark:text-purple-100 transition-colors duration-300">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <motion.div 
            className="inset-0 absolute bg-[url('https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FHOME%20BG.jpg?alt=media')] bg-cover bg-center"
            style={{ y: yBg }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-neutral-950/80" />
          
          <motion.div 
            className="container mx-auto px-6 relative z-10 text-center"
            style={{ y: yText, opacity: opacityText }}
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
            >
              Welcome to <span className="text-purple-400">Soft Game Studio</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-10 text-purple-200 max-w-3xl mx-auto"
            >
              Where creativity meets technology to build immersive digital experiences
            </motion.p>
          </motion.div>
          
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <a href="#tabs-section" className="text-white text-3xl">
              ↓
            </a>
          </div>
        </section>

        {/* App Feature Section */}
        {/* <section className="py-20 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-1 shadow-lg">
                      <img
                        className="w-full h-full rounded-2xl object-cover"
                        src="https://github.com/Soft-Game-Studio/Boomy-Run/blob/main/game.png?raw=true"
                        alt="Boom Run Game"
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-purple-600 dark:text-white mb-2">Boom Run Game</h2>
                      <p className="text-slate-600 dark:text-slate-300 text-lg">
                       The Ultimate Endless Runner Experience!
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg leading-relaxed">
                   Boomy Run is a free, easy, and mind-relaxing runner game you can play instantly without login.
                  </p>

                 

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      to="/BoomRunGamePage" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full flex items-center justify-center transition-colors"
                    >
                      Explore App
                      <FaArrowRight className="ml-2" />
                    </Link>
                    
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  {[
                    { value: "5K+", label: "Players Worldwide" },
{ value: "20+", label: "Challenging Levels" },
{ value: "4.8★", label: "Player Rating" },
{ value: "100%", label: "Free to Play" },

                  ].map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section> */}

        {/* Tabbed Section */}
        <section id="tabs-section" className="py-20 bg-white dark:bg-neutral-900">
          <div className="container mx-auto px-6">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-16">
              <div className="bg-purple-100 dark:bg-neutral-800 rounded-full p-1 flex">
                {['development', 'education'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-300 ${
                      activeTab === tab
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-purple-900 dark:text-purple-200 hover:text-purple-600 dark:hover:text-purple-400'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'development' ? 'Development Services' : 'Education Resources'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {activeTab === 'development' ? (
                  <div>
                    {/* Development Projects */}
                    <div className="mb-20">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Development Projects</h2>
                        <p className="text-xl text-purple-700 dark:text-purple-400">
                          Innovative solutions crafted with cutting-edge technology
                        </p>
                      </motion.div>

                    <div className="overflow-hidden w-full py-12">
  <motion.div
    className="flex gap-8"
    animate={{ x: ["0%", "-50%"] }}
    transition={{
      repeat: Infinity,
      duration: 40,
      ease: "linear",
    }}
  >
    {[...projects, ...projects].map((project, idx) => (
       <div 
      key={project.id}
      className="group relative min-w-[420px] max-w-[420px] flex-shrink-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-neutral-800 hover:-translate-y-2 hover:scale-[1.02]"
    >
      {/* Premium hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-indigo-500/0 group-hover:from-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-500 z-0" />
      
      {/* Image container with overlay */}
      <div className="relative overflow-hidden h-48">
        {renderImagePreview(project.photoUrl)}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Premium status badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
            {project.status || "Active"}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative p-6 md:p-7 z-10">
        {/* Title and category */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 truncate pr-2">
              {project.name}
            </h3>
          </div>
          
          {project.category && (
            <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
              {project.category}
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 min-h-[72px] leading-relaxed">
          {project.description}
        </p>
        
        {/* Tech stack (optional) */}
        {project.technologies && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 3).map((tech, index) => (
              <span 
                key={index}
                className="px-2.5 py-1 bg-gray-50 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="px-2.5 py-1 text-gray-500 dark:text-gray-400 text-xs font-medium">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col flex-wrap sm:flex-row gap-3">
          
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(project.id);
            }}
            className="px-4 py-3 w-full bg-transparent border-2 border-purple-600 dark:border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>View Details</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    ))}
  </motion.div>
</div>

       

                    
                      <div className='flex justify-center items-center'>
<Link 
  to="/SGS-Projects" 
  className="mt-6 bg-gradient-to-r w-80 from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-full flex items-center justify-center transition-colors duration-300"
>
  Explore More Projects
  <FaArrowRight className="ml-2" />
</Link>
                      </div>

                    </div>

                    

                    {/* Pricing Section */}
                    <div className="mb-20">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Development Packages</h2>
                        <p className="text-xl text-purple-700 dark:text-purple-400">
                          Flexible solutions tailored to your business needs
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {pricingTiers.map((tier, idx) => (
                          <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className={`rounded-2xl shadow-lg p-8 border-2 ${
                              tier.name === "Professional Pack"
                                ? "border-purple-500 dark:border-purple-500 bg-purple-50 dark:bg-neutral-800 scale-105"
                                : "border-purple-200 dark:border-neutral-700"
                            }`}
                          >
                            <div className="text-center mb-6">
                              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                              <p className="text-purple-700 dark:text-purple-300">{tier.description}</p>
                            </div>
                            <ul className="mb-8 space-y-3">
                              {tier.features.map((feature, i) => (
                                <li key={i} className="flex items-start">
                                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 rounded-3xl p-8 md:p-12">
                      <div className="max-w-4xl mx-auto">
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.6 }}
                          viewport={{ once: true }}
                          className="text-center mb-10"
                        >
                          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Contact Us</h2>
                          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                            Get in touch to discuss your project requirements
                          </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          {[
                            { icon: "✉️", title: "Email", value: "sgs.web.app@gmail.com" },
                            { icon: "📱", title: "Phone", value: "For Hindi: +91 9914267704" },
                            { icon: "📱", title: "Phone", value: "For English: +91 6283400770 " },
                          ].map((contact, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: idx * 0.1 }}
                              viewport={{ once: true }}
                              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
                            >
                              <div className="text-4xl mb-4">{contact.icon}</div>
                              <h3 className="text-xl font-bold text-white mb-2">{contact.title}</h3>
                              <p className="text-purple-100">{contact.value}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Education Resources */}
                    <div className="mb-20">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Education Resources</h2>
                        <p className="text-xl text-purple-700 dark:text-purple-400">
                          Comprehensive learning materials for all levels
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {educationResources.map((resource) => (
                          <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8 border border-purple-200 dark:border-neutral-700 hover:shadow-xl transition-all"
                          >
                            <div className="text-4xl mb-4">{resource.icon}</div>
                            <h3 className="text-2xl font-bold mb-3">{resource.title}</h3>
                            <p className="text-purple-700 dark:text-purple-300 mb-6">
                              {resource.description}
                            </p>
                            <Link to={resource.link} className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-purple-300 flex items-center">
                              Learn More
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Exam Gallery */}
                    <div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto mb-16"
                      >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Organized Exams</h2>
                        <p className="text-xl text-purple-700 dark:text-purple-400">
                          Professional examination environments for optimal performance
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {examPic.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="rounded-2xl overflow-hidden shadow-lg"
                          >
                            <div className="h-64 flex items-center justify-center bg-gray-200">
                              <img loading="lazy" 
                                src={item.img} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-6 bg-white dark:bg-neutral-800">
                              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                              <p className="text-purple-700 dark:text-purple-300">
                                {item.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>


        
      </div>
    </Layout>
  );
};

export default HomePage;