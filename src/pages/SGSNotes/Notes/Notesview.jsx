import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { fireDB } from '../../../DataBase/firebaseConfig';
import Layout from '../../../components/layout/Layout';
import { 
  FaFilePdf, 
  FaDownload, 
  FaCalendarAlt, 
  FaUniversity,
  FaGraduationCap,
  FaCodeBranch,
  FaBook,
  FaUserGraduate,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaCompressArrowsAlt,
  FaFileAlt,
  FaShareAlt,
  FaPrint
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import jsPDF from 'jspdf';

export default function NoteView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoadError, setPdfLoadError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const snap = await getDoc(doc(fireDB, 'notes', id));
        if (snap.exists()) {
          const noteData = snap.data();
          setNote({
            id: snap.id,
            ...noteData,
            createdAt: noteData.createdAt?.toDate() || new Date(),
          });
        } else {
          setNote(null);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    if (bytes < 1024) return bytes + ' Bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareText = `Check out these study notes for ${note.subject} - ${note.course} ${note.branch}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${note.subject} Notes - CU STUDY HUB`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Sharing cancelled or failed');
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        alert('Link copied to clipboard!');
      } catch (err) {
        // Fallback fallback: Show URL
        prompt('Copy this link:', shareUrl);
      }
    }
  };

  const handlePrint = () => {
    window.open(note.fileUrl, '_blank');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = note.fileUrl;
    link.download = `${note.subject}_${note.semester}_${note.course}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-[600px] bg-gray-200 rounded-xl"></div>
              </div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!note) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <div className="text-6xl mb-6 text-gray-300">📄</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Note Not Found</h2>
            <p className="text-gray-600 mb-6">
              The note you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/notes')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <FaArrowLeft /> Browse All Notes
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentUrl = window.location.href;

  return (
    <Layout>
      <Helmet>
        <title>{note.subject} Notes - CU STUDY HUB | Soft Game Studio</title>
        <meta
          name="title"
          content={`${note.subject} Notes - CU STUDY HUB`}
        />
        <meta
          name="description"
          content={`Study notes for ${note.subject} - ${note.course} ${note.branch}, Semester ${note.semester}. Shared by ${note.studentName} from ${note.college}.`}
        />
        <meta
          property="og:title"
          content={`${note.subject} Notes - CU STUDY HUB`}
        />
        <meta
          property="og:description"
          content={`Study notes for ${note.subject} - ${note.course} ${note.branch}`}
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/sgs-notes.firebasestorage.app/o/Assets%2Fing.png?alt=media"
        />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/notes')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft /> Back to Notes
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - PDF Viewer */}
          <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white p-4' : 'lg:col-span-2'}`}>
            {isFullscreen && (
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{note.subject}</h3>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  Exit Fullscreen
                </button>
              </div>
            )}
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaFilePdf className="text-red-500" />
                  <span className="font-medium">{note.fileName || `${note.subject}.pdf`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Fullscreen"
                  >
                    <FaExternalLinkAlt />
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Print"
                  >
                    <FaPrint />
                  </button>
                </div>
              </div>
              
              <div className={`${isFullscreen ? 'h-[calc(100vh-120px)]' : 'h-[600px]'} relative`}>
                {pdfLoadError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="text-center p-8">
                      <FaFilePdf className="text-6xl text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Unable to load PDF preview</p>
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Open PDF in new tab
                      </a>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={note.fileUrl}
                    title="PDF Viewer"
                    className="w-full h-full"
                    onError={() => setPdfLoadError(true)}
                    onLoad={() => setPdfLoadError(false)}
                  />
                )}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 border-t flex justify-between items-center text-sm text-gray-600">
                <div>
                  <span className="font-medium">Size:</span> {formatFileSize(note.originalSize || 0)}
                  {note.compressionRatio > 0 && (
                    <span className="ml-3 text-green-600">
                      <FaCompressArrowsAlt className="inline mr-1" />
                      Compressed by {note.compressionRatio}%
                    </span>
                  )}
                </div>
                <div>
                  <span className="font-medium">Pages:</span> Auto-detected
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Note Details */}
          <div className="space-y-6">
            {/* Note Header */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FaFilePdf className="text-red-500 flex-shrink-0" />
                    {note.subject}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaCalendarAlt />
                    <span>Uploaded {formatDate(note.createdAt)}</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {note.category || 'General'}
                </span>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FaUserGraduate className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Student</p>
                    <p className="font-medium truncate">{note.studentName || 'Anonymous'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FaUniversity className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">College</p>
                    <p className="font-medium truncate">{note.college || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FaGraduationCap className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Course</p>
                    <p className="font-medium truncate">{note.course || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <FaCodeBranch className="text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Branch</p>
                    <p className="font-medium truncate">{note.branch || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Semester</span>
                  <span className="font-semibold">Semester {note.semester || 'N/A'}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">File Size</span>
                  <span className="font-semibold">{formatFileSize(note.originalSize || 0)}</span>
                </div>
                
                {note.compressionRatio > 0 && (
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Compression</span>
                    <span className="font-semibold text-green-600">
                      Saved {note.compressionRatio}%
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Upload Date</span>
                  <span className="font-semibold">{formatDate(note.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <FaDownload />
                  Download PDF ({formatFileSize(note.originalSize || 0)})
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <FaShareAlt />
                  Share with Others
                </button>
                
                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <FaPrint />
                  Print / Open in New Tab
                </button>
                
                <a
                  href={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(note.fileUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center text-blue-600 hover:text-blue-800 py-2"
                >
                  View in Google Docs Viewer
                </a>
              </div>
            </div>

            {/* Sharing Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                <FaShareAlt />
                Sharing Information
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                This note has been shared by a student to help others. Please use responsibly.
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <p>📚 Educational purpose only</p>
                <p>👥 Credits to original author</p>
                <p>⚠️ Verify content before use</p>
              </div>
            </div>

            {/* Report Issue */}
            <div className="text-center">
              <button
                onClick={() => navigate('/contact')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Report issue with this note
              </button>
            </div>
          </div>
        </motion.div>

        {/* Related Notes Suggestion */}
        {!isFullscreen && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">More Notes You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigate(`/DownloadNotes?semester=${note.semester}`)}
                className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow text-left"
              >
                <h4 className="font-semibold mb-2">Same Semester Notes</h4>
                <p className="text-sm text-gray-600">
                  Browse all Semester {note.semester} notes
                </p>
              </button>
              
              <button
                onClick={() => navigate(`/DownloadNotes?subject=${note.subject}`)}
                className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow text-left"
              >
                <h4 className="font-semibold mb-2">Same Subject Notes</h4>
                <p className="text-sm text-gray-600">
                  More {note.subject} notes from other students
                </p>
              </button>
              
              <button
                onClick={() => navigate('/UplodesNotes')}
                className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors text-left"
              >
                <h4 className="font-semibold mb-2 text-blue-800">Share Your Notes</h4>
                <p className="text-sm text-blue-600">
                  Help others by uploading your study materials
                </p>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50"></div>
      )}
    </Layout>
  );
}