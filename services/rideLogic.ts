import { RideStats, RideLocation } from "../types";

export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Typed locations parameter with RideLocation interface
export const calculateMovingTime = (locations: RideLocation[]): number => {
  if (locations.length < 2) return 0;
  // Simple heuristic: distance/time > threshold
  // In a real app we'd filter out idle periods > 60s
  const start = locations[0].timestamp;
  const end = locations[locations.length - 1].timestamp;
  return Math.max(0, (end - start) / 60000);
};

// Typed generateStats function using RideLocation and returning RideStats
export const generateStats = (rideId: string, userId: string, locations: RideLocation[]): RideStats => {
  let totalDistance = 0;
  let maxSpeed = 0;
  
  for (let i = 1; i < locations.length; i++) {
    const d = haversineDistance(locations[i-1].lat, locations[i-1].lng, locations[i].lat, locations[i].lng);
    totalDistance += d;
    
    const timeSec = (locations[i].timestamp - locations[i-1].timestamp) / 1000;
    if (timeSec > 0) {
      const speed = (d * 3600) / timeSec; // km/h
      if (speed < 180 && speed > maxSpeed) maxSpeed = speed;
    }
  }

  const movingTime = calculateMovingTime(locations);
  const avgSpeed = movingTime > 0 ? (totalDistance / (movingTime / 60)) : 0;

  return {
    stat_id: crypto.randomUUID(),
    ride_id: rideId,
    user_id: userId,
    distance_km: parseFloat(totalDistance.toFixed(2)),
    moving_time_minutes: Math.round(movingTime),
    avg_speed: Math.round(avgSpeed),
    max_speed: Math.round(maxSpeed)
  };
};