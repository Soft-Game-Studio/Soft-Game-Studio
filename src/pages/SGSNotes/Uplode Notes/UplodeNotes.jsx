// src/pages/UploadNotes.js

import React, { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { fireDB } from '../../../DataBase/firebaseConfig';
import Layout from '../../../components/layout/Layout';
import { PDFDocument } from 'pdf-lib';
import { FaFilePdf, FaCompressArrowsAlt, FaCloudUploadAlt, FaCheck, FaInfoCircle, FaArrowLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

export default function UploadNotes() {
  const R2_WORKER_URL = import.meta.env.VITE_R2_API;

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    course: '',
    branch: '',
    semester: '',
    subject: '',
    category: 'Basic'
  });

  const [file, setFile] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(null);
  const [fileName, setFileName] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const  navigator = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setMessage({ text: '❌ Only PDF files are allowed', type: 'error' });
      return;
    }

    setOriginalFile(selectedFile);
    setFileName(selectedFile.name);
    setCompressionRatio(null);
    setMessage({ text: '⏳ Compressing PDF...', type: 'info' });

    // Create preview URL
    setPreviewUrl(URL.createObjectURL(selectedFile));

    // Auto-compress the file
    try {
      setCompressionProgress(0);
      setUploading(true);

      // Load the PDF
      setCompressionProgress(20);
      const existingPdfBytes = await selectedFile.arrayBuffer();

      // Create a new PDF document
      setCompressionProgress(40);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Optimize PDF
      setCompressionProgress(60);
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        compress: true,
        removeUnusedObjects: true,
        objectStreams: true,
      });

      setCompressionProgress(80);

      // Calculate compression ratio
      const originalSize = selectedFile.size;
      const compressedSize = compressedPdfBytes.byteLength;
      const ratio = Math.round((1 - (compressedSize / originalSize)) * 100);

      // Create new blob
      const compressedBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      const compressedFile = new File([compressedBlob], selectedFile.name, {
        type: 'application/pdf',
        lastModified: Date.now()
      });

      setFile(compressedFile);
      setCompressionRatio(ratio);
      setMessage({
        text: `✅ PDF compressed! Size reduced by ${ratio}%`,
        type: 'success'
      });

      setCompressionProgress(100);

      // Reset progress after a delay
      setTimeout(() => setCompressionProgress(0), 2000);
    } catch (err) {
      console.error('Compression error:', err);
      setFile(selectedFile);
      setMessage({
        text: '❌ Compression failed. Using original file.',
        type: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Validate required fields
    const requiredFields = ['name', 'college', 'course', 'branch', 'semester', 'subject'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0 || !file) {
      setMessage({ 
        text: `⚠️ Please fill all required fields${!file ? ' and select a PDF file' : ''}`, 
        type: 'warning' 
      });
      return;
    }

    setUploading(true);
    setMessage({ text: '📤 Uploading your notes...', type: 'info' });

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = fileName.split('.').pop();
      const sanitizedSubject = formData.subject.replace(/[^a-zA-Z0-9]/g, '-');
      const sanitizedStudentName = formData.name.replace(/[^a-zA-Z0-9]/g, '-');
      const finalFileName = `${sanitizedSubject}-${formData.semester}-${sanitizedStudentName}-${timestamp}.${fileExtension}`;

      // ✅ Upload to Cloudflare R2
      const uploadUrl = `${R2_WORKER_URL}/${finalFileName}`;

      const res = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": "application/pdf"
        }
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      // Worker returns UNIQUE file name
      const uniqueFileName = await res.text();

      // Public URL
      const fileUrl = `${R2_WORKER_URL}/${uniqueFileName}`;

      // ✅ Save metadata in Firestore
      await addDoc(collection(fireDB, 'notes'), {
        studentName: formData.name.trim(),
        college: formData.college.trim(),
        course: formData.course.trim(),
        branch: formData.branch.trim(),
        semester: formData.semester.trim(),
        subject: formData.subject.trim(),
        category: formData.category,
        fileUrl,
        fileName: uniqueFileName,
        published: true, // Auto-publish for now, you can change to false if you want admin approval
        createdAt: serverTimestamp(),
        originalSize: originalFile?.size || 0,
        compressedSize: file.size,
        compressionRatio: compressionRatio || 0
      });

      setMessage({ 
        text: '🎉 Notes uploaded successfully! Your notes are now available to all students.', 
        type: 'success' 
      });

      // Reset form
      setFormData({
        name: '',
        college: '',
        course: '',
        branch: '',
        semester: '',
        subject: '',
        category: 'Basic'
      });
      setFile(null);
      setOriginalFile(null);
      setFileName('');
      setCompressionRatio(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear success message after delay
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);

    } catch (err) {
      console.error('Upload error:', err);
      setMessage({ 
        text: '❌ Failed to upload notes. Please try again.', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Common input fields to reduce repetition
  const renderInputField = (field, label, placeholder) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}*
      </label>
      <input
        type="text"
        name={field}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        value={formData[field]}
        onChange={handleChange}
        required
      />
    </div>
  );

  return (
    <Layout>
      <Helmet>
        <title>Upload Notes - CU STUDY HUB | Soft Game Studio</title>
        <meta
          name="title"
          content="Upload Notes - CU STUDY HUB | Soft Game Studio"
        />
        <meta
          name="description"
          content="Free Notes share and Access a curated collection of study notes, lecture materials, and exam resources"
        />
        <meta
          property="og:title"
          content="Upload Notes - CU STUDY HUB | Soft Game Studio"
        />
        <meta
          property="og:description"
          content="Free Notes share and Access a curated collection of study notes, lecture materials, and exam resources"
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/sgs-notes.firebasestorage.app/o/Assets%2Fing.png?alt=media"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Upload Notes - CU STUDY HUB | Soft Game Studio"
        />
        <meta property="og:locale" content="en_US" />
      </Helmet>
     

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
           <button
                onClick={() => navigator('/DownloadNotes')}
                className="mb-6 flex items-center gap-2 dark:text-gray-200 dark:hover:text-gray-400 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft /> Back to Notes
              </button>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-3 flex items-center justify-center">
              <FaFilePdf className="mr-3 text-red-600" />
              Smart PDF Uploader
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share your study materials with other students. All data is saved directly with your notes.
            </p>
          </div>

          {/* Status Message */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg text-center ${
              message.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
              message.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
              message.type === 'info' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
              'bg-green-100 text-green-800 border border-green-200'
            }`}>
              <div className="font-medium flex items-center justify-center">
                {message.text}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Upload Your Notes
              </h2>
              
              <form onSubmit={handleUpload} className="space-y-5">
                {/* Student Name */}
                {renderInputField('name', 'Your Name', 'John Doe')}

                {/* College/University */}
                {renderInputField('college', 'College/University Name', 'Chandigarh University')}

                {/* Course */}
                {renderInputField('course', 'Course', 'BCA, B.Tech, MBA, etc.')}

                {/* Branch */}
                {renderInputField('branch', 'Branch', 'Computer Science, Mechanical, Civil, etc.')}

                {/* Semester */}
                {renderInputField('semester', 'Semester', '1, 2, 3, 4, etc.')}

                {/* Subject */}
                {renderInputField('subject', 'Subject', 'Mathematics, Physics, Programming, etc.')}

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Simple">Simple</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Reference">Reference Material</option>
                    <option value="Notes">Class Notes</option>
                    <option value="PYQ">Previous Year Questions</option>
                    <option value="Lab">Lab Manual</option>
                  </select>
                </div>
                
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload PDF*
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                      file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                    }`}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                    {file ? (
                      <div className="flex flex-col items-center">
                        <FaFilePdf className="text-5xl text-red-500 mb-3" />
                        <p className="font-medium text-gray-800 truncate max-w-xs">{fileName}</p>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1">
                            {formatFileSize(originalFile?.size || 0)}
                            {compressionRatio !== null && (
                              <span className="text-green-600 ml-2">
                                → {formatFileSize(file.size)} (Saved {compressionRatio}%)
                              </span>
                            )}
                          </span>
                        </div>
                        {compressionProgress > 0 && (
                          <div className="w-full max-w-xs mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                style={{ width: `${compressionProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Compressing... {compressionProgress}%
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-4">
                        <FaCloudUploadAlt className="text-5xl text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Click to select a PDF file</p>
                        <p className="text-sm text-gray-500 mt-2">Files will be compressed automatically</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={!file || uploading}
                  className={`w-full py-4 px-6 rounded-xl font-medium flex items-center justify-center transition-all ${
                    uploading ? 'bg-blue-400 cursor-not-allowed' : 
                    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg'
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaCloudUploadAlt className="mr-3 text-lg" />
                      Upload Notes
                    </span>
                  )}
                </button>
              </form>
            </div>
            
            {/* Preview & Info Section */}
            <div className="space-y-8">
              {/* Preview Card */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  PDF Preview
                </h2>
                
                {previewUrl ? (
                  <div className="relative">
                    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                      <iframe 
                        src={previewUrl} 
                        title="PDF Preview" 
                        className="w-full h-96"
                        frameBorder="0"
                      ></iframe>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="flex items-center">
                        <FaInfoCircle className="mr-2 text-blue-500" />
                        Note: This preview shows the original PDF. The compressed version maintains the same visual quality.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8">
                      <FaFilePdf className="text-6xl text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No PDF Selected</h3>
                      <p className="text-gray-500">Upload a PDF to see a preview</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* How It Works */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                  How It Works
                </h2>
                
                <div className="space-y-5">
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Fill Details</h3>
                      <p className="text-gray-600">Enter your name, college, course, and other details. All data is saved with your notes.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Upload PDF</h3>
                      <p className="text-gray-600">Select your PDF file. Our system will automatically compress it without quality loss.</p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="flex-shrink-0 mr-4 mt-1">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">3</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Share & Help</h3>
                      <p className="text-gray-600">Your notes will be available to thousands of students who need them.</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-2 flex items-center">
                      <FaCompressArrowsAlt className="mr-2" />
                      Benefits for Students
                    </h3>
                    <ul className="text-blue-700 space-y-2">
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Help other students from your college/course</span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Organized notes by college, course, and semester</span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Fast PDF compression for quicker downloads</span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span>Easy search and filtering for students</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Note about data storage */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>📝 All data (college, course, branch, semester, subject) is stored directly with your notes and will be visible to other students.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}