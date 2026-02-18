
export interface User {
  user_id: string;
  phone_number: string;
  name: string;
  avatar_url?: string;
  created_at: number;
}

export interface Ride {
  ride_id: string;
  admin_id: string;
  ride_name: string;
  center_lat: number;
  center_lng: number;
  radius_km: number;
  status: 'active' | 'completed';
  start_time: number;
  end_time?: number;
  rider_count: number;
}

export interface RideLocation {
  user_id: string;
  lat: number;
  lng: number;
  timestamp: number;
}

export interface RideStats {
  stat_id: string;
  ride_id: string;
  user_id: string;
  distance_km: number;
  moving_time_minutes: number;
  avg_speed: number;
  max_speed: number;
}

export enum FeedEventType {
  RIDE_STARTED = 'RIDE_STARTED',
  RIDER_JOINED = 'RIDER_JOINED',
  RIDE_COMPLETED = 'RIDE_COMPLETED',
  MILESTONE = 'MILESTONE'
}

export interface FeedEvent {
  event_id: string;
  event_type: FeedEventType;
  ride_id?: string;
  user_id?: string;
  message: string;
  timestamp: number;
}

export interface NearbyRider {
  name: string;
  distance: number;
  lat: number;
  lng: number;
}
