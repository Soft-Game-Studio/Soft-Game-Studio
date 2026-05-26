// src/pages/public/EventsListing.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { fireDB } from "../../DataBase/firebaseConfig";
import Layout from "../../components/layout/Layout";
import { motion } from "framer-motion";
import { 
  Search, SlidersHorizontal, Calendar, MapPin, Clock, 
  Users, Tag, ExternalLink, Sparkles 
} from "lucide-react";

const EVENT_TYPES = ["ALL", "HACKATHON", "COMPETITION", "WORKSHOP", "SEMINAR", "WEBINAR", "BOOTCAMP", "MEETUP"];

const EMPTY_EVENT = {
  basic: { title: "", tagline: "", shortDescription: "", longDescription: "", coverImage: "", mode: "", location: "", registrationOpen: "", registrationClose: "", eventStart: "", eventEnd: "", entryFee: 0, certificate: false, type: "" },
  team: { allowSolo: true, allowTeam: true, minSize: 1, maxSize: 4, maxTeams: 100 },
  problemStatements: [],
  timeline: [],
  judging: [],
  faq: [],
  prizes: [],
  registrationFields: [],
};

const normalizeEvent = (data) => {
  if (!data) return EMPTY_EVENT;
  const basic = {
    title: data.title || data.basic?.title || "",
    tagline: data.tagline || data.basic?.tagline || "",
    shortDescription: data.shortDescription || data.basic?.shortDescription || "",
    longDescription: data.longDescription || data.basic?.longDescription || "",
    coverImage: data.coverImage || data.basic?.coverImage || "",
    mode: data.mode || data.basic?.mode || "",
    location: data.location || data.basic?.location || "",
    registrationOpen: data.registrationOpen || data.basic?.registrationOpen || "",
    registrationClose: data.registrationClose || data.basic?.registrationClose || "",
    eventStart: data.eventStart || data.basic?.eventStart || "",
    eventEnd: data.eventEnd || data.basic?.eventEnd || "",
    entryFee: data.entryFee !== undefined ? data.entryFee : (data.basic?.entryFee !== undefined ? data.basic.entryFee : 0),
    certificate: data.certificate !== undefined ? data.certificate : (data.basic?.certificate !== undefined ? data.basic.certificate : false),
    type: data.type || data.basic?.type || "",
  };

  return {
    ...data,
    basic,
    problemStatements: data.problemStatements || [],
    timeline: data.timeline || [],
    judging: data.judging || [],
    faq: data.faq || [],
    prizes: data.prizes || [],
    registrationFields: data.registrationFields || [],
  };
};

export default function EventsListing() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterMode, setFilterMode] = useState("ALL");

  useEffect(() => {
    const q = query(collection(fireDB, "events"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventList = snapshot.docs.map((doc) => normalizeEvent({ id: doc.id, ...doc.data() }));
      setEvents(eventList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filtering logic
  const filteredEvents = events.filter((event) => {
    const basic = event.basic || {};
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (basic.title?.toLowerCase() || "").includes(searchTerm) ||
      (basic.tagline?.toLowerCase() || "").includes(searchTerm) ||
      (basic.type?.toLowerCase() || "").includes(searchTerm);

    const matchesType = filterType === "ALL" || (basic.type?.toUpperCase() === filterType);
    const matchesMode = filterMode === "ALL" || (basic.mode?.toUpperCase() === filterMode);

    return matchesSearch && matchesType && matchesMode;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (event) => {
    const now = new Date();
    const open = event.basic?.registrationOpen;
    const close = event.basic?.registrationClose;
    if (open && close && new Date(open) <= now && new Date(close) >= now) {
      return { text: "Open", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" };
    }
    if (open && new Date(open) > now) {
      return { text: "Upcoming", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
    }
    return { text: "Closed", color: "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400" };
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50/30 via-white to-purple-50/20 dark:from-neutral-950 dark:via-neutral-900/80 dark:to-neutral-950">
        
        {/* Hero Banner */}
        <section className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400/10 via-transparent to-transparent dark:from-purple-900/20 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Discover Events
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8 font-medium">
              Explore hackathons, competitions, workshops, and more. Find your next challenge.
            </p>

            {/* Search & Filters */}
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-center bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl rounded-2xl p-3 border border-slate-200 dark:border-neutral-800/80 shadow-xl">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 outline-none font-medium"
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-sm font-semibold outline-none cursor-pointer text-slate-800 dark:text-neutral-200"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t} className="dark:bg-neutral-800">{t === "ALL" ? "All Types" : t}</option>
                  ))}
                </select>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-sm font-semibold outline-none cursor-pointer text-slate-800 dark:text-neutral-200"
                >
                  <option value="ALL" className="dark:bg-neutral-800">All Modes</option>
                  <option value="ONLINE" className="dark:bg-neutral-800">Online</option>
                  <option value="OFFLINE" className="dark:bg-neutral-800">Offline</option>
                  <option value="HYBRID" className="dark:bg-neutral-800">Hybrid</option>
                </select>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Events Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Sparkles className="w-16 h-16 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
              <p className="text-2xl text-gray-500 dark:text-gray-400 font-medium">No events found</p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => {
                const basic = event.basic || {};
                const status = getStatusBadge(event);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -6 }}
                    className="group relative bg-white dark:bg-neutral-900 rounded-3xl shadow-lg border border-slate-200/50 dark:border-neutral-800/80 overflow-hidden hover:shadow-2xl hover:border-indigo-300 dark:hover:border-indigo-900/60 transition-all duration-300 flex flex-col h-full cursor-pointer"
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    {/* Cover Image container */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-neutral-800">
                      {basic.coverImage ? (
                        <img
                          src={basic.coverImage}
                          alt={basic.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-indigo-500/40" />
                        </div>
                      )}
                      {/* Dark Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none" />

                      {/* Top labels */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full border shadow-sm ${status.color.includes("emerald") ? "bg-emerald-500/90 text-white border-emerald-400" : status.color.includes("blue") ? "bg-blue-500/90 text-white border-blue-400" : "bg-neutral-600/90 text-white border-neutral-500"}`}>
                          {status.text}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-white/95 dark:bg-neutral-900/95 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-neutral-800 shadow-sm uppercase">
                          {basic.type || "Event"}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1 text-left">
                      <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {basic.title || "Untitled Event"}
                      </h3>
                      {basic.tagline && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2">
                          {basic.tagline}
                        </p>
                      )}

                      {/* Spacer to push details to the bottom */}
                      <div className="flex-1" />

                      <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 border-t border-slate-100 dark:border-neutral-800/80 pt-4 mb-6">
                        {basic.mode && (
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-indigo-500 shrink-0" />
                            <span className="truncate">{basic.mode}{basic.location ? ` · ${basic.location}` : ""}</span>
                          </div>
                        )}
                        {basic.eventStart && (
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-500 shrink-0" />
                            <span>
                              {formatDate(basic.eventStart)}
                              {basic.eventEnd ? ` → ${formatDate(basic.eventEnd)}` : ""}
                            </span>
                          </div>
                        )}
                        {basic.entryFee !== undefined && (
                          <div className="flex items-center gap-2">
                            <Tag size={16} className="text-indigo-500 shrink-0" />
                            <span className="font-semibold text-gray-900 dark:text-neutral-200">
                              {basic.entryFee === 0 ? "Free Entry" : `₹${basic.entryFee}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* View Details button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/event/${event.id}`);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                      >
                        View Details <ExternalLink size={15} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}