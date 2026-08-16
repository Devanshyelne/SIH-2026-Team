export type Mode = 'normal' | 'accessibility';

export type Tab = 'home' | 'journey' | 'map' | 'coach' | 'profile';

export type Overlay = 'findMe' | 'exits' | 'medical' | 'crowd' | 'more' | null;

export type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Very High';

export type MapLayer = 'facilities' | 'crowd' | 'accessibility' | 'exits' | 'transport';

export type FacilityIconKey =
'ticket' |
'washroom' |
'food' |
'pharmacy' |
'hospital' |
'platform' |
'lift' |
'escalator' |
'fob' |
'police' |
'security' |
'waiting' |
'info' |
'parking' |
'exit' |
'bus' |
'auto' |
'taxi' |
'atm';

export interface Facility {
  id: string;
  name: string;
  category: string;
  icon: FacilityIconKey;
  zone: string;
  distanceM: number;
  walkMin: number;
  accessible: boolean;
  status: string;
  crowd?: CrowdLevel;
  x: number;
  y: number;
}

export interface Category {
  id: string;
  label: string;
  icon: FacilityIconKey;
}

export interface RoutePoint {
  x: number;
  y: number;
}

export interface NavTarget {
  id: string;
  label: string;
  sublabel: string;
  distanceM: number;
  minutes: number;
  accessible: boolean;
  crowd: CrowdLevel;
  steps: string[];
  path: RoutePoint[];
}

export interface ExitOption {
  id: string;
  name: string;
  side: string;
  distanceM: number;
  walkMin: number;
  crowd: CrowdLevel;
  note: string;
  x: number;
  y: number;
}

export interface CrowdArea {
  id: string;
  name: string;
  level: CrowdLevel;
  reason: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Coach {
  id: string;
  klass: string;
  aheadM: number;
  position: number;
}

export interface Hospital {
  id: string;
  name: string;
  km: number;
  driveMin: number;
  walkMin: number;
  note: string;
  emergency: boolean;
}