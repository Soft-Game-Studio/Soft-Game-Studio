import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { fireDB } from '../../DataBase/firebaseConfig';
import VideoPlayer from '../../components/Video Player/Videoplayer'
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';

const PlayListCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const docRef = doc(fireDB, 'courses', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCourse({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError('Course not found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course data');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-100 dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-purple-100 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link 
            to="/" 
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Layout>
       <Helmet>
        <title>Courses | Soft Game Studio</title>
        <meta 
          name="description" 
          content="Explore free and affordable courses offered by Soft Game Studio. Learn development, design, and career skills with expert-created content for students and professionals." 
        />
        <meta 
          name="keywords" 
          content="Free Courses, Affordable Courses, Development Courses, Design Courses, Learn to Code, Online Learning, Student Courses, Soft Game Studio Courses, Career Building Courses" 
        />
        <meta name="author" content="Soft Game Studio" />
      
        {/* Open Graph / Social Sharing Tags */}
        <meta property="og:title" content="Courses | Soft Game Studio" />
        <meta 
          property="og:description" 
          content="Soft Game Studio offers a wide range of free and affordable online courses. Learn development, design, and career skills at your own pace." 
        />
         <meta property="og:url" content="https://softgamestudios.web.app/OurCourse" />
  <meta property="og:url" content="https://softgamestudios.web.app/OurCourse" /> 
        <meta property="og:type" content="website" />
      </Helmet>
<div className="min-h-screen bg-purple-100 dark:bg-neutral-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-900 pt-32 pb-24">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course.title}</h1>
              <p className="text-xl text-purple-200 max-w-2xl mb-8">{course.description}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-purple-800 bg-opacity-30 rounded-full text-white text-sm font-medium">
                  Playlist Course
                </span>
                <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium">
                  {course.chapters?.length || 0} Chapters
                </span>
                <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium">
                  Published: {course.createdAt?.toDate().toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-purple-500 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
                  {course.thumbnail ? (
                    <img loading="lazy" 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="bg-gradient-to-r from-purple-400 to-indigo-500 w-full h-64 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Course Progress</h3>
                        <div className="mt-2 w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-2.5">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">3 of {course.chapters?.length || 0} chapters completed</p>
                      </div>
                      <button className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapters List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Chapters</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{course.chapters?.length || 0} chapters in this playlist</p>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-neutral-700">
                {course.chapters?.map((chapter, index) => (
                  <div 
                    key={index} 
                    className={`p-6 cursor-pointer transition-colors ${
                      index === activeChapter 
                        ? 'bg-purple-50 dark:bg-purple-900/20' 
                        : 'hover:bg-gray-50 dark:hover:bg-neutral-700'
                    }`}
                    onClick={() => setActiveChapter(index)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                        <span className="font-medium text-purple-600 dark:text-purple-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          index === activeChapter 
                            ? 'text-purple-600 dark:text-purple-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {chapter.title || `Chapter ${index + 1}`}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          15 min • {index === 0 ? 'Free Preview' : 'Members Only'}
                        </p>
                      </div>
                      <div className="ml-auto flex items-center">
                        {index < 3 && (
                          <span className="ml-3 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full">
                            Completed
                          </span>
                        )}
                        {index === activeChapter && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-3 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
           
          </div>
          
          {/* Chapter Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {course.chapters?.[activeChapter]?.title || `Chapter ${activeChapter + 1}`}
                  </h2>
                  <div className="flex items-center">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Video Player */}
                <div className="mb-8">
                  <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden">
                    {course.chapters?.[activeChapter]?.videoUrl ? (
                      
                        <VideoPlayer
                                      videoId={`${course.chapters[activeChapter].videoUrl}`}
                                    />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Notes */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Chapter Notes</h3>
                  <div className="prose max-w-none dark:prose-invert prose-purple">
                    {course.chapters?.[activeChapter]?.notes ? (
                       <div
  className="prose max-w-none dark:prose-invert prose-purple"
  dangerouslySetInnerHTML={{ __html: course.notes }}
/>
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 italic">
                        No notes available for this chapter.
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Resources */}
                {course.chapters?.[activeChapter]?.sourceLinks && course.chapters[activeChapter].sourceLinks.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Resources & Source Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {course.chapters[activeChapter].sourceLinks.map((link, index) => (
                        <a 
                          key={index}
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-gray-50 overflow-hidden dark:bg-neutral-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-4 rounded-lg border border-gray-200 dark:border-neutral-700 transition-colors group"
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                                Resource {index + 1}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">{link}</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Navigation */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-700 flex justify-between">
                  {activeChapter > 0 && (
                    <button 
                      onClick={() => setActiveChapter(activeChapter - 1)}
                      className="flex items-center px-6 py-3 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous Chapter
                    </button>
                  )}
                  
                  {activeChapter < (course.chapters?.length - 1 || 0) && (
                    <button 
                      onClick={() => setActiveChapter(activeChapter + 1)}
                      className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors ml-auto"
                    >
                      Next Chapter
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  
                  {activeChapter === (course.chapters?.length - 1 || 0) && (
                    <button className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors ml-auto">
                      Complete Course
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Master your skills with our courses</h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-8">
            Join thousands of students who have advanced their careers with our learning platform.
          </p>
          <Link 
            to="/OurCourse" 
            className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Explore More Courses
          </Link>
        </div>
      </div>
    </div>
    </Layout>
    
  );
};

export default PlayListCourse;