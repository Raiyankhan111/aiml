import { useState, useEffect, useCallback } from 'react';
import { fetchISSData, fetchAstrosData, fetchLocationName } from '../services/api';
import { calculateHaversineDistance } from '../utils/haversine';

export function useISSData() {
  const [positions, setPositions] = useState([]); // Last 15 positions
  const [speeds, setSpeeds] = useState([]); // Last 30 speeds
  const [astros, setAstros] = useState(null);
  const [locationName, setLocationName] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentISS = useCallback(async () => {
    try {
      const data = await fetchISSData();
      const newPos = {
        lat: parseFloat(data.iss_position.latitude),
        lon: parseFloat(data.iss_position.longitude),
        timestamp: data.timestamp
      };

      setPositions(prev => {
        const updated = [...prev, newPos].slice(-15);
        
        // Calculate speed if we have a previous position
        if (prev.length > 0) {
          const lastPos = prev[prev.length - 1];
          const dist = calculateHaversineDistance(lastPos.lat, lastPos.lon, newPos.lat, newPos.lon);
          const timeDiffHours = (newPos.timestamp - lastPos.timestamp) / 3600; // in hours
          const speed = timeDiffHours > 0 ? (dist / timeDiffHours) : 0;
          
          setSpeeds(prevSpeeds => [
            ...prevSpeeds, 
            { time: new Date(newPos.timestamp * 1000).toLocaleTimeString(), speed: Math.round(speed) }
          ].slice(-30));
        }
        
        return updated;
      });

      // Update location name
      const loc = await fetchLocationName(newPos.lat, newPos.lon);
      setLocationName(loc);
      
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch ISS data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAstros = useCallback(async () => {
    try {
      const data = await fetchAstrosData();
      setAstros(data);
    } catch (err) {
      console.error("Failed to fetch astronauts", err);
    }
  }, []);

  useEffect(() => {
    fetchCurrentISS();
    fetchAstros();

    const intervalId = setInterval(fetchCurrentISS, 15000);
    return () => clearInterval(intervalId);
  }, [fetchCurrentISS, fetchAstros]);

  return { 
    currentPosition: positions.length > 0 ? positions[positions.length - 1] : null,
    positions, 
    speeds, 
    astros, 
    locationName,
    loading, 
    error,
    refreshManual: fetchCurrentISS
  };
}
