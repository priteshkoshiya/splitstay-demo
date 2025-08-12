'use client';

import React, { useEffect, useState } from 'react';
import { TripCard } from '@/components/TripCard';
import type { Trip } from '@/types/trip';

export const Dashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/data/mockTrips.json');
        const json = await res.json();
        let local: Trip[] = [];
        try {
          local = JSON.parse(localStorage.getItem('postedTrips') || '[]');
        } catch {}
        const combined = [...local, ...json].sort((a, b) => {
          const aDate = new Date(a.createdAt || 0).getTime();
          const bDate = new Date(b.createdAt || 0).getTime();
          return bDate - aDate;
        });
        setTrips(combined);
      } catch {
        try {
          const local = JSON.parse(localStorage.getItem('postedTrips') || '[]');
          setTrips(local);
        } catch {
          setTrips([]);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-200">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-16 lg:px-20 pb-10">
      {trips.length === 0 ? (
        <div className="text-gray-500">
          No trips yet. Post one to see it here.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((t) => (
            <TripCard key={t.id} trip={t} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
