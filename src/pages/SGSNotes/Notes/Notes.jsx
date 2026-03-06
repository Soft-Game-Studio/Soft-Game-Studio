import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { fireDB } from '../../../DataBase/firebaseConfig';
import Layout from '../../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch, FaSchool, FaGraduationCap, FaCodeBranch,
  FaBook, FaFilePdf, FaCalendarAlt, FaEye,
  FaFilter, FaTimes, FaSortAmountDown, FaUserGraduate,
  FaCompressArrowsAlt, FaExclamationCircle,
  FaUniversity, FaLayerGroup, FaArrowRight,
  FaQuestionCircle
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    college: '',
    course: '',
    branch: '',
    semester: '',
    subject: '',
    category: '',
    sort: 'newest'
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [uniqueValues, setUniqueValues] = useState({
    colleges: [],
    courses: [],
    branches: [],
    semesters: [],
    subjects: [],
    categories: []
  });
  const [stats, setStats] = useState({
    total: 0,
    totalSize: 0,
    avgCompression: 0,
    uniqueColleges: 0,
    uniqueSubjects: 0
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const navigate = useNavigate();

  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const q = query(
          collection(fireDB, 'notes'),
          where('published', '==', true),
        );

        const snap = await getDocs(q);

        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));

        setNotes(data);
        setFilteredNotes(data);
        extractUniqueValues(data);
        calculateStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Extract dropdown values
  const extractUniqueValues = (data) => {

    setUniqueValues({
      colleges: [...new Set(data.map(n => n.college).filter(Boolean))].sort(),
      courses: [...new Set(data.map(n => n.course).filter(Boolean))].sort(),
      branches: [...new Set(data.map(n => n.branch).filter(Boolean))].sort(),
      semesters: [...new Set(data.map(n => n.semester).filter(Boolean))]
        .sort((a, b) => parseInt(a) - parseInt(b)),
      subjects: [...new Set(data.map(n => n.subject).filter(Boolean))].sort(),
      categories: [...new Set(data.map(n => n.category).filter(Boolean))].sort(),
    });
  };

  const calculateStats = (data) => {
    const total = data.length;
    const totalSize = data.reduce((sum, note) => sum + (note.compressedSize || 0), 0);
    const avgCompression = data.length > 0
      ? Math.round(data.reduce((sum, note) => sum + (note.compressionRatio || 0), 0) / data.length)
      : 0;
    const uniqueColleges = new Set(data.map(n => n.college).filter(Boolean)).size;
    const uniqueSubjects = new Set(data.map(n => n.subject).filter(Boolean)).size;

    setStats({
      total,
      totalSize,
      avgCompression,
      uniqueColleges,
      uniqueSubjects
    });
  };

  // Apply filters + search
  useEffect(() => {
    let result = [...notes];

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(note =>
        note.subject?.toLowerCase().includes(term) ||
        note.studentName?.toLowerCase().includes(term) ||
        note.college?.toLowerCase().includes(term) ||
        note.course?.toLowerCase().includes(term) ||
        note.branch?.toLowerCase().includes(term) ||
        note.category?.toLowerCase().includes(term)
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'sort') {
        result = result.filter(note =>
          String(note[key] ?? '').toLowerCase() === value.toLowerCase()
        );
      }
    });

    // Apply sorting
    if (filters.sort === 'newest') {
      result.sort((a, b) => b.createdAt - a.createdAt);
    } else if (filters.sort === 'oldest') {
      result.sort((a, b) => a.createdAt - b.createdAt);
    } else if (filters.sort === 'size') {
      result.sort((a, b) => (b.compressedSize || 0) - (a.compressedSize || 0));
    } else if (filters.sort === 'name') {
      result.sort((a, b) => (a.subject || '').localeCompare(b.subject || ''));
    }

    setFilteredNotes(result);
    updateActiveFilters();
  }, [searchTerm, filters, notes]);

  const updateActiveFilters = () => {
    const active = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'sort') {
        active.push({ key, value });
      }
    });
    if (searchTerm) {
      active.push({ key: 'search', value: searchTerm });
    }
    setActiveFilters(active);
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const removeFilter = (filterKey) => {
    if (filterKey === 'search') {
      setSearchTerm('');
    } else {
      setFilters(prev => ({ ...prev, [filterKey]: '' }));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      college: '',
      course: '',
      branch: '',
      semester: '',
      subject: '',
      category: '',
      sort: 'newest'
    });
  };

  const formatDate = (date) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const MobileFilterDrawer = () => (
    <AnimatePresence>
      {showMobileFilters && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowMobileFilters(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 overflow-y-auto shadow-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filter Notes</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="space-y-4">
                {['college', 'course', 'branch', 'semester', 'subject', 'category'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field}
                    </label>
                    <select
                      name={field}
                      value={filters[field]}
                      onChange={handleFilterChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All {field}s</option>
                      {uniqueValues[`${field}s`]?.map(value => (
                        <option key={value} value={value}>
                          {field === 'semester' ? `Semester ${value}` : value}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    name="sort"
                    value={filters.sort}
                    onChange={handleFilterChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="size">Largest Files</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-3 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-3"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 rounded-lg mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>Study Notes Library - CU STUDY HUB | Soft Game Studio</title>
        <meta
          name="description"
          content="Browse thousands of free study notes, lecture materials, and exam resources shared by students."
        />
      </Helmet>

      <MobileFilterDrawer />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Study Notes Library
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Access free study materials shared by students from various colleges and courses.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Total Notes</p>
                <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <FaFilePdf className="text-3xl text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Storage Saved</p>
                <p className="text-2xl font-bold text-green-900">{stats.avgCompression}%</p>
              </div>
              <FaCompressArrowsAlt className="text-3xl text-green-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Total Size</p>
                <p className="text-2xl font-bold text-purple-900">{formatFileSize(stats.totalSize)}</p>
              </div>
              <FaLayerGroup className="text-3xl text-purple-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700 font-medium">Colleges</p>
                <p className="text-2xl font-bold text-orange-900">{stats.uniqueColleges}</p>
              </div>
              <FaUniversity className="text-3xl text-orange-500 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 font-medium">Subjects</p>
                <p className="text-2xl font-bold text-red-900">{stats.uniqueSubjects}</p>
              </div>
              <FaBook className="text-3xl text-red-500 opacity-80" />
            </div>
          </div>
        </div>
        <div className="m-4 text-center">
          <div className="flex justify-center lg:justify-between flex-wrap items-center  bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Want to share your notes?</h3>
              <p className="text-gray-600">
                Help other students by uploading your study materials. It's quick and easy!
              </p>
            </div>
            <button
              onClick={() => navigate('/UploadNotes')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Upload Your Notes
              <FaArrowRight />
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by subject, college, course, branch, or student name..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              <FaFilter />
              Filters
            </button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-4">
              <div className="relative">
                <select
                  name="college"
                  value={filters.college}
                  onChange={handleFilterChange}
                  className="appearance-none bg-white pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[180px]"
                >
                  <option value="">College</option>
                  {uniqueValues.colleges.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
                <FaSchool className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  name="course"
                  value={filters.course}
                  onChange={handleFilterChange}
                  className="appearance-none bg-white pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
                >
                  <option value="">Course</option>
                  {uniqueValues.courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                <FaGraduationCap className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  name="semester"
                  value={filters.semester}
                  onChange={handleFilterChange}
                  className="appearance-none bg-white pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[140px]"
                >
                  <option value="">Semester</option>
                  {uniqueValues.semesters.map(sem => (
                    <option key={sem} value={sem}>Sem {sem}</option>
                  ))}
                </select>
                <FaBook className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="appearance-none bg-white pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="name">A-Z</option>
                  <option value="size">Largest</option>
                </select>
                <FaSortAmountDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                  >
                    {filter.key === 'search' ? 'Search: ' : ''}
                    {filter.value}
                    <button
                      onClick={() => removeFilter(filter.key)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 flex justify-between items-center">
            <p className="text-gray-600">
              Showing <span className="font-bold">{filteredNotes.length}</span> of{' '}
              <span className="font-bold">{notes.length}</span> notes
            </p>
            <div className="flex items-center gap-2 text-gray-600">
              <FaSortAmountDown />
              <span className="text-sm">
                Sorted by {filters.sort === 'newest' ? 'Newest' :
                  filters.sort === 'oldest' ? 'Oldest' :
                    filters.sort === 'name' ? 'A-Z' : 'Largest'}
              </span>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaExclamationCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Notes Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {notes.length === 0
                ? "No notes have been uploaded yet. Be the first to share your study materials!"
                : "No notes match your search criteria. Try adjusting your filters."}
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
            {/* CTA */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Want to share your notes?</h3>
                  <p className="text-gray-600">
                    Help other students by uploading your study materials. It's quick and easy!
                  </p>
                </div>
                <button
                  onClick={() => navigate('/UploadNotes')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Upload Your Notes
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="p-6">
                    {/* Note Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {note.subject}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FaCalendarAlt />
                          <span>{formatDate(note.createdAt)}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {note.category}
                      </span>
                    </div>

                    {/* Note Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <FaSchool className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{note.college}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaGraduationCap className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{note.course}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaCodeBranch className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">{note.branch}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaUserGraduate className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700">Semester {note.semester}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaFilePdf className="text-red-400 flex-shrink-0" />
                        <span className="text-gray-700">{formatFileSize(note.compressedSize)}</span>
                        {note.compressionRatio > 0 && (
                          <span className="ml-auto text-sm text-green-600 font-medium">
                            <FaCompressArrowsAlt className="inline mr-1" />
                            Saved {note.compressionRatio}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => navigate(`/DownloadNotes/${note.id}`)}
                        className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        <FaEye />
                        View Notes
                      </button>
                      {note.quizEnabled && (
                        <button
                          onClick={() => navigate(`/NoteQuiz/${note.id}`)}
                          className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          <FaQuestionCircle />
                          Take Quiz
                        </button>
                      )}

                    </div>



                    {/* Uploader Info */}
                    {note.studentName && (
                      <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                        <span className="font-medium">Shared by:</span> {note.studentName}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Want to share your notes?</h3>
                  <p className="text-gray-600">
                    Help other students by uploading your study materials. It's quick and easy!
                  </p>
                </div>
                <button
                  onClick={() => navigate('/UploadNotes')}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                  Upload Your Notes
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}