'use client';

import { useRouter } from 'next/navigation';
import { Bus, ShieldCheck } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Bus Routing System</h1>
          <p className="text-xl text-gray-600">Select your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <button
            onClick={() => router.push('/driver')}
            className="bg-white rounded-2xl shadow-xl p-12 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="bg-blue-500 rounded-full p-6 mb-6">
                <Bus className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Driver</h2>
              <p className="text-gray-600">View routes and manage student pickups</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/admin')}
            className="bg-white rounded-2xl shadow-xl p-12 hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300"
          >
            <div className="flex flex-col items-center">
              <div className="bg-indigo-500 rounded-full p-6 mb-6">
                <ShieldCheck className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin</h2>
              <p className="text-gray-600">Manage students, routes, and buses</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
