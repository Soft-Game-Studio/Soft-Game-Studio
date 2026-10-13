// src/components/Members/OurMembers.jsx
import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion
} from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../layout/Layout";
import { Helmet } from "react-helmet";
import {
  Linkedin,
  Github,
  Instagram,
  Search,
  ArrowUp,
  Mail,
  Briefcase,
  BookOpen,
  X,
  Filter,
  ChevronDown,
  ExternalLink,
  Users,
  Grid3X3,
  List,
  Phone,
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react";

// Platform-specific social link icon
const SocialIcon = ({ platform, url }) => {
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      case "github":
        return <Github className="w-4 h-4" />;
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${platform} profile`}
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-[#00ACF0] dark:hover:text-sky-400 transition-colors"
    >
      {getIcon()}
    </a>
  );
};

// Distinct department badge styles without purple
const DepartmentBadge = ({ department }) => {
  const departmentColors = {
    Development: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/50",
    Developement: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/50",
    Design: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50",
    Marketing: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
    Management: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/50",
    HR: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/50",
    Default: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700"
  };

  const styleClass = departmentColors[department] || departmentColors.Default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styleClass}`}>
      {department || "Team"}
    </span>
  );
};

// Member card presentation
const MemberCard = ({ member, layoutType, onMemberClick }) => {
  if (layoutType === "grid") {
    return (
      <div
        className="group bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-[#00ACF0]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
        onClick={() => onMemberClick(member)}
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5">
            {member.photoUrl ? (
              <img
                alt={member.name}
                loading="lazy"
                className="w-28 h-28 object-cover rounded-full border-2 border-neutral-200 dark:border-neutral-700 shadow-sm group-hover:scale-105 transition-transform duration-300"
                src={member.image || member.photoUrl}
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-3xl font-bold text-[#00ACF0]">
                {member.name ? member.name.charAt(0) : "S"}
              </div>
            )}
          </div>

          <DepartmentBadge department={member.department} />

          <p className="text-xs font-semibold uppercase tracking-wider text-[#00ACF0] mt-3">
            {member.role}
          </p>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
            {member.name}
          </h3>

          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-3 leading-relaxed">
            {member.bio || `${member.role} at Soft Game Studio`}
          </p>

          {member.skills && (
            <div className="flex justify-center flex-wrap gap-1.5 mt-4">
              {typeof member.skills === "string"
                ? member.skills.split(",").slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    >
                      {skill.trim()}
                    </span>
                  ))
                : null}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-800 w-full">
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {member.social &&
              Object.entries(member.social).map(
                ([platform, url]) => url && <SocialIcon key={platform} platform={platform} url={url} />
              )}
          </div>
          <button
            type="button"
            className="text-xs font-semibold text-[#00ACF0] hover:underline flex items-center gap-1"
          >
            Details <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm hover:border-[#00ACF0]/40 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
      onClick={() => onMemberClick(member)}
    >
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          {member.photoUrl ? (
            <img
              alt={member.name}
              loading="lazy"
              className="w-20 h-20 object-cover rounded-full border-2 border-neutral-200 dark:border-neutral-700 shadow-sm group-hover:scale-105 transition-transform"
              src={member.image || member.photoUrl}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-2xl font-bold text-[#00ACF0]">
              {member.name ? member.name.charAt(0) : "S"}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              {member.name}
            </h3>
            <DepartmentBadge department={member.department} />
            {member.employeeId && (
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                {member.employeeId}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-[#00ACF0] uppercase tracking-wider">
            {member.role}
          </p>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl line-clamp-2 leading-relaxed">
            {member.bio || `${member.role} at Soft Game Studio`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {member.social &&
            Object.entries(member.social).map(
              ([platform, url]) => url && <SocialIcon key={platform} platform={platform} url={url} />
            )}
        </div>
        <button
          type="button"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-[#00ACF0] hover:text-[#00ACF0] transition-colors flex items-center gap-1"
        >
          View Profile <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
        </button>
      </div>
    </div>
  );
};

// Modal for in-depth profile details
const MemberModal = ({ member, isOpen, onClose }) => {
  if (!isOpen || !member) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-member-name"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Banner */}
          <div className="relative p-6 sm:p-8 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
            <button
              onClick={onClose}
              aria-label="Close details"
              className="absolute top-5 right-5 p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
              {member.photoUrl ? (
                <img
                  alt={member.name}
                  className="w-24 h-24 object-cover rounded-full border-2 border-neutral-300 dark:border-neutral-700 shadow-sm"
                  src={member.image || member.photoUrl}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-3xl font-bold text-[#00ACF0]">
                  {member.name ? member.name.charAt(0) : "S"}
                </div>
              )}

              <div className="space-y-1">
                <DepartmentBadge department={member.department} />
                <h2 id="modal-member-name" className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">
                  {member.name}
                </h2>
                <p className="text-sm font-semibold text-[#00ACF0] uppercase tracking-wide">
                  {member.role}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                  {member.employeeId && <span>ID: {member.employeeId}</span>}
                  {member.joinDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Joined {new Date(member.joinDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#00ACF0]" /> About
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                {member.bio || `${member.role} at Soft Game Studio`}
              </p>
            </div>

            {(member.experience || member.education) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                {member.experience && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-[#00ACF0]" /> Experience
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {member.experience}
                    </p>
                  </div>
                )}
                {member.education && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#00ACF0]" /> Education
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {member.education}
                    </p>
                  </div>
                )}
              </div>
            )}

            {member.skills && (
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#00ACF0]" /> Core Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {typeof member.skills === "string"
                    ? member.skills.split(",").map((sk, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                        >
                          {sk.trim()}
                        </span>
                      ))
                    : member.skills}
                </div>
              </div>
            )}

            {member.projects && member.projects.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-[#00ACF0]" /> Key Projects
                </h3>
                <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300 space-y-1">
                  {member.projects.map((proj, idx) => (
                    <li key={idx}>{proj}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  team.softgamestudio@gmail.com
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  +91 9914267704 / +91 6283400770
                </p>
              </div>

              {member.social && (
                <div className="flex items-center gap-2">
                  {Object.entries(member.social).map(
                    ([platform, url]) => url && <SocialIcon key={platform} platform={platform} url={url} />
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function OurMembers() {
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yParallax = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? ["0%", "0%"] : ["0%", "15%"]);

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ department: "all" });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutType, setLayoutType] = useState("grid");
  const [selectedMember, setSelectedMember] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const membersPerPage = 6;

  // Permission priority ordering (Admin: 1, Authority: 2, Manager: 3, Teacher: 4, Member: 5)
  const priorityOrder = {
    Admin: 1,
    Authority: 2,
    Manager: 3,
    Teacher: 4,
    Member: 5
  };

  useEffect(() => {
    let isMounted = true;
    const fetchTeamMembers = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireDB, "teamMembers"));
        const teamMembersData = querySnapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          let joinIso = new Date().toISOString();
          if (d.joinDate) {
            joinIso = d.joinDate;
          } else if (d.createdAt && typeof d.createdAt.toDate === "function") {
            joinIso = d.createdAt.toDate().toISOString();
          }

          return {
            id: docSnap.id,
            ...d,
            image: d.photoUrl || "",
            bio: d.bio || `${d.role || "Member"} at Soft Game Studio`,
            social: d.social || {},
            joinDate: joinIso
          };
        });

        if (isMounted) {
          setTeamMembers(teamMembersData);
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTeamMembers();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter members based on search and department
  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        (member.name && member.name.toLowerCase().includes(q)) ||
        (member.role && member.role.toLowerCase().includes(q)) ||
        (member.department && member.department.toLowerCase().includes(q));

      const matchesDept =
        filters.department === "all" || member.department === filters.department;

      return matchesSearch && matchesDept;
    });
  }, [teamMembers, searchTerm, filters]);

  // Unique departments for filter dropdown
  const departments = useMemo(() => {
    return [...new Set(teamMembers.map((m) => m.department).filter(Boolean))];
  }, [teamMembers]);

  // Sort members by permission priority
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      const prioA = priorityOrder[a.permission] || 999;
      const prioB = priorityOrder[b.permission] || 999;
      return prioA - prioB;
    });
  }, [filteredMembers]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedMembers.length / membersPerPage);
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = sortedMembers.slice(indexOfFirstMember, indexOfLastMember);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMemberClick = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ department: "all" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Structured Data Schema for team
  const teamSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "Soft Game Studio Core Team",
    "url": "https://softgamestudios.web.app/OurMembers",
    "description": "Meet the team members of Soft Game Studio leading game engineering, edtech development, and operations.",
    "publisher": {
      "@type": "Organization",
      "name": "Soft Game Studio Pvt. Ltd.",
      "url": "https://softgamestudios.web.app"
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Our Team | Soft Game Studio</title>
        <meta
          name="description"
          content="Meet the core team of developers, instructors, and designers building educational platforms and interactive software at Soft Game Studio."
        />
        <link rel="canonical" href="https://softgamestudios.web.app/OurMembers" />

        {/* Open Graph */}
        <meta property="og:title" content="Meet Our Team | Soft Game Studio" />
        <meta
          property="og:description"
          content="Explore the profiles of developers, educators, and engineers behind Soft Game Studio."
        />
        <meta
          property="og:image"
          content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FTeam-Members-Soft-Game-Studio-Game-Developers.png?alt=media&token=your-token-here"
        />
        <meta property="og:url" content="https://softgamestudios.web.app/OurMembers" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Soft Game Studio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SoftGameStudio" />
        <meta name="twitter:title" content="Our Team | Soft Game Studio" />
        <meta
          name="twitter:description"
          content="Get to know our game developers, course instructors, and technology leaders."
        />
        <meta
          name="twitter:image"
          content="https://firebasestorage.googleapis.com/v0/b/webjl26.appspot.com/o/SGS%20images%2FTeam-Members-Soft-Game-Studio-Game-Developers.png?alt=media&token=your-token-here"
        />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(teamSchema)}</script>
      </Helmet>

      <div
        ref={containerRef}
        className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300"
      >
        {/* Hero Header */}
        <header className="relative pt-24 pb-14 px-4 bg-gradient-to-b from-neutral-100 via-neutral-50 to-neutral-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <motion.div
            style={{ y: yParallax }}
            className="max-w-4xl mx-auto text-center relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-sky-100 dark:bg-sky-950/60 text-[#00ACF0] dark:text-sky-400 border border-sky-200 dark:border-sky-900/50 mb-6">
              <Users className="w-3.5 h-3.5" />
              Core Team
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Meet Our Team
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              The engineers, designers, and educators designing high-impact interactive systems and educational experiences.
            </p>
          </motion.div>
        </header>

        {/* Team Controls & Explorer */}
        <main className="py-12 px-4 max-w-7xl mx-auto">
          {/* Search, Filter & Layout Controls */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Team Directory
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Showing {sortedMembers.length} member{sortedMembers.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search Box */}
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search by name, role, dept..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#00ACF0] focus:border-transparent transition"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {/* Department Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/60 transition"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Grid / List Layout Switcher */}
                  <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                    <button
                      onClick={() => setLayoutType("grid")}
                      aria-label="Grid view"
                      className={`p-2 rounded-lg transition ${
                        layoutType === "grid"
                          ? "bg-white dark:bg-neutral-700 text-[#00ACF0] shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setLayoutType("list")}
                      aria-label="List view"
                      className={`p-2 rounded-lg transition ${
                        layoutType === "list"
                          ? "bg-white dark:bg-neutral-700 text-[#00ACF0] shadow-sm"
                          : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center gap-4">
                <div className="w-full sm:w-64">
                  <label htmlFor="dept-filter" className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
                    Department
                  </label>
                  <select
                    id="dept-filter"
                    value={filters.department}
                    onChange={(e) => handleFilterChange("department", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#00ACF0]"
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-neutral-500 hover:text-[#00ACF0] self-end pb-2 transition"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Members Display */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 rounded-full border-2 border-[#00ACF0] border-t-transparent animate-spin" />
            </div>
          ) : sortedMembers.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 max-w-lg mx-auto">
              <Users className="w-12 h-12 mx-auto text-neutral-400 mb-3" />
              <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                No matching team members found
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 mb-5">
                Try adjusting your search criteria or clear your current department filter.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#00ACF0] text-white hover:bg-[#0092cc] transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div
                className={
                  layoutType === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {currentMembers.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    layoutType={layoutType}
                    onMemberClick={handleMemberClick}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-9 h-9 text-xs font-semibold rounded-lg transition ${
                        currentPage === num
                          ? "bg-[#00ACF0] text-white shadow-sm"
                          : "border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 disabled:opacity-40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Scroll to Top floating action */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            className="fixed bottom-6 right-6 z-40 p-3 bg-[#00ACF0] text-white rounded-full shadow-lg hover:bg-[#0092cc] active:scale-95 transition"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Member Profile Modal */}
        <MemberModal
          member={selectedMember}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </Layout>
  );
}