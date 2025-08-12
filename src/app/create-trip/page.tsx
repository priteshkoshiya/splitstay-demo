import React from 'react';
import { Header } from '@/components/Header';
import PostTripWizard from '@/components/PostTripWizard';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-purple-200 pt-20 sm:pt-28 md:pt-32 px-4 sm:px-6 lg:px-8">
      <Header title="SplitStay" />
      <main className="max-w-[110rem] mx-auto">
        <PostTripWizard />
      </main>
    </div>
  );
}
