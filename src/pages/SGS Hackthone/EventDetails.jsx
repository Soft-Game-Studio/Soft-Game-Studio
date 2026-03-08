import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Sparkles,
  Star,
  Link as LinkIcon,
  Image as ImageIcon,
  FileText,
  Clock,
  Download,
  ExternalLink
} from 'lucide-react';
import CountdownTimer from '../../components/Card/CountdownTimer';
import { fireDB } from '../../DataBase/firebaseConfig';


export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState('loading');
  const [participantCount, setParticipantCount] = useState(0);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    const docRef = doc(fireDB, "events", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = { id: snap.id, ...snap.data() };
      setEvent(data);
      checkRegistrationStatus(data);

      // Fetch participant count
      const participantsQuery = query(
        collection(fireDB, 'event_registrations'),
        where('eventId', '==', data.id)
      );
      const participantsSnap = await getDocs(participantsQuery);
      setParticipantCount(participantsSnap.size);
    }
  };

  const checkRegistrationStatus = (event) => {
    if (event.status === 'upcoming') {
      setRegistrationStatus('coming-soon');
      return;
    }
    if (event.status === 'completed') {
      setRegistrationStatus('closed');
      return;
    }
    const now = new Date();
    const openTime = event.openTime?.toDate?.() || new Date(event.openTime);
    const closeTime = event.closeTime?.toDate?.() || new Date(event.closeTime);

    if (now < openTime) setRegistrationStatus('coming-soon');
    else if (now > closeTime) setRegistrationStatus('closed');
    else setRegistrationStatus('open');
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-purple-400 dark:bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const startDate = event.startDate?.toDate?.() || new Date(event.startDate);
  const endDate = event.endDate?.toDate?.() || new Date(event.endDate);
  const openTime = event.openTime?.toDate?.() || new Date(event.openTime);
  const closeTime = event.closeTime?.toDate?.() || new Date(event.closeTime);
  const eventStart = event.eventStart?.toDate?.() || new Date(event.eventStart);
  const eventEnd = event.eventEnd?.toDate?.() || new Date(event.eventEnd);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-300 to-pink-300 dark:from-neutral-950 dark:to-neutral-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-8 h-64 md:h-96 shadow-2xl">
          <img
            src={event.banner || 'https://via.placeholder.com/1200x400?text=Event+Banner'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">{event.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-purple-600/90 backdrop-blur-sm rounded-full text-sm capitalize">
                {event.type}
              </span>
              <span className="px-3 py-1 bg-gray-800/70 backdrop-blur-sm rounded-full text-sm capitalize">
                {event.status}
              </span>
              {event.venueType && (
                <span className="px-3 py-1 bg-gray-800/70 backdrop-blur-sm rounded-full text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {event.venueType === 'online' ? 'Online' : 'Offline'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
                About This Event
              </h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Timeline & Venue */}
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
              <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
                Event Details
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" /> Schedule
                  </h3>
                  <p className="text-sm">Starts: {eventStart.toLocaleString()}</p>
                  <p className="text-sm">Ends: {eventEnd.toLocaleString()}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-600" /> Venue
                  </h3>
                  {event.venueType === 'online' ? (
                    <p className="text-sm">Online Event</p>
                  ) : (
                    <p className="text-sm">{event.venueAddress || 'TBD'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Team Size (if applicable) */}
            {event.teamMin && event.teamMax && (
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
                  Team Size
                </h2>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span>
                    {event.teamMin} - {event.teamMax} members per team
                  </span>
                </div>
              </div>
            )}

            {/* Prizes */}
            {event.prizes?.length > 0 && event.prizes[0] !== '' && (
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 flex items-center gap-2">
                  <Trophy className="w-6 h-6" /> Prizes
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {event.prizes.map((prize, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">{prize}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features */}
            {event.features?.length > 0 && event.features[0] !== '' && (
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" /> Features
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {event.features.map((feat, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">{feat}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Points */}
            {event.points?.length > 0 && event.points[0] !== '' && (
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 flex items-center gap-2">
                  <Star className="w-6 h-6" /> Key Points
                </h2>
                <ul className="list-disc list-inside space-y-2">
                  {event.points.map((point, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Organizers */}
            {event.organizers?.length > 0 && event.organizers[0].name && (
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 flex items-center gap-2">
                  <Star className="w-6 h-6" /> Organizers
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.organizers.map((org, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      {org.image ? (
                        <img src={org.image} alt={org.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-xl">
                          {org.name?.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold">{org.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{org.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sponsors */}
            {event.sponsors?.length > 0 && event.sponsors[0].name && (
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 flex items-center gap-2">
                  <LinkIcon className="w-6 h-6" /> Sponsors
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {event.sponsors.map((sponsor, idx) => (
                    <a
                      key={idx}
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-neutral-800 rounded-xl hover:shadow-md transition"
                    >
                      {sponsor.logo ? (
                        <img src={sponsor.logo} alt={sponsor.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold text-xl">
                          {sponsor.name?.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold">{sponsor.name}</p>
                        <p className="text-xs text-gray-500 truncate">{sponsor.website}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {event.gallery?.length > 0 && (
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 flex items-center gap-2">
                  <ImageIcon className="w-6 h-6" /> Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="aspect-square rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
                    >
                      <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {event.documents?.length > 0 && (
              <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800">
                <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 flex items-center gap-2">
                  <FileText className="w-6 h-6" /> Resources
                </h2>
                <ul className="space-y-2">
                  {event.documents.map((docUrl, idx) => (
                    <li key={idx}>
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition"
                      >
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="flex-1 truncate">{docUrl.split('/').pop()}</span>
                        <Download className="w-4 h-4 text-gray-500" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800 sticky top-6">
              <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
                Registration
              </h3>

              {registrationStatus === 'open' && (
                <>
                  <CountdownTimer targetDate={closeTime} label="Registration closes in" />
                  <Link to={`/events/${id}/register`}>
                    <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition shadow-lg">
                      Register Now
                    </button>
                  </Link>
                </>
              )}

              {registrationStatus === 'coming-soon' && (
                <>
                  <CountdownTimer targetDate={openTime} label="Registration opens in" />
                  <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 py-3 px-4 rounded-xl text-center">
                    Registrations will open soon.
                  </div>
                </>
              )}

              {registrationStatus === 'closed' && (
                <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 py-3 px-4 rounded-xl text-center">
                  Registration Closed
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Opens: {openTime.toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Closes: {closeTime.toLocaleString()}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4" /> Participants: {participantCount}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-200 dark:border-neutral-800 text-center">
              <h3 className="text-lg font-semibold mb-2">Share this event</h3>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}/events/${id}`}
                alt="QR Code"
                className="mx-auto rounded-lg shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}