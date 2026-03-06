import React, { useEffect } from "react";
import logo from "../../Assictes/23.png"; // Ensure the path is correct

const RedirectPage = () => {
  const siteUrl = "https://softgamestudios.web.app/";

//   Auto-redirect after 3 seconds – uncomment to enable
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = siteUrl;
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-12 text-center border border-white/20 animate-fade-in-up">
        {/* Logo and title */}
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-lg"></div>
            <img
              src={logo}
              alt="Soft Game Studio Logo"
              className="relative w-24 h-24 rounded-full shadow-lg border-4 border-white"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent">
            Soft Game Studio
          </h1>
        </div>

        <p className="mt-6 text-gray-700 text-lg md:text-xl font-light leading-relaxed">
          Where creativity meets technology to build immersive digital experiences.
        </p>

        {/* Redirect message with spinner */}
        <div className="mt-8 flex flex-col items-center space-y-4">
          <p className="text-sm text-gray-500 uppercase tracking-wider">
            Redirecting you to our official website...
          </p>
          <div className="relative">
            <div className="w-14 h-14 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-14 h-14 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Call to action button */}
        <a
          href={siteUrl}
          className="mt-8 inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Visit Official Website
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>

        {/* Important links */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm">
          {[
            { name: "Contact Us", href: `${siteUrl}ContactUs` },
            { name: "Privacy Policy", href: `${siteUrl}PrivacyPolicy` },
            { name: "Terms", href: `${siteUrl}TermsAndConditions` },
            { name: "Cookies", href: `${siteUrl}CookiesPolicy` },
            { name: "Copyright", href: `${siteUrl}CopyrightPage` },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-600 hover:text-purple-700 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-purple-600 hover:after:w-full after:transition-all"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-gray-400">
          © {new Date().getFullYear()} SOFT GAME STUDIO. All rights reserved.
        </p>
      </div>

      {/* Add custom keyframes for animations */}
      <style>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default RedirectPage;