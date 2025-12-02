import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaDownload, FaSearch, FaArrowLeft, FaUser, FaAward, FaCalendar, FaLanguage } from "react-icons/fa";
import { toast } from "react-toastify";
import { fireDB } from "../../DataBase/firebaseConfig";
import Certificate from "../../components/Certificate/Certificate";
import Layout from "../../components/layout/Layout";
// import "./CertificatePage.css"; // Optional CSS file for styling

const CertificatePage = () => {
  const { rollNumber } = useParams();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchRollNumber, setSearchRollNumber] = useState(rollNumber || "");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Fetch certificates by roll number
  const fetchCertificates = async (rollNum) => {
    if (!rollNum) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(fireDB, "user_Quiz_Answers"), 
        where("rollNumber", "==", rollNum.trim())
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));

      // Filter out disqualified users
      const validCertificates = data.filter(user => !user.disqualified);
      
      setCertificates(validCertificates);
      
      if (validCertificates.length > 0) {
        setUserInfo({
          name: validCertificates[0].name,
          rollNumber: validCertificates[0].rollNumber
        });
        toast.success(`Found ${validCertificates.length} certificate(s)`);
      } else {
        setUserInfo(null);
        toast.error("No certificates found for this roll number");
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
      toast.error("Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  // Handle URL parameter
  useEffect(() => {
    if (rollNumber) {
      setSearchRollNumber(rollNumber);
      fetchCertificates(rollNumber);
    }
  }, [rollNumber]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchRollNumber.trim()) {
      toast.error("Please enter a roll number");
      return;
    }
    
    // Update URL without page reload
    navigate(`/SGSCERT/${searchRollNumber.trim()}`, { replace: true });
    fetchCertificates(searchRollNumber);
  };

  // Generate certificate preview
  const handleGenerateCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setShowCertificateModal(true);
  };

  // Close certificate modal
  const handleCloseModal = () => {
    setShowCertificateModal(false);
    setSelectedCertificate(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB');
    } catch {
      return dateString;
    }
  };

  return (
    <Layout>
  <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-700">

  {/* HEADER */}
  <div className="bg-white/10 backdrop-blur-md py-8 border-b border-white/20">
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold">Soft Game Studio Certificates</h1>
        <p className="text-lg opacity-90">Download your competition certificates</p>
      </div>
    </div>
  </div>

  {/* SEARCH SECTION */}
  <div className="py-16">
    <div className="max-w-4xl mx-auto px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 text-center">

        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Find Your Certificates</h2>

        <p className="text-gray-600 mb-6">
          Enter your roll number to find and download all your certificates
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">

            <div className="relative flex-1">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchRollNumber}
                onChange={(e) => setSearchRollNumber(e.target.value)}
                placeholder="Enter your roll number (e.g., 250001)"
                className="w-full border-2 border-gray-300 rounded-xl pl-12 py-3 text-lg focus:border-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl text-lg flex items-center justify-center gap-2 hover:-translate-y-1 transition"
            >
              <FaSearch /> Search Certificates
            </button>

          </div>
        </form>

        {userInfo && (
          <div className="bg-gray-100 p-6 rounded-xl text-left mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Roll Number:</strong> {userInfo.rollNumber}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  </div>

  {/* CERTIFICATES SECTION */}
  <div className="py-12">
    <div className="max-w-6xl mx-auto px-4">

      {loading ? (
        <div className="text-center text-white p-8">
          <div className="w-10 h-10 rounded-full border-4 border-white/30 border-t-white animate-spin mx-auto mb-4" />
          <p>Searching for certificates...</p>
        </div>
      ) : certificates.length > 0 ? (
        
        <div>
          <div className="text-center text-white mb-8">
            <h2 className="text-3xl font-bold">Your Certificates ({certificates.length})</h2>
            <p className="opacity-90">Click on any certificate to preview and download</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-2xl p-6 shadow-xl hover:-translate-y-1 hover:shadow-2xl transition">

                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-14 h-14 rounded-xl flex items-center justify-center text-xl">
                    <FaAward />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {cert.examName || "Quiz Competition"}
                    </h3>
                    <div className="text-sm text-gray-600">
                      #{cert.certificateNo || "N/A"}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-gray-700">

                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-indigo-500" />
                    <span>Date: {formatDate(cert.date)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaLanguage className="text-indigo-500" />
                    <span>Language: {cert.language}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <FaAward className="text-indigo-500" />
                    <span>
                      Score: {cert.score || 0}/{cert.NoQuestion || "N/A"} (
                      {cert.NoQuestion ? ((cert.score / cert.NoQuestion) * 100).toFixed(1) : "0"}%)
                    </span>
                  </div>

                </div>

                <button
                  onClick={() => handleGenerateCertificate(cert)}
                  className="w-full mt-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-3 rounded-xl text-lg flex items-center justify-center gap-2 hover:-translate-y-1 transition"
                >
                  <FaDownload /> View & Download
                </button>

              </div>
            ))}
          </div>

        </div>

      ) : searchRollNumber ? (
        
        <div className="text-center text-white p-10 bg-white/10 rounded-2xl backdrop-blur-md">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-2xl font-semibold mb-2">No Certificates Found</h3>
          <p>No certificates found for roll number: <strong>{searchRollNumber}</strong></p>

          <ul className="mt-4 text-left max-w-md mx-auto space-y-2">
            <li>• Check if the roll number is correct</li>
            <li>• Make sure you have participated in competitions</li>
            <li>• Contact support if you believe this is an error</li>
          </ul>
        </div>

      ) : (
        
        <div className="text-center text-white p-10 bg-white/10 rounded-2xl backdrop-blur-md">
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="text-2xl font-semibold mb-2">Enter Your Roll Number</h3>
          <p>Use the search box above to find your certificates</p>
        </div>

      )}

    </div>
  </div>

  {/* CERTIFICATE MODAL */}
  {showCertificateModal && selectedCertificate && (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="bg-white rounded-2xl w-[90vw] max-w-4xl max-h-[90vh] overflow-auto shadow-2xl">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold">Certificate Preview</h3>
          <button onClick={handleCloseModal} className="text-3xl leading-none text-gray-600 hover:text-black">
            ×
          </button>
        </div>

        <div className="p-0">
          <Certificate
            name={selectedCertificate.name}
            rollNumber={selectedCertificate.rollNumber}
            examName={selectedCertificate.examName || "Quiz Competition"}
            date={formatDate(selectedCertificate.date)}
            certificateNo={selectedCertificate.certificateNo}
            language={selectedCertificate.language}
            score={selectedCertificate.score}
            Que={selectedCertificate.NoQuestion}
            onClose={handleCloseModal}
          />
        </div>

      </div>
    </div>
  )}

  

</div>
    </Layout>
 

  );
};

export default CertificatePage;