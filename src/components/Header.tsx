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
    <>
      <header className=" fixed top-0 left-0 w-full z-50 px-2 sm:px-4 mt-2 sm:mt-4">
        <div className="max-w-[110rem] mx-auto bg-white/90 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl shadow-xl shadow-black/5">
          <div className="px-3 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4">

              {/* Left Section - Logo and Back Button */}
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-shrink-0">
                {isCreateTripPage && (
                  <button
                    onClick={() => router.back()}
                    className="group flex cursor-pointer items-center gap-1 sm:gap-2 text-gray-600 hover:text-indigo-600 transition-all duration-300 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-indigo-50"
                  >
                    <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px] group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-xs sm:text-sm font-medium hidden xs:block">Back</span>
                  </button>
                )}

                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                      <Globe size={16} className="sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <div className="min-w-0 flex-shrink">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 truncate">
                      {title}
                    </h1>
                    <p className="text-xs text-gray-500 hidden md:block truncate">Find your perfect travel companion</p>
                  </div>
                </div>
              </div>

              {/* Center Section - Search Bar */}
              {showSearch && !isCreateTripPage && (
                <div className="hidden lg:flex flex-1 max-w-md mx-4 xl:mx-8">
                  <div className={`relative w-full transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                    <Search
                      size={18}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400'
                        }`}
                    />
                    <input
                      type="text"
                      placeholder="Search destinations, trips..."
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

              {/* Right Section - Actions and Profile */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">

                {/* Create Trip Button */}
                {!isCreateTripPage && (
                  <Link href="/create-trip">
                    <button className="cursor-pointer flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 shadow hover:shadow-md hover:scale-105 text-xs sm:text-sm font-medium">
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Create</span>
                      <span className="hidden lg:inline">Trip</span>
                    </button>
                  </Link>
                )}

                {/* Search Button for Mobile */}
                {showSearch && !isCreateTripPage && (
                  <button className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg sm:rounded-xl transition-all duration-300">
                    <Search size={18} className="sm:w-5 sm:h-5" />
                  </button>
                )}

                {/* Desktop Profile Section */}
                {showProfile && (
                  <div className="hidden lg:flex items-center gap-3">
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
                      <div className="text-left min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">John Doe</p>
                        <p className="text-xs text-gray-500 truncate">Travel Explorer</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings Button for Tablet */}
                {showProfile && (
                  <button className="hidden md:block lg:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300">
                    <Settings size={20} />
                  </button>
                )}

                {/* Profile Avatar for Mobile/Tablet */}
                {showProfile && (
                  <div className="md:hidden flex items-center">
                    <Image
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg sm:rounded-xl transition-all duration-300"
                >
                  {isMenuOpen ? <X size={18} className="sm:w-5 sm:h-5" /> : <Menu size={18} className="sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Search Bar (when search is open) */}
            {showSearch && !isCreateTripPage && (
              <div className="lg:hidden mt-3 sm:mt-4">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
                  <Search
                    size={16}
                    className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-indigo-500' : 'text-gray-400'
                      }`}
                  />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`w-full pl-10 sm:pl-12 pr-10 py-2.5 sm:py-3 bg-gray-50 border rounded-lg sm:rounded-xl transition-all duration-300 placeholder-gray-500 text-sm ${isSearchFocused
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
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 max-w-7xl mx-auto">
            <nav className="bg-white/95 backdrop-blur-lg border border-white/20 shadow-lg rounded-xl p-4">
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Globe size={16} />
                    <span className="font-medium">Home</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/create-trip"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus size={16} />
                    <span className="font-medium">Create Trip</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                      alt="Profile"
                      width={16}
                      height={16}
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="font-medium">Profile</span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/settings');
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-left w-full text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                  >
                    <Settings size={16} />
                    <span className="font-medium">Settings</span>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};