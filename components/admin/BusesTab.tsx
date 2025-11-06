'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Pencil, Trash2, Navigation, MapPin } from 'lucide-react';

export default function BusesTab() {
  const { buses, students, addBus, updateBus, deleteBus } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBus, setEditingBus] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    driverName: '',
    currentLat: '',
    currentLng: '',
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const busData = {
      name: formData.name,
      driverName: formData.driverName,
      currentLat: parseFloat(formData.currentLat),
      currentLng: parseFloat(formData.currentLng),
      isActive: formData.isActive,
    };

    if (editingBus) {
      updateBus(editingBus, busData);
    } else {
      addBus({
        id: `bus${Date.now()}`,
        ...busData,
      });
    }

    resetForm();
  };

  const handleEdit = (bus: any) => {
    setEditingBus(bus.id);
    setFormData({
      name: bus.name,
      driverName: bus.driverName,
      currentLat: bus.currentLat.toString(),
      currentLng: bus.currentLng.toString(),
      isActive: bus.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const assignedStudents = students.filter((s) => s.busId === id);
    if (assignedStudents.length > 0) {
      alert(`Cannot delete bus. ${assignedStudents.length} students are assigned to this bus.`);
      return;
    }

    if (confirm('Are you sure you want to delete this bus?')) {
      deleteBus(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      driverName: '',
      currentLat: '',
      currentLng: '',
      isActive: true,
    });
    setEditingBus(null);
    setIsModalOpen(false);
  };

  const getBusStudentCount = (busId: string) => {
    return students.filter((s) => s.busId === busId).length;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bus Fleet Management</h2>
          <p className="text-gray-600 mt-1">Manage your bus fleet and driver assignments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Bus</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buses.map((bus) => (
          <div key={bus.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{bus.name}</h3>
                  <p className="text-gray-600 mt-1">{bus.driverName}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  bus.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {bus.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Navigation className="w-4 h-4 mr-2" />
                  <span>{getBusStudentCount(bus.id)} students assigned</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>
                    {bus.currentLat.toFixed(4)}, {bus.currentLng.toFixed(4)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(bus)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(bus.id)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">
                {editingBus ? 'Edit Bus' : 'Add New Bus'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bus Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Bus 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Driver Name</label>
                <input
                  type="text"
                  required
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Mike Wilson"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.currentLat}
                    onChange={(e) => setFormData({ ...formData, currentLat: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="40.7128"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={formData.currentLng}
                    onChange={(e) => setFormData({ ...formData, currentLng: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="-74.0060"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Bus is active
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  {editingBus ? 'Update Bus' : 'Add Bus'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
