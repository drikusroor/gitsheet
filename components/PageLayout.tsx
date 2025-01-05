import React from 'react';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="absolute inset-0 opacity-50 mix-blend-multiply bg-[url('/noise.png')] pointer-events-none" />
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
