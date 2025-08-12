'use client';

import type React from "react";
import { useState } from "react";
import { Calendar, ExternalLink, Home, MapPin, Users, Heart, Share2, Star, Globe } from "lucide-react";

interface Trip {
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  isFlexible?: boolean;
  accommodationType: string;
  openToMatch: string;
  tripVibe?: string;
  accommodationLink?: string;
  userProfile: {
    name: string;
    photo: string;
    rating?: number;
    tripCount?: number;
  };
  price?: string;
  tags?: string[];
}

interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const [isLiked, setIsLiked] = useState(false);

  const mockTrip: Trip = {
    tripName: "Mountain Adventure Getaway",
    destination: "Swiss Alps, Switzerland",
    startDate: "Mar 15, 2024",
    endDate: "Mar 22, 2024",
    isFlexible: true,
    accommodationType: "Mountain Lodge",
    openToMatch: "Solo travelers & couples",
    tripVibe: "Adventure seekers who love hiking, cozy evenings by the fire, and stunning mountain views",
    accommodationLink: "https://example.com/booking",
    userProfile: {
      name: "Sarah Chen",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      tripCount: 12,
    },
    price: "$320/night",
    tags: ["Adventure", "Mountains", "Photography", "Hiking"],
  };

  const displayTrip = { ...mockTrip, ...trip };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe size={20} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{displayTrip.tripName}</h3>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-sm truncate">{displayTrip.destination}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              {typeof displayTrip.userProfile.rating !== "undefined" && (
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  <span className="font-medium">{displayTrip.userProfile.rating}</span>
                </div>
              )}
              {typeof displayTrip.userProfile.tripCount !== "undefined" && (
                <>
                  {typeof displayTrip.userProfile.rating !== "undefined" && <span>•</span>}
                  <span>{displayTrip.userProfile.tripCount} trips</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-1 ml-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-lg transition-colors ${isLiked ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500"
              }`}
          >
            <Heart size={16} className={isLiked ? "fill-current" : ""} />
          </button>
          <button className="p-2 rounded-lg bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4 flex-grow overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={14} className="text-purple-500" />
            <span className="text-sm">
              {displayTrip.startDate} - {displayTrip.endDate}
            </span>
          </div>
          {displayTrip.isFlexible && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Flexible</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Home size={14} className="text-orange-500" />
            <span className="text-sm">{displayTrip.accommodationType}</span>
          </div>
          {displayTrip.price && <span className="text-sm font-semibold text-gray-900">{displayTrip.price}</span>}
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Users size={14} className="text-indigo-500" />
          <span className="text-sm">{displayTrip.openToMatch}</span>
        </div>

        {displayTrip.tripVibe && (
          <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-600">
            <p className="text-sm text-gray-700 italic leading-relaxed">&quot;{displayTrip.tripVibe}&quot;</p>
          </div>
        )}

        {displayTrip.tags && displayTrip.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayTrip.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-3">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105">
            Join Trip
          </button>
          <button className="text-gray-500 text-sm font-medium hover:text-blue-600 transition-colors">
            View Details
          </button>
        </div>
        {displayTrip.accommodationLink && (
          <a
            href={displayTrip.accommodationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium group/link"
          >
            <ExternalLink
              size={14}
              className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
            />
            <span>View Stay</span>
          </a>
        )}
      </div>
    </div>
  );
};
