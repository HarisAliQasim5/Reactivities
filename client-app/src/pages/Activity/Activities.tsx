import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity } from '../../models/Activity';
import Navbar from '../../components/Navbar';
import ActivityList from '../../components/Activity/ActivityList';
import ActivityFilters from '../../components/Activity/ActivityFilters';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  // Fetch all activities (no filters)
  const fetchActivities = async (filters: { date?: string; category?: string; city?: string } = {}) => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await axios.get<Activity[]>(`http://localhost:5000/api/activities?${query}`);
      setActivities(response.data);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError('Failed to fetch activities.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete activity
  const handleDeleteActivity = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/activities/${id}`);
      fetchActivities(); // Refetch activities after delete
    } catch (err) {
      console.error('Error deleting activity:', err);
    }
  };

  // Apply filters from ActivityFilters component
  const applyFilters = (date: string) => {
    const url = `http://localhost:5000/api/activities?Date=${date}`;  // Date as query parameter
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log('Filtered data:', data);
        setActivities(data);
        
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  

  // Clear filters and fetch all activities
  const clearFilters = () => {
    fetchActivities();
  };

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-center text-lg text-red-500">{error}</div>;

  return (
    <div className="bg-gray-300 pt-10 px-32 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 gap-x-20">
          <div className="col-span-3">
            <ActivityList
              activities={activities}
              deleteActivity={handleDeleteActivity}
            />
          </div>
          <div className="col-span-1">
            <ActivityFilters applyFilters={applyFilters} clearFilters={clearFilters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
