'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Camera, CheckCircle, ExternalLink, FileText, Home, MapPin } from 'lucide-react';
import type { Trip, TripDraftForm } from '@/types/trip';
import Select from 'react-select';
import { Languages, Smile, Users } from 'lucide-react';
import { TripCard } from '@/components/TripCard';
import { getStaticCities, searchCitiesWithMapbox } from '@/lib/mapbox';

const accommodationTypes = ['Hotel', 'Hostel', 'Airbnb', 'Villa', 'Resort', 'Apartment', 'Guesthouse'];
const defaultLanguages = ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Mandarin', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian'];

const initialForm: TripDraftForm = {
  tripName: '',
  destination: '',
  startDate: '',
  endDate: '',
  isFlexible: false,
  languagesSpoken: [],
  openToMatch: 'anyone',
  tripVibe: '',
  accommodationType: '',
  accommodationLink: '',
  personalNote: '',
  userProfile: {
    id: 'u1',
    name: 'Alex Johnson',
    photo: '/api/placeholder/80/80',
    languages: ['English', 'Spanish', 'French'],
  },
};

export const PostTripWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [form, setForm] = useState<TripDraftForm>(initialForm);
  const [showPosted, setShowPosted] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const steps = useMemo(() => [1, 2, 3, 4], []);
  const [query, setQuery] = useState(form.destination);
  const [cityOptions, setCityOptions] = useState<{ label: string; value: string; }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const updateForm = (partial: Partial<TripDraftForm>) => {
    setForm((prev) => ({ ...prev, ...partial }));
    const newErrors = { ...errors };
    Object.keys(partial).forEach(key => {
      if (newErrors[key]) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const validateStep1 = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (!form.tripName.trim()) {
      stepErrors.tripName = 'Trip name is required';
    }

    if (!form.destination.trim()) {
      stepErrors.destination = 'Destination is required';
    }

    if (!form.startDate) {
      stepErrors.startDate = 'Start date is required';
    }

    if (!form.endDate) {
      stepErrors.endDate = 'End date is required';
    }

    if (form.startDate && form.endDate && form.startDate >= form.endDate) {
      stepErrors.endDate = 'End date must be after start date';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (!form.accommodationType) {
      stepErrors.accommodationType = 'Accommodation type is required';
    }
    if (!form.price) {
      stepErrors.price = 'Price is required';
    }
    if (!form.accommodationLink.trim()) {
      stepErrors.accommodationLink = 'Accommodation link is required';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (!form.languagesSpoken.length) {
      stepErrors.languagesSpoken = 'At least one language is required';
    }

    if (!form.openToMatch) {
      stepErrors.openToMatch = 'Please select who you are open to match with';
    }

    if (!form.tripVibe.trim()) {
      stepErrors.tripVibe = 'Trip vibe/description is required';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setCurrentStep((s) => Math.min(steps.length, s + 1));
    }
  };

  const submitTrip = () => {
    if (validateStep1() && validateStep2() && validateStep3()) {
      const newTrip: Trip = {
        ...form,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      try {
        const existing = JSON.parse(localStorage.getItem('postedTrips') || '[]');
        const updated = [newTrip, ...existing];
        localStorage.setItem('postedTrips', JSON.stringify(updated));
      } catch { }
      setShowPosted(true);
    }
  };

  useEffect(() => {
    setCityOptions(getStaticCities().map((c) => ({ value: c.name, label: c.name })));
  }, []);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!query) {
        setCityOptions(getStaticCities().map((c) => ({ value: c.name, label: c.name })));
        return;
      }
      setIsSearching(true);
      const results = await searchCitiesWithMapbox(query);
      setCityOptions(
        (results.length > 0 ? results : getStaticCities()).map((c) => ({
          value: c.name,
          label: c.name,
        }))
      );
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(id);
  }, [query]);

  if (showPosted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Trip Posted Successfully!</h2>
            <p className="text-gray-600">Your trip is now live and visible to other travelers</p>
          </div>
        </div>
      </div>
    );
  }

  const languageOptions = defaultLanguages.map((lang) => ({ value: lang, label: lang }));
  const cardTrip = {
    tripName: form.tripName,
    destination: form.destination,
    startDate: form.startDate,
    endDate: form.endDate,
    isFlexible: form.isFlexible,
    accommodationType: form.accommodationType,
    openToMatch: form.openToMatch,
    tripVibe: form.tripVibe,
    accommodationLink: form.accommodationLink,
    userProfile: {
      name: form.userProfile.name,
      photo: form.userProfile.photo,
    },
    price: form.price,
    tags: form.languagesSpoken,
  };
  const options = accommodationTypes.map((type) => ({
    value: type,
    label: type,
  }));

  return (
    <div className="max-w-4xl mx-auto mt-5">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center ">
          {steps.map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step === currentStep
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : step < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                  }`}
              >
                {step < currentStep ? <CheckCircle size={16} /> : step}
              </div>
              {step < steps.length && (
                <div
                  className={`w-12 h-1 mx-1 rounded transition-all ${step < currentStep ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-4 lg:mb-6 text-center">Post a Trip</h2>

        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-md font-medium text-gray-800">
                Trip Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.tripName}
                onChange={(e) => updateForm({ tripName: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${errors.tripName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                placeholder="e.g., Manila Adventure"
              />
              {errors.tripName && (
                <p className="mt-2 text-sm text-red-600">{errors.tripName}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-md font-medium text-gray-800">
                <MapPin className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                Destination <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.destination ? { value: form.destination, label: form.destination } : null}
                options={cityOptions}
                onInputChange={(input) => setQuery(input)}
                onChange={(selected) => {
                  updateForm({ destination: selected?.value || '' });
                  setQuery(selected?.value || '');
                }}
                isLoading={isSearching}
                placeholder="Search or pick a city"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: errors.destination ? '#ef4444' : base.borderColor,
                    '&:hover': {
                      borderColor: errors.destination ? '#ef4444' : base.borderColor,
                    },
                  }),
                }}
              />
              {errors.destination && (
                <p className="mt-2 text-sm text-red-600">{errors.destination}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-md font-medium text-gray-800 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateForm({ startDate: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${errors.startDate
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                />
                {errors.startDate && (
                  <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-md font-medium text-gray-800 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateForm({ endDate: e.target.value })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${errors.endDate
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                    }`}
                />
                {errors.endDate && (
                  <p className="mt-2 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-50">
              <input
                type="checkbox"
                id="flexible"
                checked={form.isFlexible}
                onChange={(e) => updateForm({ isFlexible: e.target.checked })}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="flexible"
                className="flex items-center text-sm font-medium text-gray-700 cursor-pointer"
              >
                <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
                <span className="text-base font-medium">I&apos;m flexible with dates</span>
              </label>
            </div>

            {form.isFlexible && (
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                <p className="text-sm text-amber-700">
                  💡 <strong>Great choice!</strong> Being flexible with dates makes you more likely to
                  find travel companions and better deals.
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 mb-2 text-md font-medium text-gray-800">
                <Home className="w-5 h-5 text-green-500" aria-hidden="true" />
                <span>
                  Accommodation Type <span className="text-red-500">*</span>
                </span>
              </label>
              <Select
                options={options}
                value={options.find((opt) => opt.value === form.accommodationType) || null}
                onChange={(selected) => updateForm({ accommodationType: selected?.value || '' })}
                placeholder="Select accommodation type"
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: errors.accommodationType ? '#ef4444' : base.borderColor,
                    '&:hover': {
                      borderColor: errors.accommodationType ? '#ef4444' : base.borderColor,
                    },
                  }),
                }}
              />
              {errors.accommodationType && (
                <p className="mt-2 text-sm text-red-600">{errors.accommodationType}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-md font-medium text-gray-800">
                <ExternalLink className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                <span>
                  Accommodation Link <span className="text-red-500">*</span>
                </span>
              </label>

              <input
                type="url"
                value={form.accommodationLink}
                onChange={(e) => updateForm({ accommodationLink: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${errors.accommodationLink
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                placeholder="Paste Booking.com or Airbnb link"
              />
              {errors.accommodationLink && (
                <p className="mt-2 text-sm text-red-600">{errors.accommodationLink}</p>
              )}
              {form.accommodationLink && !errors.accommodationLink && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 text-green-700">
                    <Camera size={16} />
                    <span className="text-sm">
                      Ready to extract accommodation photos and details
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-md font-medium text-gray-800">
                <span className="w-5 h-5 inline-flex items-center justify-center text-green-600">$</span>
                <span>Estimated Price / Night  <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                value={form.price || ''}
                onChange={(e) => updateForm({ price: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${errors.price
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                placeholder="$120 / night"
              />
              {errors.price && (
                <p className="mt-2 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-md font-medium text-gray-800">
                <FileText className="w-5 h-5 text-purple-500" aria-hidden="true" />
                <span>Personal Note</span>
              </label>

              <textarea
                value={form.personalNote}
                onChange={(e) => updateForm({ personalNote: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                rows={4}
                placeholder="e.g. I'll be staying at XYZ Hotel, 2 minutes from the beach!"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 mb-2 text-md font-medium text-gray-800">
                <Languages className="inline w-5 h-5 text-blue-500" />
                <span>
                  Languages Spoken <span className="text-red-500">*</span>
                </span>
              </label>
              <Select
                isMulti
                options={languageOptions}
                value={languageOptions.filter((option) =>
                  form.languagesSpoken.includes(option.value)
                )}
                onChange={(selected) => {
                  updateForm({ languagesSpoken: selected.map((option) => option.value) });
                }}
                className="text-sm"
                classNamePrefix="react-select"
                placeholder="Select languages..."
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: errors.languagesSpoken ? '#ef4444' : base.borderColor,
                    '&:hover': {
                      borderColor: errors.languagesSpoken ? '#ef4444' : base.borderColor,
                    },
                  }),
                }}
              />
              {errors.languagesSpoken && (
                <p className="mt-2 text-sm text-red-600">{errors.languagesSpoken}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-md font-medium text-gray-800">
                <Users className="inline w-5 h-5 text-purple-500" />
                <span>
                  Open to Match With <span className="text-red-500">*</span>
                </span>
              </label>
              <div className="flex items-center gap-6">
                {['male', 'female', 'anyone'].map((option) => (
                  <label key={option} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="openToMatch"
                      value={option}
                      checked={form.openToMatch === option}
                      onChange={(e) =>
                        updateForm({ openToMatch: e.target.value as typeof form.openToMatch })
                      }
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm">{option[0].toUpperCase() + option.slice(1)}</span>
                  </label>
                ))}
              </div>
              {errors.openToMatch && (
                <p className="mt-2 text-sm text-red-600">{errors.openToMatch}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-md font-medium text-gray-800">
                <Smile className="inline w-5 h-5 text-orange-500" />
                <span>
                  Trip Vibe / Description <span className="text-red-500">*</span>
                </span>
              </label>

              <textarea
                value={form.tripVibe}
                onChange={(e) => updateForm({ tripVibe: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all resize-none ${errors.tripVibe
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-indigo-500 focus:border-transparent'
                  }`}
                rows={4}
                placeholder="e.g. I'm chill, want to explore and relax - not looking to party"
              />
              {errors.tripVibe && (
                <p className="mt-2 text-sm text-red-600">{errors.tripVibe}</p>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <TripCard trip={cardTrip} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Trip Name</p>
                <p className="font-medium text-gray-800">{form.tripName || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Destination</p>
                <p className="font-medium text-gray-800">{form.destination || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Dates</p>
                <p className="font-medium text-gray-800">{form.startDate || '—'} — {form.endDate || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Flexible</p>
                <p className="font-medium text-gray-800">{form.isFlexible ? 'Yes' : 'No'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Open To Match</p>
                <p className="font-medium text-gray-800">{form.openToMatch}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Languages</p>
                <p className="font-medium text-gray-800">{form.languagesSpoken.length ? form.languagesSpoken.join(', ') : '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Accommodation Type</p>
                <p className="font-medium text-gray-800">{form.accommodationType || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Accommodation Link</p>
                {form.accommodationLink ? (
                  <a href={form.accommodationLink} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all">
                    {form.accommodationLink}
                  </a>
                ) : (
                  <p className="font-medium text-gray-800">—</p>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-500">Estimated Price / Night</p>
                <p className="font-medium text-gray-800">{form.price || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                <p className="text-gray-500">Personal Note</p>
                <p className="font-medium text-gray-800 whitespace-pre-wrap">{form.personalNote || '—'}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-between mt-8 gap-4">
          <button
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 w-full bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {currentStep < steps.length ? (
            <button
              onClick={handleNextStep}
              className="px-8 py-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitTrip}
              className="px-8 py-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Confirm & Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostTripWizard;