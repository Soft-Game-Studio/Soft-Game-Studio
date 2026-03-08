import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Search, Filter, X } from 'lucide-react';
import EventCard from '../../components/Card/EventCard';
import { fireDB } from '../../DataBase/firebaseConfig';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusTab, setStatusTab] = useState('all'); // 'all', 'upcoming', 'active', 'past'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [search, typeFilter, statusTab, events]);

  const loadEvents = async () => {
    setLoading(true);
    const snap = await getDocs(collection(fireDB, 'events'));
    const arr = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setEvents(arr);
    setLoading(false);
  };

  const filterEvents = () => {
    let result = [...events];

    // Apply search
    if (search) {
      result = result.filter(e =>
        e.title?.toLowerCase().includes(search.toLowerCase()) ||
        e.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(e => e.type === typeFilter);
    }

    // Apply status tab filter
    const now = new Date();
    if (statusTab !== 'all') {
      result = result.filter(e => {
        // Use manual status if present, else derive from dates
        const eventStatus = e.status || getDerivedStatus(e, now);
        return eventStatus === statusTab;
      });
    }

    setFiltered(result);
  };

  const getDerivedStatus = (event, now) => {
    const start = event.startDate?.toDate?.() || new Date(event.startDate);
    const end = event.endDate?.toDate?.() || new Date(event.endDate);
    if (now < start) return 'upcoming';
    if (now > end) return 'past';
    return 'active';
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('all');
    setStatusTab('all');
  };

  const hasFilters = search || typeFilter !== 'all' || statusTab !== 'all';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-300 to-pink-300 dark:from-neutral-950 dark:to-neutral-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-900 to-pink-700 dark:from-purple-400 dark:to-pink-400">
            Events
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Discover hackathons, workshops, competitions and more
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {['all', 'upcoming', 'active', 'past'].map(tab => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                statusTab === tab
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white/80 dark:bg-neutral-800/80 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-neutral-700 backdrop-blur-sm'
              }`}
            >
              {tab === 'all' ? 'All Events' : tab}
            </button>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl mb-8 border border-purple-200 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none transition"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full md:w-auto px-4 py-3 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-purple-500 outline-none"
            >
              <option value="all">All Types</option>
              <option value="hackathon">Hackathon</option>
              <option value="workshop">Workshop</option>
              <option value="competition">Competition</option>
              <option value="event">Event</option>
            </select>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-4 py-3 text-sm bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600 rounded-xl transition"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filtered.length} {filtered.length === 1 ? 'event' : 'events'} found
          </p>
        </div>

        {/* Event Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-3xl">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No events match your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event, index) => (
              <div
                key={event.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}