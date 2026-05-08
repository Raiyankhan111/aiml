import axios from 'axios';

// ISS APIs
const ISS_URL = 'http://api.open-notify.org/iss-now.json';
const ASTROS_URL = 'http://api.open-notify.org/astros.json';

export const fetchISSData = async () => {
  const response = await axios.get(ISS_URL);
  return response.data;
};

export const fetchAstrosData = async () => {
  const response = await axios.get(ASTROS_URL);
  return response.data;
};

// News API
// Note: We use the "everything" endpoint and filter by science/space to keep it somewhat relevant,
// but for a general dashboard we might just use 'top-headlines'.
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const NEWS_URL = 'https://newsapi.org/v2/top-headlines';

export const fetchNewsData = async (category = 'technology') => {
  if (!NEWS_API_KEY) {
    throw new Error("VITE_NEWS_API_KEY is not defined in environment variables.");
  }
  
  const response = await axios.get(NEWS_URL, {
    params: {
      category,
      language: 'en',
      pageSize: 10,
      apiKey: NEWS_API_KEY
    }
  });
  
  return response.data.articles;
};

// Reverse Geocoding (to get "nearest place/ocean")
// We can use a free API like Nominatim from OpenStreetMap or open-meteo
export const fetchLocationName = async (lat, lon) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
        zoom: 3 // get country/ocean level
      }
    });
    
    if (response.data && response.data.display_name) {
      // Split and return just the first few parts to keep it brief
      return response.data.display_name.split(',').slice(0, 2).join(', ');
    }
    return "Ocean / Unmapped area";
  } catch (error) {
    console.error("Geocoding error", error);
    return "Ocean / Unknown";
  }
};
