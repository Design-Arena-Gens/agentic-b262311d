'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { ArrowLeft, MapPin, Clock, CheckCircle, Circle, Navigation } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DriverPage() {
  const router = useRouter();
  const [selectedBusId, setSelectedBusId] = useState('bus1');
  const { students, buses, routes, toggleStudentPresence, markStudentArrived, recalculateRoute } = useStore();

  const currentBus = buses.find((b) => b.id === selectedBusId);
  const busStudents = students.filter((s) => s.busId === selectedBusId);
  const currentRoute = routes.find((r) => r.busId === selectedBusId);

  useEffect(() => {
    recalculateRoute(selectedBusId);
  }, [selectedBusId, students, recalculateRoute]);

  const presentStudents = busStudents.filter((s) => s.isPresent);
  const remainingStudents = presentStudents.filter((s) => !s.arrivedAt);
  const arrivedStudents = presentStudents.filter((s) => s.arrivedAt);

  const totalETA = remainingStudents.length * 5;

  const getStudentETA = (index: number) => {
    return (index + 1) * 5;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push('/')} className="flex items-center hover:bg-blue-700 p-2 rounded">
            <ArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Driver Dashboard</h1>
          <div className="text-right">
            <div className="text-sm opacity-90">Driver</div>
            <div className="font-semibold">{currentBus?.driverName}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Bus</label>
          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.name} - {bus.driverName}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Stops</p>
                <p className="text-3xl font-bold text-gray-800">{presentStudents.length}</p>
              </div>
              <MapPin className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="text-3xl font-bold text-orange-600">{remainingStudents.length}</p>
              </div>
              <Circle className="w-12 h-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total ETA</p>
                <p className="text-3xl font-bold text-green-600">{totalETA} min</p>
              </div>
              <Clock className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800">Student Attendance</h2>
            <p className="text-sm text-gray-600 mt-1">Mark students present to update route</p>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {busStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={student.isPresent || false}
                      onChange={() => toggleStudentPresence(student.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      disabled={!!student.arrivedAt}
                    />
                    <div>
                      <div className="font-medium text-gray-800">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {student.arrivedAt ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Arrived
                      </span>
                    ) : student.isPresent ? (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Present
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                        Absent
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800">Current Route</h2>
            <p className="text-sm text-gray-600 mt-1">Tap "Arrived" when you pick up each student</p>
          </div>
          <div className="p-6">
            {remainingStudents.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">All Students Picked Up!</h3>
                <p className="text-gray-600">Great job completing this route.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {remainingStudents.map((student, index) => (
                  <div key={student.id} className="border-l-4 border-blue-500 pl-4 py-4 bg-blue-50 rounded-r-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                        </div>
                        <div className="ml-11 space-y-2">
                          <div className="flex items-center text-gray-700">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm">{student.address}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm">ETA: {getStudentETA(index)} minutes</span>
                          </div>
                          <a
                            href={student.googleMapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Navigation className="w-4 h-4 mr-1" />
                            Open in Google Maps
                          </a>
                        </div>
                      </div>
                      <button
                        onClick={() => markStudentArrived(student.id)}
                        className="ml-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Arrived
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {arrivedStudents.length > 0 && (
          <div className="bg-white rounded-lg shadow mt-8">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800">Completed Pickups</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {arrivedStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-800">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.address}</div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(student.arrivedAt!).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
