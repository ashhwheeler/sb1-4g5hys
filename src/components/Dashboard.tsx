import React, { useState, useEffect } from 'react';
import { Mail, Edit, Trash, DollarSign, Plus, X } from 'lucide-react';

interface EmailForecast {
  id: number;
  locations: string[];
  forecastType: 'surf' | 'kitesurf';
  frequency: 'Daily' | 'Weekly';
  timeFrame: '3 Days' | '1 Week';
  deliveryDay: string;
  deliveryTime: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [emailForecasts, setEmailForecasts] = useState<EmailForecast[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingForecast, setEditingForecast] = useState<EmailForecast | null>(null);

  const [newForecast, setNewForecast] = useState<Omit<EmailForecast, 'id'>>({
    locations: [],
    forecastType: 'surf',
    frequency: 'Daily',
    timeFrame: '3 Days',
    deliveryDay: 'Monday',
    deliveryTime: '08:00',
    email: '',
  });

  useEffect(() => {
    // Fetch email forecasts from the backend when the component mounts
    fetchEmailForecasts();
  }, []);

  const fetchEmailForecasts = async () => {
    // TODO: Implement API call to fetch email forecasts
    // For now, we'll use mock data
    const mockForecasts: EmailForecast[] = [
      { id: 1, locations: ['Bali'], forecastType: 'surf', frequency: 'Daily', timeFrame: '3 Days', deliveryDay: 'Monday', deliveryTime: '08:00', email: 'user1@example.com' },
      { id: 2, locations: ['Hawaii'], forecastType: 'kitesurf', frequency: 'Weekly', timeFrame: '1 Week', deliveryDay: 'Friday', deliveryTime: '18:00', email: 'user2@example.com' },
    ];
    setEmailForecasts(mockForecasts);
  };

  const handleAddForecast = async () => {
    if (newForecast.locations.length === 0) {
      alert('Please add at least one location.');
      return;
    }
    // TODO: Implement API call to add new forecast
    const newId = Date.now();
    const addedForecast = { ...newForecast, id: newId };
    setEmailForecasts([...emailForecasts, addedForecast]);
    setNewForecast({
      locations: [],
      forecastType: 'surf',
      frequency: 'Daily',
      timeFrame: '3 Days',
      deliveryDay: 'Monday',
      deliveryTime: '08:00',
      email: '',
    });
    setShowAddForm(false);
  };

  const handleUpdateForecast = async () => {
    if (editingForecast) {
      if (editingForecast.locations.length === 0) {
        alert('Please add at least one location.');
        return;
      }
      // TODO: Implement API call to update forecast
      const updatedForecasts = emailForecasts.map(f => f.id === editingForecast.id ? editingForecast : f);
      setEmailForecasts(updatedForecasts);
      setEditingForecast(null);
    }
  };

  const handleDelete = async (id: number) => {
    // TODO: Implement API call to delete forecast
    const updatedForecasts = emailForecasts.filter((forecast) => forecast.id !== id);
    setEmailForecasts(updatedForecasts);
  };

  const handleAddLocation = () => {
    if (editingForecast) {
      setEditingForecast({
        ...editingForecast,
        locations: [...editingForecast.locations, ''],
      });
    } else {
      setNewForecast({
        ...newForecast,
        locations: [...newForecast.locations, ''],
      });
    }
  };

  const handleRemoveLocation = (index: number) => {
    if (editingForecast) {
      const updatedLocations = editingForecast.locations.filter((_, i) => i !== index);
      setEditingForecast({
        ...editingForecast,
        locations: updatedLocations,
      });
    } else {
      const updatedLocations = newForecast.locations.filter((_, i) => i !== index);
      setNewForecast({
        ...newForecast,
        locations: updatedLocations,
      });
    }
  };

  const handleLocationChange = (index: number, value: string) => {
    if (editingForecast) {
      const updatedLocations = [...editingForecast.locations];
      updatedLocations[index] = value;
      setEditingForecast({
        ...editingForecast,
        locations: updatedLocations,
      });
    } else {
      const updatedLocations = [...newForecast.locations];
      updatedLocations[index] = value;
      setNewForecast({
        ...newForecast,
        locations: updatedLocations,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Your Email Forecasts</h2>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Locations</th>
            <th className="py-3 px-4 text-left">Forecast Type</th>
            <th className="py-3 px-4 text-left">Frequency</th>
            <th className="py-3 px-4 text-left">Time Frame</th>
            <th className="py-3 px-4 text-left">Delivery</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {emailForecasts.map((forecast) => (
            <tr key={forecast.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-4">{forecast.locations.join(', ')}</td>
              <td className="py-3 px-4">{forecast.forecastType}</td>
              <td className="py-3 px-4">{forecast.frequency}</td>
              <td className="py-3 px-4">{forecast.timeFrame}</td>
              <td className="py-3 px-4">{`${forecast.deliveryDay} at ${forecast.deliveryTime}`}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => setEditingForecast(forecast)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(forecast.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={() => setShowAddForm(true)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center"
      >
        <Plus size={20} className="mr-2" />
        Add New Forecast
      </button>

      {(showAddForm || editingForecast) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h3 className="text-xl font-bold mb-4 text-blue-600">
              {editingForecast ? 'Edit Forecast' : 'Add New Forecast'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              editingForecast ? handleUpdateForecast() : handleAddForecast();
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                {(editingForecast ? editingForecast.locations : newForecast.locations).map((location, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => handleLocationChange(index, e.target.value)}
                      className="flex-grow px-3 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter location"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-r-full hover:bg-red-600 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center"
                >
                  <Plus size={20} className="mr-2" />
                  Add Location
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Type</label>
                <select
                  value={editingForecast ? editingForecast.forecastType : newForecast.forecastType}
                  onChange={(e) => editingForecast ? setEditingForecast({...editingForecast, forecastType: e.target.value as 'surf' | 'kitesurf'}) : setNewForecast({...newForecast, forecastType: e.target.value as 'surf' | 'kitesurf'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="surf">Surf</option>
                  <option value="kitesurf">Kitesurf</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={editingForecast ? editingForecast.frequency : newForecast.frequency}
                  onChange={(e) => editingForecast ? setEditingForecast({...editingForecast, frequency: e.target.value as 'Daily' | 'Weekly'}) : setNewForecast({...newForecast, frequency: e.target.value as 'Daily' | 'Weekly'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Frame</label>
                <select
                  value={editingForecast ? editingForecast.timeFrame : newForecast.timeFrame}
                  onChange={(e) => editingForecast ? setEditingForecast({...editingForecast, timeFrame: e.target.value as '3 Days' | '1 Week'}) : setNewForecast({...newForecast, timeFrame: e.target.value as '3 Days' | '1 Week'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="3 Days">Next 3 Days</option>
                  <option value="1 Week">Coming Week</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Day</label>
                <select
                  value={editingForecast ? editingForecast.deliveryDay : newForecast.deliveryDay}
                  onChange={(e) => editingForecast ? setEditingForecast({...editingForecast, deliveryDay: e.target.value}) : setNewForecast({...newForecast, deliveryDay: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                <input
                  type="time"
                  value={editingForecast ? editingForecast.deliveryTime : newForecast.deliveryTime}
                  onChange={(e) => editingForecast ? setEditingForecast({...editingForecast, deliveryTime: e.target.value}) : setNewForecast({...newForecast, deliveryTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editingForecast ? editingForecast.email : newForecast.email}
                  onChange={(e) => editingForecast ? setEditingForecast({...editingForecast, email: e.target.value}) : setNewForecast({...newForecast, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingForecast(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  {editingForecast ? 'Update' : 'Add'} Forecast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;