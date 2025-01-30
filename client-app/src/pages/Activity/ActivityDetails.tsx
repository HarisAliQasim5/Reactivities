import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity } from '../../models/Activity';
import Navbar from '../../components/Navbar';

const attendees = [
  { name: 'Bob', isHost: true, isFollowing: true },
  { name: 'Tom', isFollowing: true },
  { name: 'Sally' }
];

const ActivityDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      fetchActivityById(id)
        .then((data) => setActivity(data))
        .catch((error) => setError('Error fetching activity. Please try again later.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const fetchActivityById = async (id: string): Promise<Activity> => {
    try {
      const response = await axios.get(`http://localhost:5000/api/activities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching activity:', error);
      throw new Error('Error fetching activity');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!activity) {
    return <div className="flex justify-center items-center h-screen">Activity not found.</div>;
  }

  const handleEdit = () => {
    navigate(`/edit-activity/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 pt-32">
        <div className='grid grid-cols-3 gap-x-5'>

          <div className='col-span-2'>
          <div className="relative">
        <img
          src="https://picsum.photos/200/300"
          alt="Activity cover"
          className="w-full h-72 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/40 to-transparent">
          <h1 className="text-3xl font-bold text-white mb-1">{activity.title}</h1>
          <p className="text-white text-lg mb-1">{activity.date}</p>
          <p className="text-white text-lg">Hosted by Bob</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center px-4 py-3 bg-white  pt-10">
        <div className="flex gap-3">
          <button
            className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors"
          >
            Join Activity
          </button>
          <button
            className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel attendance
          </button>
        </div>
        <button
          className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition-colors"
        >
          Manage Event
        </button>
      </div>
          </div>
          <div className='w-full max-w-sm bg-white rounded-lg shadow-sm'>
          <div className="bg-teal-500 text-white p-4 rounded-t-lg">
        <h2 className="text-lg font-semibold">3 People Going</h2>
      </div>

      {/* Attendees List */}
      <div className="divide-y divide-gray-100">
        {attendees.map((attendee, index) => (
          <div key={index} className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              
              {/* Name and Status */}
              <div className="flex flex-col">
                <span className="text-blue-600 font-medium">{attendee.name}</span>
                {attendee.isFollowing && (
                  <span className="text-orange-500 text-sm">Following</span>
                )}
              </div>
            </div>

            {/* Host Badge */}
            {attendee.isHost && (
              <div className="bg-orange-500 text-white text-sm px-3 py-1 rounded-lg relative">
                Host
                <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rotate-45" />
              </div>
            )}
          </div>
        ))}
      </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ActivityDetails;