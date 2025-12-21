import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';

export default function FreeNotesAndBooks() {
  const [activeTab, setActiveTab] = useState('notes');
  const [searchTerm, setSearchTerm] = useState('');
  const [resources, setResources] = useState({ notes: {}, books: {} });
  const [expandedLanguage, setExpandedLanguage] = useState(null);

  // Reset expanded language when tab changes
  useEffect(() => {
    setExpandedLanguage(null);
  }, [activeTab]);

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      const docRef = doc(fireDB, 'resources', 'data');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setResources(docSnap.data());
    };
    fetchResources();
  }, []);

  // Filter languages based on search term
  const filteredLanguages = Object.keys(resources[activeTab] || {})
    .filter(langKey => {
      const langName = resources[activeTab][langKey]?.name || '';
      return langName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      const nameA = resources[activeTab][a]?.name || '';
      const nameB = resources[activeTab][b]?.name || '';
      return nameA.localeCompare(nameB);
    });

  // Toggle expanded view for a language
  const toggleExpand = (langKey) => {
    setExpandedLanguage(expandedLanguage === langKey ? null : langKey);
  };

  return (
    <Layout>
      <Helmet>
  <title>Free Notes & Book PDFs | Soft Game Studio</title>
  <meta 
    name="description" 
    content="Download free notes and book PDFs collected from top institutes and trusted educational resources. Soft Game Studio provides easy access to learning material at no cost." 
  />
  <meta 
    name="keywords" 
    content="Free Notes, Book PDFs, Institute Notes, Educational PDFs, Study Material, Free Resources, Soft Game Studio Notes, College Notes, Competitive Exam Books, Student Learning Material" 
  />
  <meta name="author" content="Soft Game Studio" />

  {/* Open Graph / Social Tags */}
  <meta property="og:title" content="Free Notes & Book PDFs | Soft Game Studio" />
  <meta 
    property="og:description" 
    content="Access a wide range of free notes and books in PDF format from reputed institutes and platforms. Perfect for students and learners." 
  />
  <meta property="og:url" content="https://softgamestudios.web.app/notes-books" />
  <meta property="og:type" content="website" />
</Helmet>

      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-neutral-900 dark:to-neutral-950">
        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2232&auto=format&fit=crop')] bg-cover bg-center opacity-20 dark:opacity-10" />
          <div className="container mx-auto h-full flex flex-col justify-center px-6 relative">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-purple-900 dark:text-purple-100 mb-4"
            >
              Free Learning Resources
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-purple-800 dark:text-purple-200 max-w-2xl"
            >
              Browse our collection of free {activeTab === 'notes' ? 'notes' : 'books'} by language
            </motion.p>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {/* Tabs and Search */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl overflow-hidden mb-8">
            <div className="flex border-b border-purple-100 dark:border-neutral-700">
              {['notes', 'books'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 py-4 font-medium text-lg transition-all ${activeTab === tab 
                    ? 'text-purple-600 dark:text-purple-300 border-b-2 border-purple-500' 
                    : 'text-purple-400 dark:text-purple-500 hover:text-purple-600 dark:hover:text-purple-300'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={`Search ${activeTab === 'notes' ? 'notes' : 'books'} by language...`}
                    className="w-full p-4 pl-12 rounded-lg border border-purple-200 dark:border-neutral-700 bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <svg 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400 dark:text-purple-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Language Cards */}
              {filteredLanguages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredLanguages.map((langKey) => {
                    const languageData = resources[activeTab][langKey];
                    const items = languageData[activeTab] || [];
                    const isExpanded = expandedLanguage === langKey;
                    
                    return (
                      <motion.div 
                        key={langKey}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        className={`bg-white dark:bg-neutral-700 rounded-xl shadow-md overflow-hidden border ${
                          isExpanded 
                            ? 'border-purple-500 dark:border-purple-400 border-2' 
                            : 'border-purple-100 dark:border-neutral-600'
                        }`}
                      >
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            {languageData.imageUrl && (
                              <img loading="lazy" 
                                src={languageData.imageUrl} 
                                alt={languageData.name} 
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                              {languageData.name}
                            </h3>
                          </div>
                          
                          <div className="space-y-3 mt-4">
                            {items.slice(0, isExpanded ? items.length : 3).map((item, index) => (
                              <a
                                key={index}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-neutral-600 transition-colors"
                              >
                                <h4 className="font-medium text-purple-700 dark:text-purple-300">{item.title}</h4>
                                {item.description && (
                                  <p className="text-sm text-purple-600 dark:text-purple-400 mt-1 truncate">{item.description}</p>
                                )}
                              </a>
                            ))}
                          </div>

                          {items.length > 3 && (
                            <div className="mt-3 text-center">
                              <button
                                onClick={() => toggleExpand(langKey)}
                                className="text-sm text-purple-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline"
                              >
                                {isExpanded 
                                  ? 'Show Less' 
                                  : `+${items.length - 3} more resources`}
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-purple-50 dark:bg-neutral-700 rounded-xl p-8 text-center"
                >
                  <p className="text-purple-700 dark:text-purple-300">
                    No {activeTab === 'notes' ? 'notes' : 'books'} found matching your search.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}