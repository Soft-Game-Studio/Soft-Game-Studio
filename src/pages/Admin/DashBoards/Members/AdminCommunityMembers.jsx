import React, { useState, useEffect } from 'react';
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp 
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { fireDB, storage } from '../../../../DataBase/firebaseConfig';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../../../../components/layout/Layout';
import { Helmet } from 'react-helmet';
import { 
  FiSearch, FiCheck, FiX, FiUser, 
 FiCheckCircle, FiTrash2, FiEye, 
} from 'react-icons/fi';
import { FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

const AdminCommunityMembers = () => {
  const [applications, setApplications] = useState([]);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [actionLoading, setActionLoading] = useState(null);

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const applicationsQuery = query(
        collection(fireDB, 'communityMembers'),
        where('status', '==', 'pending'),
      );
      const applicationsSnapshot = await getDocs(applicationsQuery);
      const applicationsList = applicationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const membersQuery = query(
        collection(fireDB, 'communityMembers'),
        where('status', '==', 'accepted'),
        
      );
      const membersSnapshot = await getDocs(membersQuery);
      const membersList = membersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setApplications(applicationsList);
      setCommunityMembers(membersList);
    } catch (error) {
      console.error('Error fetching data:', error);
      showMessage('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (application) => {
    try {
      setActionLoading(application.id);
      
      const memberRef = doc(fireDB, 'communityMembers', application.id);
      await updateDoc(memberRef, {
        status: 'accepted',
        acceptedAt: serverTimestamp(),
        role: application.role || 'Community Member'
      });

      setApplications(applications.filter(app => app.id !== application.id));
      const updatedMember = {
        ...application,
        status: 'accepted',
        acceptedAt: new Date(),
        role: application.role || 'Community Member'
      };
      setCommunityMembers([updatedMember, ...communityMembers]);
      
      showMessage('Application accepted successfully!', 'success');
      setDetailModalOpen(false);
    } catch (error) {
      console.error('Error accepting application:', error);
      showMessage('Error accepting application', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (application) => {
    try {
      setActionLoading(application.id);
      
      if (application.photoUrl) {
        try {
          const photoRef = ref(storage, application.photoUrl);
          await deleteObject(photoRef);
        } catch (error) {
          console.error('Error deleting photo:', error);
        }
      }

      await deleteDoc(doc(fireDB, 'communityMembers', application.id));

      setApplications(applications.filter(app => app.id !== application.id));
      showMessage('Application rejected successfully!', 'success');
      setDetailModalOpen(false);
    } catch (error) {
      console.error('Error rejecting application:', error);
      showMessage('Error rejecting application', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveMember = async (member) => {
    if (!window.confirm(`Are you sure you want to remove ${member.name} from community members?`)) {
      return;
    }

    try {
      setActionLoading(member.id);
      
      if (member.photoUrl) {
        try {
          const photoRef = ref(storage, member.photoUrl);
          await deleteObject(photoRef);
        } catch (error) {
          console.error('Error deleting photo:', error);
        }
      }

      await deleteDoc(doc(fireDB, 'communityMembers', member.id));

      setCommunityMembers(communityMembers.filter(m => m.id !== member.id));
      showMessage('Member removed successfully!', 'success');
    } catch (error) {
      console.error('Error removing member:', error);
      showMessage('Error removing member', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const SocialIcon = ({ platform, url }) => {
    const icons = {
      linkedin: <FaLinkedin className="w-4 h-4" />,
      github: <FaGithub className="w-4 h-4" />,
      instagram: <FaInstagram className="w-4 h-4" />,
    };

    if (!url) return null;

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
        title={platform}
      >
        {icons[platform]}
      </a>
    );
  };

  const filteredApplications = applications.filter(app =>
    app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.skills?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.memberId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = communityMembers.filter(member =>
    member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.memberId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setDetailModalOpen(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    try {
      if (timestamp.toDate) {
        return timestamp.toDate().toLocaleDateString();
      } else if (timestamp instanceof Date) {
        return timestamp.toLocaleDateString();
      } else {
        return new Date(timestamp).toLocaleDateString();
      }
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Community Members Admin - Soft Game Studio</title>
        <meta name="description" content="Manage community applications and members" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <motion.h1 
              className="text-3xl font-bold text-gray-800 dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Community Members Management
            </motion.h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage community applications and members
            </p>
          </div>

          <AnimatePresence>
            {message.text && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800' 
                    : 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b dark:border-gray-700">
              <div className="flex space-x-1 mb-4 md:mb-0">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'pending'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Pending Applications ({applications.length})
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'members'
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Community Members ({communityMembers.length})
                </button>
              </div>
              
              <div className="relative w-full md:w-64">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'pending' ? 'applications' : 'members'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : activeTab === 'pending' ? (
                <div className="space-y-4">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <FiUser className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No pending applications found</p>
                      <p className="text-sm mt-2">All applications have been processed</p>
                    </div>
                  ) : (
                    filteredApplications.map((application) => (
                      <motion.div
                        key={application.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {application.photoUrl ? (
                              <img
                                src={application.photoUrl}
                                alt={application.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                <FiUser className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {application.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {application.memberId} • Applied {formatDate(application.appliedAt)}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {application.skills?.split(',').slice(0, 3).map((skill, index) => (
                                  <span key={index} className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-xs">
                                    {skill.trim()}
                                  </span>
                                ))}
                                {application.skills?.split(',').length > 3 && (
                                  <span className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-xs">
                                    +{application.skills.split(',').length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <motion.button
                              onClick={() => openDetailModal(application)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FiEye />
                            </motion.button>
                            <motion.button
                              onClick={() => handleAccept(application)}
                              disabled={actionLoading === application.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors disabled:opacity-50"
                              title="Accept"
                            >
                              {actionLoading === application.id ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FiCheck />
                              )}
                            </motion.button>
                            <motion.button
                              onClick={() => handleReject(application)}
                              disabled={actionLoading === application.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors disabled:opacity-50"
                              title="Reject"
                            >
                              <FiX />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMembers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <FiUser className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No community members found</p>
                      <p className="text-sm mt-2">Accepted members will appear here</p>
                    </div>
                  ) : (
                    filteredMembers.map((member) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-600"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            {member.photoUrl ? (
                              <img
                                src={member.photoUrl}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                <FiUser className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                  {member.name}
                                </h3>
                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full flex items-center">
                                  <FiCheckCircle className="w-3 h-3 mr-1" />
                                  Accepted
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {member.communityId} • {member.role || 'Community Member'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Joined {formatDate(member.acceptedAt)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {member.socialLinks && Object.entries(member.socialLinks).map(
                                ([platform, url]) => url && (
                                  <SocialIcon key={platform} platform={platform} url={url} />
                                )
                              )}
                            </div>
                            
                            <motion.button
                              onClick={() => handleRemoveMember(member)}
                              disabled={actionLoading === member.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors disabled:opacity-50"
                              title="Remove Member"
                            >
                              <FiTrash2 />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {detailModalOpen && selectedItem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setDetailModalOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {activeTab === 'pending' ? 'Application Details' : 'Member Details'}
                    </h3>
                    <button 
                      onClick={() => setDetailModalOpen(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2"
                    >
                      <FiX size={24} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      {selectedItem.photoUrl ? (
                        <img
                          src={selectedItem.photoUrl}
                          alt={selectedItem.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <FiUser className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-semibold dark:text-white">{selectedItem.name}</h4>
                        <p className="text-gray-600 dark:text-gray-400">{selectedItem.communityId}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {activeTab === 'pending' 
                            ? `Applied ${formatDate(selectedItem.appliedAt)}`
                            : `Joined ${formatDate(selectedItem.acceptedAt)}`
                          }
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Skills
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.skills?.split(',').map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Info
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {selectedItem.contactInfo || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        About
                      </label>
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                        {selectedItem.bio || 'No bio provided'}
                      </p>
                    </div>

                    {selectedItem.socialLinks && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Social Links
                        </label>
                        <div className="flex space-x-2">
                          {Object.entries(selectedItem.socialLinks).map(
                            ([platform, url]) => url && (
                              <SocialIcon key={platform} platform={platform} url={url} />
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'pending' && (
                      <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                        <button
                          onClick={() => handleReject(selectedItem)}
                          disabled={actionLoading === selectedItem.id}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          {actionLoading === selectedItem.id ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                          onClick={() => handleAccept(selectedItem)}
                          disabled={actionLoading === selectedItem.id}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          {actionLoading === selectedItem.id ? 'Processing...' : 'Accept'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default AdminCommunityMembers;