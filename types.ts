
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
  status: 'upcoming' | 'active' | 'completed';
  visibility: 'public' | 'private';
  start_time: number;
  end_time?: number;
  rider_count: number;
  pending_requests?: string[]; // user_ids
  joined_rider_ids: string[];
  
  // WhatsApp Style Metadata
  // Added host_name to support display names for ride admins in discovery and alerts
  host_name?: string;
  description?: string;
  itinerary?: string;
  date?: string;
  meeting_point?: string;
  destination?: string;
  breakfast_point?: string;
  assembling_time?: string;
  briefing_time?: string;
  departure_time?: string;
  reg_fee?: number;
  gears_mandatory?: boolean;
  admin_contact?: string;
  total_distance?: string;
  static_map_url?: string;
}

export interface RideLocation {
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

export interface Challenge {
  id: string;
  title: string;
  imageUrl: string;
  participants: number;
  daysLeft: number;
}

export interface Vehicle {
  id: string;
  model: string;
  year: string;
  nickname?: string;
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

export type AppView = 'auth' | 'pulse' | 'quests' | 'explore' | 'profile' | 'help' | 'live' | 'stats' | 'create_ride';
