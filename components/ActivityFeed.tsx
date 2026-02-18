
import React from 'react';
import { FeedEvent, FeedEventType } from '../types';

interface ActivityFeedProps {
  events: FeedEvent[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
  const getIcon = (type: FeedEventType) => {
    switch (type) {
      case FeedEventType.RIDE_STARTED: return '🚀';
      case FeedEventType.RIDER_JOINED: return '👥';
      case FeedEventType.RIDE_COMPLETED: return '🏁';
      case FeedEventType.MILESTONE: return '🏆';
      default: return '📢';
    }
  };

  return (
    <div className="w-full bg-zinc-950 flex flex-col h-full">
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-2xl font-black text-white">The Pulse</h2>
        <p className="text-zinc-500 text-sm">Real-time rider updates</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {events.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
            <div className="text-4xl">😴</div>
            <p>Silence in the city...</p>
          </div>
        ) : events.map(event => (
          <div key={event.event_id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-start gap-4">
            <div className="text-2xl pt-1">{getIcon(event.event_type)}</div>
            <div className="flex-1">
              <p className="text-zinc-200 text-sm leading-relaxed">{event.message}</p>
              <span className="text-[10px] text-zinc-500 mt-2 block font-mono">
                {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {event.ride_id && (
              <button className="text-orange-500 font-bold text-xs hover:underline pt-1">
                View
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
