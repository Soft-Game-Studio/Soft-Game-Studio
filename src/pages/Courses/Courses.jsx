import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { fireDB } from '../../DataBase/firebaseConfig'
import Layout from '../../components/layout/Layout';
import { Helmet } from 'react-helmet';

const DisplayCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection( fireDB, 'courses'));
        const coursesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses: ", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-100 dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
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

 <div className="min-h-screen bg-purple-100 dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-purple-800 dark:text-purple-400 tracking-tight">
            Our Courses
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Explore our comprehensive learning resources
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No courses available</h3>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Check back later or create new courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <div className="relative pb-48 overflow-hidden">
                  {course.thumbnail ? (
                    <img loading="lazy" 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white text-xl font-bold">{course.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.type === 'single' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                    }`}>
                      {course.type === 'single' ? 'Single' : 'Playlist'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                    {course.description}
                  </p>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 dark:text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(course.createdAt?.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <Link 
                      to={
                        course.type === 'single' 
                          ? `/SingleCourse/${course.id}` 
                          : `/PlayListCourse/${course.id}`
                      }
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </Layout>
   
  );
};

export default DisplayCourses;