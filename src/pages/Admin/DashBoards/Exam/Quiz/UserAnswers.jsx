import React, { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc,
  deleteDoc,
  query,
  where,
  writeBatch
} from "firebase/firestore";
import { FaEdit, FaTrash, FaTrophy, FaLanguage, FaDownload, FaCertificate } from "react-icons/fa";
import { toast } from "react-toastify";
import Layout from "../../../../../components/layout/Layout";
import { fireDB } from "../../../../../DataBase/firebaseConfig";
import Certificate from "../../../../../components/Certificate/Certificate";

const UserAnswers = () => {
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [results, setResults] = useState([]);
  const [showResultForm, setShowResultForm] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [deletingLanguage, setDeletingLanguage] = useState(false);
  const [newResult, setNewResult] = useState({
    examName: "",
    language: "",
    winners: [],
    display: false
  });

  // Fetch user answers
  const fetchUserAnswers = async () => {
    try {
      const snapshot = await getDocs(collection(fireDB, "user_Quiz_Answers"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserAnswers(data.filter(user => !user.disqualified));
    } catch (error) {
      console.error("Error fetching user answers:", error);
      toast.error("Failed to fetch user answers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing results
  const fetchResults = async () => {
    try {
      const snapshot = await getDocs(collection(fireDB, "results"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to fetch results");
    }
  };

  useEffect(() => {
    fetchUserAnswers();
    fetchResults();
  }, []);

  // Get top scorers with tie handling
  const getTopScorers = (language, count = 5) => {
    // Filter by language and valid users
    const languageUsers = userAnswers.filter(
      user => user.language === language && !user.disqualified
    );
    
    // Sort by score descending
    const sortedUsers = [...languageUsers].sort((a, b) => 
      (b.score || 0) - (a.score || 0)
    );
    
    // Handle ties
    if (sortedUsers.length <= count) return sortedUsers;
    
    const minScore = sortedUsers[count - 1].score;
    return sortedUsers.filter(user => user.score >= minScore);
  };

  // Auto-populate winners when language changes
  useEffect(() => {
    if (newResult.language && !editingResult) {
      const topScorers = getTopScorers(newResult.language);
      setNewResult(prev => ({
        ...prev,
        winners: topScorers.map(user => user.id)
      }));
    }
  }, [newResult.language, userAnswers]);

  // Handle result creation
  const handleCreateResult = async () => {
    try {
      // Get winner details
      const winnerDetails = newResult.winners.map(winnerId => {
        const user = userAnswers.find(ua => ua.id === winnerId);
        return {
          id: user.id,
          name: user.name,
          rollNumber: user.rollNumber,
          score: user.score,
          certificateNo: user.certificateNo,
          date: user.date
        };
      });

      const resultData = {
        ...newResult,
        winners: winnerDetails,
        createdAt: new Date()
      };

      await addDoc(collection(fireDB, "results"), resultData);
      fetchResults();
      setShowResultForm(false);
      setNewResult({
        examName: "",
        language: "",
        winners: [],
        display: false
      });
      toast.success("Result created successfully");
    } catch (error) {
      console.error("Error creating result:", error);
      toast.error("Failed to create result");
    }
  };

  // Handle result update
  const handleUpdateResult = async () => {
    try {
      await updateDoc(doc(fireDB, "results", editingResult.id), {
        examName: newResult.examName,
        display: newResult.display
      });
      fetchResults();
      setShowResultForm(false);
      setEditingResult(null);
      setNewResult({
        examName: "",
        language: "",
        winners: [],
        display: false
      });
      toast.success("Result updated successfully");
    } catch (error) {
      console.error("Error updating result:", error);
      toast.error("Failed to update result");
    }
  };

  // Delete result
  const handleDeleteResult = async (resultId) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      try {
        await deleteDoc(doc(fireDB, "results", resultId));
        fetchResults();
        toast.success("Result deleted successfully");
      } catch (error) {
        console.error("Error deleting result:", error);
        toast.error("Failed to delete result");
      }
    }
  };

  // Toggle result display
  const toggleResultDisplay = async (resultId, currentDisplay) => {
    try {
      await updateDoc(doc(fireDB, "results", resultId), {
        display: !currentDisplay
      });
      fetchResults();
      toast.success(`Result ${!currentDisplay ? "published" : "hidden"} successfully`);
    } catch (error) {
      console.error("Error updating display status:", error);
      toast.error("Failed to update result status");
    }
  };

  // Start editing a result
  const startEditing = (result) => {
    setEditingResult(result);
    setNewResult({
      examName: result.examName,
      language: result.language,
      winners: result.winners.map(w => w.id),
      display: result.display
    });
    setShowResultForm(true);
  };

  // Get unique languages
  const getUniqueLanguages = () => {
    const languages = [...new Set(userAnswers.map(ua => ua.language))];
    return ["all", ...languages].filter(lang => lang);
  };

  // Filter data by language
  const filteredUserAnswers = selectedLanguage === "all" 
    ? userAnswers 
    : userAnswers.filter(ua => ua.language === selectedLanguage);

  const filteredResults = selectedLanguage === "all" 
    ? results 
    : results.filter(r => r.language === selectedLanguage);

  // Delete all data for a specific language
  const handleDeleteLanguageData = async () => {
    if (selectedLanguage === "all") {
      toast.error("Please select a specific language to delete data");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ALL data for ${selectedLanguage}? This action cannot be undone!`)) {
      return;
    }

    setDeletingLanguage(true);
    try {
      // Create a batch for batch operations
      const batch = writeBatch(fireDB);
      
      // Delete user answers for the selected language
      const userAnswersQuery = query(
        collection(fireDB, "user_Quiz_Answers"), 
        where("language", "==", selectedLanguage)
      );
      const userAnswersSnapshot = await getDocs(userAnswersQuery);
      userAnswersSnapshot.forEach((document) => {
        batch.delete(doc(fireDB, "user_Quiz_Answers", document.id));
      });
      
      // Delete results for the selected language
      const resultsQuery = query(
        collection(fireDB, "results"), 
        where("language", "==", selectedLanguage)
      );
      const resultsSnapshot = await getDocs(resultsQuery);
      resultsSnapshot.forEach((document) => {
        batch.delete(doc(fireDB, "results", document.id));
      });
      
      // Commit the batch
      await batch.commit();
      
      // Update local state
      setUserAnswers(prev => prev.filter(ua => ua.language !== selectedLanguage));
      setResults(prev => prev.filter(r => r.language !== selectedLanguage));
      
      toast.success(`All data for ${selectedLanguage} has been deleted successfully`);
    } catch (error) {
      console.error("Error deleting language data:", error);
      toast.error("Failed to delete language data");
    } finally {
      setDeletingLanguage(false);
    }
  };

const [open, setOpen] = useState(false);
const [selectedUserForCertificate, setSelectedUserForCertificate] = useState(null);

  // Generate certificate for a user
const generateCertificate = (user) => {
  setSelectedUserForCertificate(user);
  if (open === true) {
    setOpen(false);
  }
  else {
    setOpen(true);
  }
};

  // Export data to CSV
  const exportToCSV = () => {
    const headers = ["Rank", "Name", "Roll Number", "Language", "Score", "Exam Name", "Certificate No", "Date"];
    
    const csvData = filteredUserAnswers
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .map((user, index) => {
        // Calculate rank with tie handling
        const sameScoreUsers = filteredUserAnswers.filter(u => u.score === user.score);
        const minRank = sameScoreUsers.reduce((min, u) => {
          const userIndex = filteredUserAnswers.findIndex(ua => ua.id === u.id);
          return userIndex < min ? userIndex : min;
        }, index) + 1;
        
        return [
          minRank + (sameScoreUsers.length > 1 ? " (tied)" : ""),
          user.name,
          user.rollNumber,
          user.language,
          user.score || 0,
          user.examName || "N/A",
          user.certificateNo || "N/A",
          user.date || "N/A"
        ];
      });

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quiz-results-${selectedLanguage}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("Data exported to CSV successfully");
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-purple-100 dark:bg-neutral-950 min-h-screen p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-purple-100 dark:bg-neutral-950 min-h-screen p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header and Filter */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                Competition Results Management
              </h1>
              <p className="text-purple-600 dark:text-purple-300">
                Automatically generate and manage competition results
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white dark:bg-neutral-800 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-neutral-600"
              >
                <option value="all">All Languages</option>
                {getUniqueLanguages()
                  .filter(lang => lang !== "all")
                  .map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
              </select>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteLanguageData}
                  disabled={selectedLanguage === "all" || deletingLanguage}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    selectedLanguage === "all" || deletingLanguage
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-white`}
                >
                  <FaLanguage /> 
                  {deletingLanguage ? "Deleting..." : `Delete ${selectedLanguage} Data`}
                </button>
                
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <FaDownload /> Export CSV
                </button>
                
                <button
                  onClick={() => {
                    setShowResultForm(true);
                    setEditingResult(null);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <FaTrophy /> Create Result
                </button>
              </div>
            </div>
          </div>

          {/* Result Creation/Edit Form */}
          {showResultForm && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 mb-6 transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200">
                  {editingResult ? "Edit Result" : "Create New Result"}
                </h3>
                <button 
                  onClick={() => {
                    setShowResultForm(false);
                    setEditingResult(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-purple-700 dark:text-purple-300 mb-1">
                    Exam Name *
                  </label>
                  <input
                    type="text"
                    value={newResult.examName}
                    onChange={(e) => setNewResult({ ...newResult, examName: e.target.value })}
                    placeholder="Enter exam name"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-neutral-600"
                  />
                </div>
                
                <div>
                  <label className="block text-purple-700 dark:text-purple-300 mb-1">
                    Language *
                  </label>
                  <select
                    value={newResult.language}
                    onChange={(e) => setNewResult({ ...newResult, language: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-neutral-700 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-neutral-600"
                    disabled={editingResult}
                  >
                    <option value="">Select Language</option>
                    {getUniqueLanguages()
                      .filter(lang => lang !== "all")
                      .map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              
              {!editingResult && (
                <>
                  <div className="mb-4">
                    <label className="block text-purple-700 dark:text-purple-300 mb-2">
                      Top Scorers (Automatically Selected)
                    </label>
                    <div className="bg-purple-50 dark:bg-neutral-700 rounded-lg p-4">
                      <div className="grid grid-cols-1 gap-3">
                        {newResult.winners.map((winnerId, index) => {
                          const winner = userAnswers.find(ua => ua.id === winnerId);
                          if (!winner) return null;
                          
                          return (
                            <div 
                              key={winnerId}
                              className="flex justify-between items-center p-3 bg-white dark:bg-neutral-800 rounded-lg border border-purple-200 dark:border-neutral-600"
                            >
                              <div>
                                <div className="font-medium text-purple-800 dark:text-purple-200">
                                  {index + 1}. {winner.name} ({winner.rollNumber})
                                </div>
                                <div className="text-sm text-purple-600 dark:text-purple-300">
                                  Score: {winner.score || 0} | Cert: {winner.certificateNo || "N/A"}
                                </div>
                              </div>
                              <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                                Rank {index + 1}
                              </span>
                            </div>
                          );
                        })}
                        
                        {newResult.winners.length === 0 && (
                          <div className="text-center py-4 text-purple-700 dark:text-purple-300">
                            Select a language to see top scorers
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-purple-700 dark:text-purple-300 mb-2">
                      Note:
                    </label>
                    <p className="text-sm text-purple-600 dark:text-purple-300 bg-yellow-50 dark:bg-neutral-900 p-3 rounded-lg">
                      Winners are automatically selected based on highest scores. 
                      Tied scores are included in the results. You can only change 
                      the exam name and visibility after creation.
                    </p>
                  </div>
                </>
              )}
              
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="displayResult"
                  checked={newResult.display}
                  onChange={(e) => setNewResult({ ...newResult, display: e.target.checked })}
                  className="mr-2 h-5 w-5 text-purple-600 rounded"
                />
                <label htmlFor="displayResult" className="text-purple-700 dark:text-purple-300">
                  Display this result to users
                </label>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowResultForm(false);
                    setEditingResult(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingResult ? handleUpdateResult : handleCreateResult}
                  disabled={!newResult.examName || !newResult.language || newResult.winners.length === 0}
                  className={`px-4 py-2 rounded-lg ${
                    !newResult.examName || !newResult.language || newResult.winners.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  } text-white transition-all`}
                >
                  {editingResult ? "Update Result" : "Create Result"}
                </button>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden transition-colors duration-300 mb-6">
            <div className="p-6 border-b border-purple-200 dark:border-neutral-700">
              <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-100">
                Published Results
              </h2>
              <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                Manage visibility of competition results
              </p>
            </div>

            {filteredResults.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-purple-800 dark:text-purple-200">
                  No results found for selected language
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-200 dark:divide-neutral-700">
                  <thead className="bg-purple-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Exam Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Winners
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-900 divide-y divide-purple-100 dark:divide-neutral-700">
                    {filteredResults.map((result) => (
                      <tr key={result.id} className="hover:bg-purple-50 dark:hover:bg-neutral-800 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200 font-medium">
                          {result.examName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                          {result.language}
                        </td>
                        <td className="px-6 py-4 text-sm text-purple-800 dark:text-purple-200">
                          <ul className="list-disc pl-5">
                            {result.winners.slice(0, 3).map((winner, index) => (
                              <li key={winner.id}>
                                {index + 1}. {winner.name} ({winner.rollNumber}) - {winner.score}
                                {winner.certificateNo && ` - Cert: ${winner.certificateNo}`}
                              </li>
                            ))}
                            {result.winners.length > 3 && (
                              <li className="text-purple-600 dark:text-purple-300">
                                +{result.winners.length - 3} more winners
                              </li>
                            )}
                          </ul>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            result.display 
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          }`}>
                            {result.display ? "Published" : "Hidden"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleResultDisplay(result.id, result.display)}
                              className={`p-2 rounded ${
                                result.display
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-green-500 hover:bg-green-600"
                              } text-white`}
                              title={result.display ? "Hide from users" : "Publish to users"}
                            >
                              {result.display ? "Hide" : "Publish"}
                            </button>
                            <button
                              onClick={() => startEditing(result)}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteResult(result.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* User Submissions Section */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg overflow-hidden transition-colors duration-300">
            <div className="p-6 border-b border-purple-200 dark:border-neutral-700">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-100">
                    User Submissions
                  </h2>
                  <p className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                    {filteredUserAnswers.length} valid submissions found
                  </p>
                </div>
                <button
                  onClick={exportToCSV}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all flex items-center gap-2"
                >
                  <FaDownload /> Export CSV
                </button>
              </div>
            </div>

            {filteredUserAnswers.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-purple-800 dark:text-purple-200">
                  No submissions found for selected language
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-purple-200 dark:divide-neutral-700">
                  <thead className="bg-purple-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Exam Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Certificate No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-900 divide-y divide-purple-100 dark:divide-neutral-700">
                    {filteredUserAnswers
                      .sort((a, b) => (b.score || 0) - (a.score || 0))
                      .map((ua, index) => {
                        // Get all users with same score
                        const sameScoreUsers = filteredUserAnswers.filter(
                          user => user.score === ua.score
                        );
                        
                        // Get min rank for this score group
                        const minRank = sameScoreUsers.reduce((min, user) => {
                          const userIndex = filteredUserAnswers.findIndex(u => u.id === user.id);
                          return userIndex < min ? userIndex : min;
                        }, index) + 1;
                        
                        return (
                        
                          <tr key={ua.id}  className="hover:bg-purple-50 dark:hover:bg-neutral-800 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900 dark:text-purple-100">
                              {minRank}
                              {sameScoreUsers.length > 1 && (
                                <span className="text-xs text-purple-500 ml-1">
                                  (tied)
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                              {ua.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                              {ua.rollNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                              {ua.language}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200 font-bold">
                              {ua.score || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                              {ua.examName || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200 font-mono">
                              {ua.certificateNo || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-800 dark:text-purple-200">
                              {ua.date || "N/A"}
                            </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm">
  <button
    onClick={() => generateCertificate(ua)}
    className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
    title="Generate Certificate"
  >
    <FaCertificate />
  </button>
</td>
                          </tr>
                          
                        
                          
                        );
                      })}
                  </tbody>
                </table>
                {open && selectedUserForCertificate && (
  <Certificate
    name={selectedUserForCertificate.name}
    rollNumber={selectedUserForCertificate.rollNumber}
    examName={selectedUserForCertificate.examName || "N/A"}
    date={selectedUserForCertificate.date || "N/A"}
    certificateNo={selectedUserForCertificate.certificateNo || "N/A"}
    language={selectedUserForCertificate.language}
    score={selectedUserForCertificate.score}
    Que={selectedUserForCertificate.NoQuestion}
    onClose={() => setOpen(false)}
  />
)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserAnswers;