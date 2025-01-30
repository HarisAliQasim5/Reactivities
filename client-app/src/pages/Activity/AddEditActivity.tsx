import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { NewActivity, Activity } from '../../models/Activity';
import Navbar from '../../components/Navbar';

const AddEditActivity: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract ID from URL
  const navigate = useNavigate();
  const [activity, setActivity] = useState<NewActivity>({
    title: '',
    description: '',
    category: '',
    date: '',
    city: '',
    venue: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch activity data based on the id in the URL
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setActivity((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (id) {
        // If ID exists, update the activity
        await updateActivity(id, activity);
        alert('Activity updated successfully!');
      } else {
        // If no ID, add a new activity
        await addActivity(activity);
        alert('Activity added successfully!');
      }
      navigate('/'); // Redirect to activities list after successful add/update
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  // Function to update an existing activity
  const updateActivity = async (id: string, updatedActivity: NewActivity) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/activities/${id}`, updatedActivity);
      return response.data;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw new Error('Error updating activity');
    }
  };

  // Function to add a new activity
  const addActivity = async (newActivity: NewActivity) => {
    try {
      const response = await axios.post('http://localhost:5000/api/activities', newActivity);
      return response.data;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw new Error('Error adding activity');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mt-10">
        <div className="p-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">{id ? 'Edit Activity' : 'Add Activity'}</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={activity.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={activity.description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                name="category"
                value={activity.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Date Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="datetime-local"
                name="date"
                value={activity.date}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* City Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={activity.city}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Venue Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Venue</label>
              <input
                type="text"
                name="venue"
                value={activity.venue}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Submit Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)} // Go back to the previous page
                className="w-full py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEditActivity;
