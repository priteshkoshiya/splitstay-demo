'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Search, Plus, Settings, Menu, X, Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'SplitStay',
  showSearch = true,
  showProfile = true
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pathname = usePathname();
  const router = useRouter();

  const isCreateTripPage = pathname === '/create-trip';

  return (
    <header className="fixed top-0 left-0 w-full z-50 mt-4">
      <div className="max-w-[110rem] mx-auto bg-white/90 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl shadow-black/5">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isCreateTripPage && (
                <button
                  onClick={() => router.back()}
                  className="group flex cursor-pointer items-center gap-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-indigo-50"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-sm font-medium hidden sm:block">Back</span>
                </button>
              )}

              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Globe size={20} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {title}
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Find your perfect travel companion</p>
                </div>
              </div>
            </div>

            {showSearch && !isCreateTripPage && (
              <div className="hidden md:flex flex-1 max-w-md mx-8">
                <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                  <Search
                    size={18}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400'
                      }`}
                  />
                  <input
                    type="text"
                    placeholder="Search destinations, trips, travelers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl transition-all duration-300 placeholder-gray-500 text-sm ${isSearchFocused
                      ? 'border-indigo-300 bg-white shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <X size={14} className="text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              {!isCreateTripPage && (
                <Link href="/create-trip">
                  <button className="cursor-pointer hidden sm:flex items-center border border-black/20 gap-2 bg-primary text-black px-4 py-2 rounded-xl transition-colors duration-300 shadow hover:shadow-md hover:bg-primary-dark text-sm font-medium">
                    <Plus size={16} />
                    Create Trip
                  </button>
                </Link>
              )}

              {showProfile && (
                <div className="hidden sm:flex items-center gap-3">
                  <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300">
                    <Settings size={20} />
                  </button>
                  <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2 transition-colors cursor-pointer">
                    <Image
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">John Doe</p>
                      <p className="text-xs text-gray-500">Travel Explorer</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
