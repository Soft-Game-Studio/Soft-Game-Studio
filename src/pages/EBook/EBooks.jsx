// src/pages/EbookReader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  FaArrowLeft, 
  FaDownload, 
  FaBook, 
  FaChevronDown, 
  FaChevronUp, 
  FaSpinner,
  FaBookOpen,
  FaFilePdf,
  FaPrint
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { fireDB } from '../../DataBase/firebaseConfig';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';
import RenderContent from '../../components/RenderContent';

import katex from "katex";
import "katex/dist/katex.min.css";

const renderMathToHTML = (content) => {
  return content.replace(/\$\$(.*?)\$\$/g, (_, formula) => {
    return katex.renderToString(formula, {
      throwOnError: false,
      displayMode: true,
    });
  });
};

const EbookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const contentRefs = useRef([]);
  const parallaxRef = useRef(null);
  const chapterRefs = useRef([]); // New ref for chapter containers

  useEffect(() => {
    const fetchEbook = async () => {
      try {
        setLoading(true);
        
        // Fetch ebook details
        const ebookRef = doc(fireDB, 'Ebooks', id);
        const ebookDoc = await getDoc(ebookRef);
        
        if (!ebookDoc.exists()) {
          throw new Error('eBook not found');
        }
        
        setEbook(ebookDoc.data());
        
        // Fetch chapters
        const chaptersCollection = collection(fireDB, `Ebooks/${id}/chapters`);
        const chaptersSnapshot = await getDocs(chaptersCollection);
        
        const chaptersData = [];
        chaptersSnapshot.forEach(doc => {
          chaptersData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort chapters by chapter number
        chaptersData.sort((a, b) => a.chapterNo - b.chapterNo);
        setChapters(chaptersData);
        
        // Initialize refs
        contentRefs.current = chaptersData.map(() => React.createRef());
        chapterRefs.current = chaptersData.map(() => React.createRef()); // Initialize chapter refs
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching ebook:', err);
        setError('Failed to load ebook. Please try again later.');
        setLoading(false);
      }
    };

    fetchEbook();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrollPosition = window.pageYOffset;
        parallaxRef.current.style.transform = `translateY(${scrollPosition * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FIX: Scroll expanded chapter to center of viewport
  const scrollToExpandedChapter = (chapterId) => {
    const chapterIndex = chapters.findIndex(chapter => chapter.id === chapterId);
    if (chapterIndex !== -1 && chapterRefs.current[chapterIndex]) {
      // Calculate center position
      const element = chapterRefs.current[chapterIndex];
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - (window.innerHeight / 2) + (element.clientHeight / 2);
      
      // Scroll to center the element
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const toggleChapter = (chapterId) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);
      // Scroll to the chapter after a short delay to allow rendering
      setTimeout(() => scrollToExpandedChapter(chapterId), 50);
    }
  };

  const downloadAsPDF = async (chapter, index) => {
    setPdfGenerating(true);
    setCurrentChapter(chapter);
    
    try {
      // Create a temporary element with proper styling
      const tempDiv = document.createElement('div');
      tempDiv.className = 'prose max-w-none bg-white p-10 rounded-xl';
      tempDiv.innerHTML = renderMathToHTML(chapter.content);
      document.body.appendChild(tempDiv);
      
      const opt = {
        margin: 20,
        filename: `${chapter.title.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          backgroundColor: '#FFFFFF'
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };

      await html2pdf().set(opt).from(tempDiv).save();
      
      // Clean up
      document.body.removeChild(tempDiv);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };

  const downloadAllChaptersAsPDF = async () => {
    setPdfGenerating(true);
    
    try {
      const zip = new JSZip();
      
      for (const [index, chapter] of chapters.entries()) {
        // Create a temporary element for each chapter
        const tempDiv = document.createElement('div');
        tempDiv.className = 'prose max-w-none bg-white p-10 rounded-xl';
       tempDiv.innerHTML = renderMathToHTML(chapter.content);
        document.body.appendChild(tempDiv);
        
        // Generate PDF for this chapter
        const pdfBlob = await html2pdf().set({
          margin: 20,
          filename: `${chapter.title.replace(/\s+/g, '_')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2, 
            useCORS: true,
            backgroundColor: '#FFFFFF'
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        }).from(tempDiv).outputPdf('blob');
        
        // Remove temporary element
        document.body.removeChild(tempDiv);
        
        // Add PDF to zip
        zip.file(`${chapter.chapterNo}_${chapter.title.replace(/\s+/g, '_')}.pdf`, pdfBlob);
      }
      
      // Generate the zip file
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `${ebook.title.replace(/\s+/g, '_')}_Chapters.zip`);
    } catch (err) {
      console.error('Error downloading all chapters as PDF:', err);
      alert('Failed to download all chapters. Please try again.');
    } finally {
      setPdfGenerating(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-sky-900">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="h-16 w-16 text-white mb-6" />
          </motion.div>
          <p className="text-white/80 text-xl font-light">Loading your eBook experience...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 p-6">
        <div className="bg-red-500/20 backdrop-blur-lg border border-red-400/30 text-white px-8 py-6 rounded-2xl max-w-md">
          <p className="font-bold text-xl mb-2">Error loading eBook</p>
          <p className="mt-2">{error}</p>
        </div>
        <motion.button 
          onClick={() => navigate('/')} 
          className="mt-8 bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center backdrop-blur-lg border border-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaArrowLeft className="mr-2" />
          Back to Library
        </motion.button>
      </div>
    );
  }

  return (
    <Layout>
       <Helmet>
        <title>E-Books | Soft Game Studio</title>
        <meta 
          name="description" 
          content="Explore a wide range of free and affordable E-Books. Soft Game Studio offers Short Notes E books with pdf formate " 
        />
        <meta 
          name="keywords" 
          content="Free E-Books, Affordable E-Books, Ebooks PDF, Full Detailed E-Book, languages  E-Book , Student learning , Developer E-Books, Soft Game Studio E-books, Soft Game Studio " 
        />
        <meta name="author" content="Soft Game Studio" />
        
        <meta property="og:title" content="E-Books | Soft Game Studio" />
        <meta 
          property="og:description" 
          content="Free E-Books, Affordable E-Books, Ebooks PDF, Full Detailed E-Book, languages  E-Book , Student learning , Developer E-Books, Soft Game Studio E-books, Soft Game Studio " 
        />
        <meta property="og:url" content="https://softgamestudios.web.app/E-Books" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-purple-50 dark:bg-gradient-to-b dark:from-neutral-950 dark:to-purple-900/10">
        {/* Enhanced Parallax Title Section */}
        <div className="relative h-[85vh] overflow-hidden">
          <div 
            ref={parallaxRef}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: ebook?.coverImageURL 
                ? `url(${ebook.coverImageURL})` 
                : 'linear-gradient(135deg, #7e22ce, #6366f1, #0ea5e9)',
              transform: 'scale(1.15)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
            {!ebook?.coverImageURL && (
              <div className="absolute inset-0 flex items-center justify-center">
                <FaBookOpen className="h-32 w-32 text-white opacity-30" />
              </div>
            )}
          </div>
          
          {/* Glassmorphism Navigation */}
          <div className="relative z-10 h-full flex flex-col bg-black/80">
            <div className="pt-10 px-6 lg:px-12">
              <div className="flex justify-between items-center">
                <motion.button 
                  onClick={() => navigate('/E-Books')}
                  className="flex items-center text-white hover:text-white/90 transition-colors bg-white/10 backdrop-blur-xl px-5 py-3 rounded-xl border border-white/20 shadow-lg"
                  whileHover={{ x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft className="mr-3" />
                  <span className="font-medium">Back to Library</span>
                </motion.button>
                
                <div className="flex gap-4">
                  
                  <motion.button 
                    onClick={downloadAllChaptersAsPDF}
                    disabled={pdfGenerating}
                    className={`bg-rose-500/90 hover:bg-rose-500 text-white py-3 px-5 rounded-xl transition-all flex items-center backdrop-blur-xl shadow-lg ${
                      pdfGenerating ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaFilePdf className="mr-3" />
                    {pdfGenerating ? 'Generating...' : 'Download PDFs'}
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <motion.h1 
                className="text-5xl md:text-7xl font-bold text-white drop-shadow-xl max-w-4xl"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                {ebook?.title}
              </motion.h1>
             
            </div>
          </div>
        </div>

        {/* Floating Chapters Section */}
        <div className="relative bg-transparent -mt-32 z-10 pt-16 px-4 sm:px-6 lg:px-8 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <motion.div
                  className="inline-flex items-center justify-center bg-purple-600 p-4 rounded-2xl mb-6 shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <FaBookOpen className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Book Chapters</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-lg mx-auto">
                  Explore each chapter and download as PDF or print
                </p>
              </div>
              
              <div className="space-y-8">
                {chapters.length === 0 ? (
                  <div className="p-10 text-center rounded-2xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-lg border border-purple-200 dark:border-purple-900/50 shadow-xl">
                    <FaBook className="h-16 w-16 mx-auto text-purple-500 dark:text-purple-400 mb-6" />
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                      No chapters available
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      This eBook doesn't have any chapters yet.
                    </p>
                  </div>
                ) : (
                  chapters.map((chapter, index) => (
                    <motion.div 
                      key={chapter.id}
                      ref={el => chapterRefs.current[index] = el} // Add ref to chapter container
                      className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-purple-100 dark:border-purple-900/30 transition-all duration-300 hover:shadow-2xl"
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                    >
                      <div 
                        className="p-7 cursor-pointer"
                        onClick={() => toggleChapter(chapter.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl w-12 h-12 flex items-center justify-center mr-5 shadow-lg">
                              <span className="font-bold text-lg">{chapter.chapterNo}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                              {chapter.title}
                            </h3>
                          </div>
                          <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-xl">
                            {expandedChapter === chapter.id ? 
                              <FaChevronUp /> : 
                              <FaChevronDown />
                            }
                          </button>
                        </div>
                      </div>
                      
                      {expandedChapter === chapter.id && (
                        <motion.div 
                          className="px-7 pb-7"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="ml-17 border-t border-purple-200 dark:border-neutral-700 pt-6">
                            {/* <div 
                              className="prose max-w-none  text-black bg-white  p-8 rounded-2xl shadow-inner mb-6 "
                              dangerouslySetInnerHTML={{ __html: chapter.content }}
                            /> */}
             
                            
                                             <div className="prose max-w-none text-black bg-white p-8 rounded-2xl shadow-inner mb-6">
  <RenderContent content={chapter.content} />
</div>
                            
                            <div className="flex flex-wrap justify-end gap-4">
                              <motion.button 
                                onClick={() => downloadAsPDF(chapter, index)}
                                disabled={pdfGenerating}
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-xl transition-all flex items-center shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {pdfGenerating && currentChapter?.id === chapter.id ? (
                                  <FaSpinner className="animate-spin mr-3" />
                                ) : (
                                  <FaFilePdf className="mr-3" />
                                )}
                                {pdfGenerating && currentChapter?.id === chapter.id ? 'Generating...' : 'Download PDF'}
                              </motion.button>
                           
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced PDF Generation Status */}
        {pdfGenerating && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center">
            <motion.div 
              className="bg-white dark:bg-neutral-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-purple-200 dark:border-purple-900/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  animate={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <FaFilePdf className="h-16 w-16 text-purple-600 dark:text-purple-400 mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Generating PDF</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-5">
                  Crafting a professional document for you...
                </p>
                {currentChapter && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-3 rounded-lg w-full text-center">
                    <p className="text-purple-600 dark:text-purple-400 font-medium truncate">
                      {currentChapter.title}
                    </p>
                  </div>
                )}
                <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2 mt-6">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full"
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EbookReader;