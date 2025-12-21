
import React from "react";
import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaTelegram,
  FaDiscord,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const AboutUS = [
    { name: "About SGS", path: "/About-SGS" },
    { name: "About Exam", path: "/About-Exam" },
    { name: "About Development", path: "/AboutDevelopmet" },
    { name: "Our Members", path: "/OurMembers"},
    { name: "Our Commuinity", path: "/OurCommunity"},


     

    
  ];

  const ContactUs = [
    { name: "Contact Us", path: "/ContactUs" },
    { name: "Feedback", path: "/Feedback" },
    { name: "FAQs", path: "/FAQs" },
    { name: "Suport US", path: "/SuportUs" },
  ];

  const Legal = [
    { name: "Privacy Policy", path: "/PrivacyPolicy" },
    { name: "Terms & Conditions", path: "/TermsAndConditions" },
    { name: "Return Policy", path: "/ReturnPolicy" },
    { name: "Cookies Ploicy", path: "/CookiesPolicy" },
    { name: "Copyright", path: "/CopyrightPage" },

    
  ];

  const Feature = [
    { name: "E-Books", path: "/E-Books" },
    { name: "Projets", path: "/Project" },
    { name: "Our Courses", path: "/OurCourse" },
    { name: "Notes & Books", path: "/Notes&Books" },
    // { name: "SGS Quiz App", path: "/SGS-Quiz-App" },

    
  ];

  const socialLinks = [
    {
      href: "https://www.facebook.com/profile.php?id=61570435445258",
      icon: FaFacebook,
    },
    {
      href: "https://www.instagram.com/softgamestudioofficial/",
      icon: FaInstagram,
    },
    {
      href: "https://www.youtube.com/@SoftGameStudioOfficial",
      icon: FaYoutube,
    },
    {
      href: "https://whatsapp.com/channel/0029VaeXVLD4SpkEzB372n2B",
      icon: FaWhatsapp,
    },
    { href: "https://t.me/softgamestudio", icon: FaTelegram },
    { href: "https://github.com/SOFTGAMESTUDIO", icon: FaGithub },
    { href: "https://discord.com/invite/p5mzsy6r", icon: FaDiscord },
    {
      href: "https://www.linkedin.com/company/soft-game-studio/",
      icon: FaLinkedin,
    },
  ];

  const footerSections = [
    { title: "About", items: AboutUS },
    { title: "Contact", items: ContactUs },
    { title: "Legal", items: Legal },
    { title: "Features", items: Feature },
  ];

  return (
    <footer className=" dark:text-white text-gray-900  py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Logo & Description */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="md:w-1/4"
          >
            <div className="flex items-center space-x-3 mb-4">
              <img loading="lazy" 
               
                src="https://firebasestorage.googleapis.com/v0/b/soft-game-studio.firebasestorage.app/o/Assets%2FSqure%20Logo.png?alt=media"
                className="w-10 h-10 rounded-full"
                alt="SOFT GAME STUDIO"
              />
              <h2 className="text-xl font-bold">SOFT GAME STUDIO</h2>
            </div>
            <p className="transition duration-1000 transform text-gray-800 dark:text-gray-300 text-sm">
              Empowering the next generation of developers with modern tech,
              real-world projects, and student-friendly programming resources —
              all under one roof at SOFT GAME STUDIO.
            </p>

            <div className="flex mt-4  flex-wrap">
              {socialLinks.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.95 }}
                  className="transition duration-1000 transform text-xl dark:text-gray-300 text-gray-800 hover:text-cyan-400 m-1"
                >
                  <item.icon />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Dynamic Columns */}
        <div className="w-full md:w-4/5 flex flex-wrap justify-between gap-10">
        {footerSections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className="w-1/3 md:w-1/5"
            >
              
                <h3 className="transition duration-1000 transform text-gray-900 dark:text-cyan-400  font-bold mb-3">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i}>
                      <Link
                        to={item.path}
                        className="transition duration-1000 transform text-gray-800 dark:text-gray-300 dark:hover:text-white hover:text-gray-900 hover:font-bold hover:scale-105"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              
            </motion.div>
          ))}
          </div>
          
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center text-sm text-gray-900  dark:text-gray-200 mt-10 border-t border-gray-700 pt-4"
        >
          © 2025 SOFT GAME STUDIO. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
