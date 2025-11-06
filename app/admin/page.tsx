'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Bus as BusIcon, Map } from 'lucide-react';
import StudentsTab from '@/components/admin/StudentsTab';
import BusesTab from '@/components/admin/BusesTab';
import MapTab from '@/components/admin/MapTab';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'students' | 'buses' | 'map'>('students');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="flex items-center hover:bg-indigo-700 p-2 rounded">
            <ArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('students')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'students'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Students</span>
            </button>
            <button
              onClick={() => setActiveTab('buses')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'buses'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <BusIcon className="w-5 h-5" />
              <span>Buses</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'map'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Map className="w-5 h-5" />
              <span>Live Map</span>
            </button>
          </div>
        </div>

        <div>
          {activeTab === 'students' && <StudentsTab />}
          {activeTab === 'buses' && <BusesTab />}
          {activeTab === 'map' && <MapTab />}
        </div>
      </div>
    </div>
  );
}
