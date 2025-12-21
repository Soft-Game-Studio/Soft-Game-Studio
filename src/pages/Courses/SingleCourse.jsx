import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';

import { fireDB } from '../../DataBase/firebaseConfig';
import VideoPlayer from '../../components/Video Player/Videoplayer';
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';
import axios from "axios";

const SingleCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [videoId, setvideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const API_KEY = import.meta.env.VITE_GOOGLE_API; // Replace with your actual API key

  const [videoDetails, setVideoDetails] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log("Fetching course with ID:", id);
        const docRef = doc(fireDB, 'courses', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const courseData = { id: docSnap.id, ...docSnap.data() };
          console.log("Fetched course:", courseData);
          setCourse(courseData);
          setvideoId(courseData.videoUrl)
        } else {
          console.warn('Course not found in Firestore');
          setError('Course not found');
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/videos`,
          {
            params: {
              part: "snippet,contentDetails,statistics",
              id: videoId,
              key: API_KEY,
            },
          }
        );
        setVideoDetails(response.data.items[0]);
      } catch (error) {
        console.error("Error fetching video data", error);
      }
    };

    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  const formatDuration = (isoDuration) => {
    const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = (match[1] || "0H").slice(0, -1);
    const minutes = (match[2] || "0M").slice(0, -1);
    const seconds = (match[3] || "0S").slice(0, -1);
    return `${hours !== "0" ? hours + "h " : ""}${minutes}m ${seconds}s`;
  };
  



  

  if (loading || !videoDetails) {
    return (
      <div className="min-h-screen bg-purple-100 dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
      </div>
    );
  }
  const { snippet, statistics, contentDetails } = videoDetails;

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
        {/* Hero */}
        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-900 pt-32 pb-24">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{course?.title || "Untitled Course"}</h1>
                <p className="text-xl text-purple-200 max-w-2xl mb-8">{course?.description || "No description provided."}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <span className="px-4 py-2 bg-purple-800 bg-opacity-30 rounded-full text-white text-sm font-medium">
                    Single Course
                  </span>
                  <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-white text-sm font-medium">
                    Published: {course?.createdAt?.toDate?.().toLocaleDateString?.() || "Unknown"}
                  </span>
                </div>
              </div>
              <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="absolute inset-0 bg-purple-500 rounded-2xl transform rotate-3"></div>
                  <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
                    {course?.thumbnail ? (
                      <img loading="lazy" 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="bg-gradient-to-r from-purple-400 to-indigo-500 w-full h-64 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-center">
                        <button className="w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-all transform hover:scale-105">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
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
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Course Content</h2>
                  
                  <div className="mb-8">
                    <div className="aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden">
                      {course?.videoUrl ? (
                        <VideoPlayer
                          videoId={String(course.videoUrl).trim()}
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

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Course Notes</h3>
                    <div className="prose max-w-none dark:prose-invert prose-purple">
                      {course?.notes ? (
                        <div
  className="prose max-w-none dark:prose-invert prose-purple"
  dangerouslySetInnerHTML={{ __html: course.notes }}
/>
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400 italic">
                          No notes available for this course.
                        </div>
                      )}
                    </div>
                  </div>

                  {Array.isArray(course?.sourceLinks) && course.sourceLinks.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Resources & Source Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course.sourceLinks.map((link, index) => (
                          <a 
                            key={index}
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-gray-50 dark:bg-neutral-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-4 rounded-lg border border-gray-200 dark:border-neutral-700 transition-colors group overflow-hidden "
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
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden sticky top-6">
                <div className="p-6 border-b border-gray-200 dark:border-neutral-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Course Details</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatDuration(contentDetails.duration)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-600 dark:text-gray-400">Views : <span className="font-medium text-gray-900 dark:text-white">{statistics.viewCount}</span> </span>
                    
                    <span className="text-gray-600 dark:text-gray-400">Likes : <span className="font-medium text-gray-900 dark:text-white">{statistics.likeCount}</span></span>
                    
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-600 dark:text-gray-400">Uploaded on</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(snippet.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
       

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 dark:from-purple-900 dark:to-indigo-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to learn more?</h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto mb-8">
              Explore our full catalog of courses to advance your skills and career.
            </p>
            <Link 
              to="/OurCourse" 
              className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleCourse;
