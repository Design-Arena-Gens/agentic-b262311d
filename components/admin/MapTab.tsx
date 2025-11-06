'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { Loader } from '@googlemaps/js-api-loader';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function MapTab() {
  const { buses, students } = useStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useSimulation, setUseSimulation] = useState(true);

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!API_KEY || API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
          setUseSimulation(true);
          setIsLoading(false);
          return;
        }

        const loader = new Loader({
          apiKey: API_KEY,
          version: 'weekly',
        });

        await loader.load();

        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.006 },
          zoom: 12,
        });

        mapInstanceRef.current = map;

        updateMarkers();
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Using simulation mode.');
        setUseSimulation(true);
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && !useSimulation) {
      updateMarkers();
    }
  }, [buses, students]);

  const updateMarkers = () => {
    if (!mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    buses.forEach((bus) => {
      const marker = new google.maps.Marker({
        position: { lat: bus.currentLat, lng: bus.currentLng },
        map: mapInstanceRef.current,
        title: bus.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="padding: 8px;"><strong>${bus.name}</strong><br/>Driver: ${bus.driverName}</div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    students.forEach((student) => {
      const marker = new google.maps.Marker({
        position: { lat: student.lat, lng: student.lng },
        map: mapInstanceRef.current,
        title: student.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: student.arrivedAt ? '#10B981' : '#EF4444',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="padding: 8px;"><strong>${student.name}</strong><br/>${student.address}<br/>Status: ${
          student.arrivedAt ? 'Picked up' : 'Waiting'
        }</div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-12">
        <div className="flex flex-col items-center justify-center">
          <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (useSimulation) {
    return (
      <div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Simulation Mode</h3>
              <p className="text-sm text-yellow-700 mt-1">
                To view the live map, add your Google Maps API key to the <code className="bg-yellow-100 px-1 rounded">.env.local</code> file as{' '}
                <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800">Live Bus Tracking</h2>
            <p className="text-sm text-gray-600 mt-1">Real-time location of all buses and students</p>
          </div>

          <div className="p-6 space-y-6">
            {buses.map((bus) => {
              const busStudents = students.filter((s) => s.busId === bus.id);
              const pickedUp = busStudents.filter((s) => s.arrivedAt).length;
              const waiting = busStudents.filter((s) => s.isPresent && !s.arrivedAt).length;

              return (
                <div key={bus.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{bus.name}</h3>
                      <p className="text-gray-600">{bus.driverName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bus.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bus.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">{busStudents.length}</div>
                      <div className="text-sm text-gray-600">Total Students</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">{pickedUp}</div>
                      <div className="text-sm text-gray-600">Picked Up</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">{waiting}</div>
                      <div className="text-sm text-gray-600">Waiting</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Current Location</div>
                    <div className="font-mono text-sm text-gray-800">
                      Lat: {bus.currentLat.toFixed(6)}, Lng: {bus.currentLng.toFixed(6)}
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${bus.currentLat},${bus.currentLng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
                    >
                      View on Google Maps →
                    </a>
                  </div>

                  {waiting > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Pending Pickups</h4>
                      <div className="space-y-2">
                        {busStudents
                          .filter((s) => s.isPresent && !s.arrivedAt)
                          .map((student) => (
                            <div key={student.id} className="flex items-center justify-between bg-white border border-gray-200 rounded p-3">
                              <div>
                                <div className="font-medium text-gray-800">{student.name}</div>
                                <div className="text-sm text-gray-600">{student.address}</div>
                              </div>
                              <a
                                href={student.googleMapsLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-800"
                              >
                                View →
                              </a>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800">Live Bus Tracking</h2>
          <p className="text-sm text-gray-600 mt-1">
            Blue markers = Buses | Red markers = Waiting students | Green markers = Picked up students
          </p>
        </div>
        <div ref={mapRef} className="w-full h-[600px]" />
      </div>
    </div>
  );
}
