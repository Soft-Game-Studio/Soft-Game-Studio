import { Link } from 'react-router-dom';
import { Calendar, Tag } from 'lucide-react';

export default function EventCard({ event }) {
  const startDate = event.startDate?.toDate?.() || new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link to={`/events/${event.id}`} className="group">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-purple-100 dark:border-neutral-800">
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.banner || 'https://via.placeholder.com/400x200?text=Event+Banner'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full capitalize">
            {event.type}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {event.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span className="capitalize">{event.type}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}