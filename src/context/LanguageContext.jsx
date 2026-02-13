import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    search: 'Search',
    trending: 'Trending',
    wishlist: 'Wishlist',
    
    // Search
    searchPlaceholder: 'Search for a city...',
    searchButton: 'Search',
    popularCities: 'Popular Cities',
    trendingDestinations: 'Trending Destinations',
    
    // City Details
    weather: 'Weather',
    hotels: 'Hotels',
    attractions: 'Attractions',
    bestTime: 'Best Time to Visit',
    budget: 'Budget',
    rating: 'Rating',
    reviews: 'reviews',
    contact: 'Contact',
    amenities: 'Amenities',
    
    // Actions
    saveToWishlist: 'Save to Wishlist',
    saved: 'Saved!',
    share: 'Share',
    like: 'Like',
    viewDetails: 'View Details',
    
    // Budget
    perNight: 'per night',
    from: 'From',
    low: 'Budget',
    medium: 'Standard',
    high: 'Luxury',
    
    // Weather
    temperature: 'Temperature',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    
    // Messages
    loading: 'Loading...',
    noResults: 'No results found',
    error: 'Something went wrong',
    searchSuccess: 'Searching for',
    savedSuccess: 'Added to wishlist!',
    
    // Time
    today: 'Today',
    tomorrow: 'Tomorrow',
    
    // Attractions
    timings: 'Timings',
    entryFee: 'Entry Fee',
    free: 'Free',
    address: 'Address'
  },
  hi: {
    home: 'होम',
    search: 'खोज',
    trending: 'ट्रेंडिंग',
    wishlist: 'विशलिस्ट',
    searchPlaceholder: 'शहर खोजें...',
    searchButton: 'खोजें',
    popularCities: 'लोकप्रिय शहर',
    trendingDestinations: 'ट्रेंडिंग स्थान',
    weather: 'मौसम',
    hotels: 'होटल',
    attractions: 'पर्यटन स्थल',
    bestTime: 'घूमने का सबसे अच्छा समय',
    budget: 'बजट',
    rating: 'रेटिंग',
    reviews: 'समीक्षाएं',
    contact: 'संपर्क',
    amenities: 'सुविधाएं',
    saveToWishlist: 'विशलिस्ट में सेव करें',
    saved: 'सेव हो गया!',
    share: 'शेयर करें',
    like: 'पसंद करें',
    viewDetails: 'विवरण देखें',
    perNight: 'प्रति रात',
    from: 'से',
    low: 'बजट',
    medium: 'स्टैंडर्ड',
    high: 'लक्जरी',
    temperature: 'तापमान',
    feelsLike: 'लगता है',
    humidity: 'नमी',
    windSpeed: 'हवा की गति',
    loading: 'लोड हो रहा है...',
    noResults: 'कोई परिणाम नहीं मिला',
    error: 'कुछ गलत हो गया',
    searchSuccess: 'खोज रहे हैं',
    savedSuccess: 'विशलिस्ट में जोड़ा गया!',
    timings: 'समय',
    entryFee: 'प्रवेश शुल्क',
    free: 'मुफ्त',
    address: 'पता'
  },
  mr: {
    home: 'होम',
    search: 'शोध',
    trending: 'ट्रेंडिंग',
    wishlist: 'विशलिस्ट',
    searchPlaceholder: 'शहर शोधा...',
    searchButton: 'शोधा',
    popularCities: 'लोकप्रिय शहरे',
    trendingDestinations: 'ट्रेंडिंग स्थळे',
    weather: 'हवामान',
    hotels: 'हॉटेल्स',
    attractions: 'पर्यटन स्थळे',
    bestTime: 'भेट देण्याची योग्य वेळ',
    budget: 'बजेट',
    rating: 'रेटिंग',
    reviews: 'पुनरावलोकने',
    contact: 'संपर्क',
    amenities: 'सुविधा',
    saveToWishlist: 'विशलिस्टमध्ये जतन करा',
    saved: 'जतन केले!',
    share: 'शेअर करा',
    like: 'लाइक करा',
    viewDetails: 'तपशील पहा',
    perNight: 'प्रति रात्र',
    from: 'पासून',
    low: 'बजेट',
    medium: 'स्टँडर्ड',
    high: 'लक्झरी',
    temperature: 'तापमान',
    feelsLike: 'असे वाटते',
    humidity: 'आर्द्रता',
    windSpeed: 'वाऱ्याचा वेग',
    loading: 'लोड होत आहे...',
    noResults: 'काहीही सापडले नाही',
    error: 'काहीतरी चूक झाली',
    searchSuccess: 'शोधत आहे',
    savedSuccess: 'विशलिस्टमध्ये जोडले!',
    timings: 'वेळ',
    entryFee: 'प्रवेश शुल्क',
    free: 'मोफत',
    address: 'पत्ता'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};