import React from 'react';
import { Header } from '@/components/Header';
import Dashboard from '@/components/Dashboard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-200 pt-32">
      <Header title="SplitStay" />
      <Dashboard />
    </div>
  );
}


