import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { fireDB } from '../../DataBase/firebaseConfig';
import RegistrationForm from './RegistrationForm';

export default function EventRegister() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, []);

  const loadEvent = async () => {
    const ref = doc(fireDB, 'events', id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setEvent({ id: snap.id, ...snap.data() });
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen bg-purple-400 dark:bg-neutral-950" />;

  if (!event) {
    return (
      <div className="min-h-screen bg-purple-400 dark:bg-neutral-950 flex items-center justify-center">
        <p className="text-white">Event not found.</p>
      </div>
    );
  }

  return <RegistrationForm eventId={event.id} onClose={() => navigate(`/events/${event.id}`)} />;
}