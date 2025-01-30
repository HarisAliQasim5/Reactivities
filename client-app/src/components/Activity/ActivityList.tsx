import React from 'react';
import { Activity } from '../../models/Activity';
import { useNavigate } from "react-router-dom";
import { Trash2 } from 'lucide-react';

interface Props {
  activities: Activity[];
  deleteActivity: (id: string) => void;
}

const ActivityList: React.FC<Props> = ({ activities, deleteActivity }) => {
  const navigate = useNavigate();

  const handleViewClick = (id: string) => {
    navigate(`/view-activity/${id}`);
  };

  // Sort activities by date (newest first)
  const sortedActivities = React.useMemo(() => {
    return [...activities].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [activities]);

  // Group activities by date
  const groupedActivities = React.useMemo(() => {
    return sortedActivities.reduce((groups: Record<string, Activity[]>, activity) => {
      const date = new Date(activity.date).toISOString().split('T')[0];
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
      return groups;
    }, {});
  }, [sortedActivities]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([date, dateActivities]) => (
        <div key={date}>
          {/* Date header */}
          <div className="text-teal-500 mb-2">
            {formatDate(date)}
          </div>
          
          {/* Activities for this date */}
          {dateActivities.map((activity) => (
            <div key={activity.id} className="bg-white rounded shadow-sm mb-4">
              {/* Header with title and host */}
              <div className="p-4 border-b">
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div>
                      <h2 className="text-xl font-bold">{activity.title}</h2>
                      <p className="text-gray-600">Hosted by </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteActivity(activity.id)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Date and location */}
              <div className="px-4 py-3 border-b text-sm">
                <span className="mr-2">📅 {formatDate(date)}</span>
                <span>📍 {activity.venue || 'test'}</span>
              </div>

              {/* Attendees section */}
              <div className="px-4 py-3 border-b text-gray-600">
                Attendees go here
              </div>

              {/* Description and view button */}
              <div className="px-4 py-3 flex justify-between items-center">
                <div className="text-gray-600">
                  {activity.description || 'Test'}
                </div>
                <button
                  onClick={() => handleViewClick(activity.id)}
                  className="bg-teal-500 text-white px-6 py-1.5 rounded hover:bg-teal-600"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ActivityList;