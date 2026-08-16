import type {
  Category,
  Coach,
  CrowdArea,
  ExitOption,
  Facility,
  Hospital,
  NavTarget } from
'../types/setu';

/**
 * Spatial model of Dadar Railway Station, simplified for indoor navigation.
 * Map viewBox is 0 0 340 560.
 * Western Railway platforms sit north, Central Railway platforms south,
 * joined by the middle concourse and two Foot Over Bridges.
 */
export const MAP_W = 340;
export const MAP_H = 560;

export const westernPlatforms = [
{ id: '1', y: 56, line: 'WR' },
{ id: '2', y: 86, line: 'WR' },
{ id: '3', y: 116, line: 'WR' },
{ id: '4', y: 146, line: 'WR' },
{ id: '5', y: 176, line: 'WR' }];


export const centralPlatforms = [
{ id: '6', y: 252, line: 'CR' },
{ id: '7', y: 282, line: 'CR' },
{ id: '8', y: 312, line: 'CR' }];


export const PLATFORM_X = 26;
export const PLATFORM_W = 288;
export const PLATFORM_H = 16;

/** Main (central) FOB and the east FOB used for alternate routing */
export const bridges = [
{ id: 'fob-main', label: 'Main FOB', x: 148, y: 40, w: 22, h: 350 },
{ id: 'fob-east', label: 'East FOB', x: 250, y: 40, w: 18, h: 300 }];


export const concourses = [
{ id: 'mid', label: 'Middle Concourse', x: 26, y: 202, w: 288, h: 34 },
{ id: 'south', label: 'South Concourse', x: 26, y: 340, w: 288, h: 34 }];


export const YOU_ARE_HERE = { x: 104, y: 219 };

export const categories: Category[] = [
{ id: 'ticket', label: 'Ticket Counter', icon: 'ticket' },
{ id: 'washroom', label: 'Washroom', icon: 'washroom' },
{ id: 'food', label: 'Food', icon: 'food' },
{ id: 'pharmacy', label: 'Pharmacy', icon: 'pharmacy' },
{ id: 'hospital', label: 'Hospital', icon: 'hospital' },
{ id: 'platform', label: 'Platform', icon: 'platform' },
{ id: 'lift', label: 'Lift', icon: 'lift' },
{ id: 'escalator', label: 'Escalator', icon: 'escalator' },
{ id: 'fob', label: 'Foot Over Bridge', icon: 'fob' },
{ id: 'police', label: 'Police', icon: 'police' },
{ id: 'security', label: 'Railway Security', icon: 'security' },
{ id: 'waiting', label: 'Waiting Room', icon: 'waiting' },
{ id: 'info', label: 'Information Desk', icon: 'info' },
{ id: 'parking', label: 'Parking', icon: 'parking' },
{ id: 'exit', label: 'Exit', icon: 'exit' },
{ id: 'bus', label: 'Bus Stand', icon: 'bus' },
{ id: 'auto', label: 'Auto Stand', icon: 'auto' },
{ id: 'taxi', label: 'Taxi', icon: 'taxi' }];


export const facilities: Facility[] = [
{
  id: 'wc-mid',
  name: 'Washroom — Middle Concourse',
  category: 'washroom',
  icon: 'washroom',
  zone: 'Middle Concourse, near Main FOB',
  distanceM: 120,
  walkMin: 2,
  accessible: true,
  status: 'Open',
  crowd: 'Moderate',
  x: 132,
  y: 219
},
{
  id: 'wc-p8',
  name: 'Washroom — Platform 8',
  category: 'washroom',
  icon: 'washroom',
  zone: 'Central Railway, Platform 8 north end',
  distanceM: 280,
  walkMin: 4,
  accessible: false,
  status: 'Open',
  crowd: 'Low',
  x: 60,
  y: 320
},
{
  id: 'tkt-west',
  name: 'Ticket Counter — Dadar West',
  category: 'ticket',
  icon: 'ticket',
  zone: 'Dadar West booking hall',
  distanceM: 90,
  walkMin: 2,
  accessible: true,
  status: '6 counters open',
  crowd: 'High',
  x: 52,
  y: 219
},
{
  id: 'tkt-east',
  name: 'Ticket Counter — Dadar East',
  category: 'ticket',
  icon: 'ticket',
  zone: 'Dadar East booking hall',
  distanceM: 240,
  walkMin: 4,
  accessible: true,
  status: '4 counters open',
  crowd: 'Moderate',
  x: 296,
  y: 219
},
{
  id: 'atvm',
  name: 'ATVM Smart Card Machines',
  category: 'ticket',
  icon: 'ticket',
  zone: 'South Concourse',
  distanceM: 190,
  walkMin: 3,
  accessible: true,
  status: '3 of 4 working',
  crowd: 'Low',
  x: 200,
  y: 357
},
{
  id: 'food-mid',
  name: 'Refreshment Stall',
  category: 'food',
  icon: 'food',
  zone: 'Middle Concourse, east side',
  distanceM: 160,
  walkMin: 3,
  accessible: true,
  status: 'Open until 11:30 PM',
  crowd: 'Moderate',
  x: 222,
  y: 219
},
{
  id: 'food-p1',
  name: 'Tea & Snacks — Platform 1',
  category: 'food',
  icon: 'food',
  zone: 'Western Railway, Platform 1',
  distanceM: 300,
  walkMin: 5,
  accessible: true,
  status: 'Open',
  crowd: 'Low',
  x: 96,
  y: 64
},
{
  id: 'pharm',
  name: 'Railway Pharmacy',
  category: 'pharmacy',
  icon: 'pharmacy',
  zone: 'Dadar East, near Exit B',
  distanceM: 210,
  walkMin: 3,
  accessible: true,
  status: 'Open 24 hrs',
  crowd: 'Low',
  x: 288,
  y: 240
},
{
  id: 'medroom',
  name: 'Station Medical Room',
  category: 'hospital',
  icon: 'hospital',
  zone: 'South Concourse, near Exit C',
  distanceM: 180,
  walkMin: 3,
  accessible: true,
  status: 'Staffed — first aid',
  crowd: 'Low',
  x: 272,
  y: 357
},
{
  id: 'lift-fob',
  name: 'Lift — Main FOB',
  category: 'lift',
  icon: 'lift',
  zone: 'Main FOB to Platforms 6–8',
  distanceM: 70,
  walkMin: 1,
  accessible: true,
  status: 'Working',
  crowd: 'Moderate',
  x: 159,
  y: 250
},
{
  id: 'lift-west',
  name: 'Lift — Dadar West Entrance',
  category: 'lift',
  icon: 'lift',
  zone: 'Dadar West, middle concourse',
  distanceM: 40,
  walkMin: 1,
  accessible: true,
  status: 'Working',
  crowd: 'Low',
  x: 76,
  y: 202
},
{
  id: 'esc-mid',
  name: 'Escalator — Platform 5',
  category: 'escalator',
  icon: 'escalator',
  zone: 'Western Railway, Platform 5',
  distanceM: 110,
  walkMin: 2,
  accessible: false,
  status: 'Upward only',
  crowd: 'High',
  x: 159,
  y: 184
},
{
  id: 'fob-main-f',
  name: 'Main Foot Over Bridge',
  category: 'fob',
  icon: 'fob',
  zone: 'Connects WR 1–5 and CR 6–8',
  distanceM: 60,
  walkMin: 1,
  accessible: true,
  status: 'Open',
  crowd: 'Very High',
  x: 159,
  y: 160
},
{
  id: 'fob-east-f',
  name: 'East Foot Over Bridge',
  category: 'fob',
  icon: 'fob',
  zone: 'Dadar East side crossing',
  distanceM: 200,
  walkMin: 3,
  accessible: true,
  status: 'Open',
  crowd: 'Low',
  x: 259,
  y: 160
},
{
  id: 'police',
  name: 'Government Railway Police',
  category: 'police',
  icon: 'police',
  zone: 'Middle Concourse, west side',
  distanceM: 100,
  walkMin: 2,
  accessible: true,
  status: 'Open 24 hrs',
  crowd: 'Low',
  x: 70,
  y: 236
},
{
  id: 'rpf',
  name: 'RPF Assistance Post',
  category: 'security',
  icon: 'security',
  zone: 'South Concourse',
  distanceM: 175,
  walkMin: 3,
  accessible: true,
  status: 'Open 24 hrs',
  crowd: 'Low',
  x: 120,
  y: 357
},
{
  id: 'wait',
  name: 'Upper Class Waiting Room',
  category: 'waiting',
  icon: 'waiting',
  zone: 'Platform 6, south end',
  distanceM: 230,
  walkMin: 4,
  accessible: true,
  status: 'Open — seats available',
  crowd: 'Low',
  x: 240,
  y: 260
},
{
  id: 'info',
  name: 'Station Information Desk',
  category: 'info',
  icon: 'info',
  zone: 'Middle Concourse, near Main FOB',
  distanceM: 85,
  walkMin: 2,
  accessible: true,
  status: 'Staffed',
  crowd: 'Moderate',
  x: 186,
  y: 202
},
{
  id: 'parking-w',
  name: 'Two-Wheeler Parking — Dadar West',
  category: 'parking',
  icon: 'parking',
  zone: 'Outside Exit A',
  distanceM: 260,
  walkMin: 4,
  accessible: true,
  status: '48 of 120 free',
  crowd: 'Moderate',
  x: 34,
  y: 254
},
{
  id: 'parking-e',
  name: 'Car Parking — Dadar East',
  category: 'parking',
  icon: 'parking',
  zone: 'Outside Exit B',
  distanceM: 320,
  walkMin: 5,
  accessible: true,
  status: '12 of 80 free',
  crowd: 'High',
  x: 312,
  y: 254
},
{
  id: 'bus',
  name: 'BEST Bus Depot — Dadar East',
  category: 'bus',
  icon: 'bus',
  zone: 'Outside Exit B',
  distanceM: 340,
  walkMin: 5,
  accessible: true,
  status: 'Routes 21, 44, 172',
  crowd: 'High',
  x: 312,
  y: 300
},
{
  id: 'auto',
  name: 'Auto Rickshaw Stand',
  category: 'auto',
  icon: 'auto',
  zone: 'Outside Exit C, Dadar East',
  distanceM: 300,
  walkMin: 5,
  accessible: false,
  status: 'Queue: approx. 6 min',
  crowd: 'Moderate',
  x: 312,
  y: 388
},
{
  id: 'plat-7',
  name: 'Platform 7 — Central Railway',
  category: 'platform',
  icon: 'platform',
  zone: 'Reached via Main FOB, lift or stairs',
  distanceM: 220,
  walkMin: 3,
  accessible: true,
  status: 'Next service 08:42',
  crowd: 'Low',
  x: 208,
  y: 290
},
{
  id: 'exit-b-f',
  name: 'Exit B — Dadar East',
  category: 'exit',
  icon: 'exit',
  zone: 'Dr. Ambedkar Road side',
  distanceM: 120,
  walkMin: 2,
  accessible: true,
  status: 'Open',
  crowd: 'High',
  x: 306,
  y: 200
},
{
  id: 'taxi',
  name: 'Prepaid Taxi Stand',
  category: 'taxi',
  icon: 'taxi',
  zone: 'Outside Exit A, Dadar West',
  distanceM: 280,
  walkMin: 4,
  accessible: true,
  status: 'Queue: approx. 3 min',
  crowd: 'Low',
  x: 34,
  y: 388
}];


export const exits: ExitOption[] = [
{
  id: 'exit-a',
  name: 'Exit A',
  side: 'Dadar West — Ranade Road',
  distanceM: 220,
  walkMin: 3,
  crowd: 'Low',
  note: 'Taxi stand and west market side.',
  x: 30,
  y: 219
},
{
  id: 'exit-b',
  name: 'Exit B',
  side: 'Dadar East — Dr. Ambedkar Road',
  distanceM: 120,
  walkMin: 2,
  crowd: 'Moderate',
  note: 'Closest to your destination.',
  x: 310,
  y: 219
},
{
  id: 'exit-c',
  name: 'Exit C',
  side: 'Dadar East — South Concourse',
  distanceM: 350,
  walkMin: 5,
  crowd: 'High',
  note: 'Auto stand, bus depot connection.',
  x: 310,
  y: 357
}];


export const crowdAreas: CrowdArea[] = [
{
  id: 'c-p1',
  name: 'Platform 1',
  level: 'Moderate',
  reason: 'Slow-moving boarding queue',
  x: PLATFORM_X,
  y: 52,
  w: PLATFORM_W,
  h: 24
},
{
  id: 'c-p5',
  name: 'Platform 5',
  level: 'High',
  reason: 'Two services within 4 minutes',
  x: PLATFORM_X,
  y: 172,
  w: PLATFORM_W,
  h: 24
},
{
  id: 'c-fob',
  name: 'Main Foot Over Bridge',
  level: 'Very High',
  reason: 'Festival movement towards Dadar East',
  x: 146,
  y: 40,
  w: 26,
  h: 350
},
{
  id: 'c-p7',
  name: 'Platform 7',
  level: 'Low',
  reason: 'Next service in 11 minutes',
  x: PLATFORM_X,
  y: 278,
  w: PLATFORM_W,
  h: 24
},
{
  id: 'c-exitb',
  name: 'Exit B',
  level: 'High',
  reason: 'Ganpati procession on Dr. Ambedkar Road',
  x: 282,
  y: 200,
  w: 32,
  h: 40
}];


export const coaches: Coach[] = [
{ id: 'D1', klass: 'General', aheadM: 20, position: 0 },
{ id: 'D2', klass: 'Ladies', aheadM: 35, position: 1 },
{ id: 'D3', klass: 'Second Class', aheadM: 50, position: 2 },
{ id: 'D4', klass: 'Second Class', aheadM: 62, position: 3 },
{ id: 'D5', klass: 'AC', aheadM: 74, position: 4 },
{ id: 'D6', klass: 'General', aheadM: 82, position: 5 },
{ id: 'FC', klass: 'First Class', aheadM: 90, position: 6 }];


export const coachClasses = ['General', 'Second Class', 'First Class', 'Ladies', 'AC'];

export const hospitals: Hospital[] = [
{
  id: 'h1',
  name: 'Shushrusha Citizens Hospital',
  km: 1.2,
  driveMin: 5,
  walkMin: 15,
  note: '24 hr casualty · Cardiac unit',
  emergency: true
},
{
  id: 'h2',
  name: 'Sion Municipal Hospital',
  km: 3.4,
  driveMin: 12,
  walkMin: 42,
  note: 'Government · Trauma centre',
  emergency: true
},
{
  id: 'h3',
  name: 'Ruby Hall Polyclinic, Dadar East',
  km: 0.9,
  driveMin: 4,
  walkMin: 11,
  note: 'OPD only · Closes 9 PM',
  emergency: false
}];


/** Route to the (possibly changed) departure platform */
export function platformRoute(platform: string, accessible: boolean): NavTarget {
  return {
    id: `platform-${platform}`,
    label: `Platform ${platform}`,
    sublabel: 'Departure platform · Central Railway',
    distanceM: accessible ? 240 : 220,
    minutes: accessible ? 4 : 3,
    accessible,
    crowd: 'Moderate',
    steps: accessible ?
    [
    'Walk straight for 40 metres along the middle concourse.',
    'Lift ahead on your right. Take the lift to the Foot Over Bridge.',
    'Continue 60 metres along the accessible corridor.',
    `Take the lift down to Platform ${platform}.`,
    `You have arrived at Platform ${platform}.`] :

    [
    'Walk straight for 80 metres.',
    'Turn right toward the Foot Over Bridge.',
    'Cross the bridge for 60 metres.',
    `Take the stairs down to Platform ${platform}.`,
    `You have arrived at Platform ${platform}.`],

    path: [
    { x: 104, y: 219 },
    { x: 159, y: 219 },
    { x: 159, y: 290 },
    { x: 208, y: 290 }]

  };
}

export const alternateRoute: NavTarget = {
  id: 'platform-7-alt',
  label: 'Platform 7 · via East FOB',
  sublabel: 'Alternate route — lower crowd',
  distanceM: 290,
  minutes: 5,
  accessible: true,
  crowd: 'Low',
  steps: [
  'Walk straight for 120 metres towards Dadar East.',
  'Turn right at the Information Desk towards the East Foot Over Bridge.',
  'Cross the East bridge for 70 metres.',
  'Take the lift down to Platform 7.',
  'You have arrived at Platform 7.'],

  path: [
  { x: 104, y: 219 },
  { x: 259, y: 219 },
  { x: 259, y: 290 },
  { x: 214, y: 290 }]

};

export const emergencyRoutes: NavTarget[] = [
{
  id: 'route-a',
  label: 'Route A · South Concourse',
  sublabel: 'Low crowd',
  distanceM: 200,
  minutes: 3,
  accessible: true,
  crowd: 'Low',
  steps: [
  'Walk straight 60 metres to the South Concourse.',
  'Continue east past the RPF post.',
  'Take the ramp up to Platform 7.'],

  path: [
  { x: 104, y: 219 },
  { x: 104, y: 357 },
  { x: 200, y: 357 },
  { x: 200, y: 290 }]

},
{
  id: 'route-b',
  label: 'Route B · Main FOB',
  sublabel: 'Moderate crowd',
  distanceM: 220,
  minutes: 4,
  accessible: false,
  crowd: 'Moderate',
  steps: [
  'Walk straight for 80 metres.',
  'Turn right toward the Main Foot Over Bridge.',
  'Take the stairs down to Platform 7.'],

  path: [
  { x: 104, y: 219 },
  { x: 159, y: 219 },
  { x: 159, y: 290 },
  { x: 208, y: 290 }]

},
{
  id: 'route-c',
  label: 'Route C · East FOB',
  sublabel: 'Low crowd',
  distanceM: 290,
  minutes: 5,
  accessible: true,
  crowd: 'Low',
  steps: [
  'Walk straight 120 metres towards Dadar East.',
  'Cross the East Foot Over Bridge.',
  'Take the lift down to Platform 7.'],

  path: [
  { x: 104, y: 219 },
  { x: 259, y: 219 },
  { x: 259, y: 290 },
  { x: 214, y: 290 }]

}];


export function facilityTarget(f: Facility, accessible: boolean): NavTarget {
  return {
    id: f.id,
    label: f.name,
    sublabel: f.zone,
    distanceM: f.distanceM,
    minutes: f.walkMin,
    accessible: f.accessible && accessible,
    crowd: f.crowd ?? 'Low',
    steps: accessible ?
    [
    `Walk straight for ${Math.round(f.distanceM / 3)} metres.`,
    'Lift ahead on your right. Take the lift if a level change is needed.',
    `Continue towards ${f.name}.`,
    `You have arrived at ${f.name}.`] :

    [
    `Walk straight for ${Math.round(f.distanceM / 3)} metres.`,
    `Turn towards ${f.zone}.`,
    `Continue for ${Math.round(f.distanceM / 3)} metres.`,
    `You have arrived at ${f.name}.`],

    path: [
    { x: 104, y: 219 },
    { x: f.x, y: 219 },
    { x: f.x, y: f.y }]

  };
}

export function exitTarget(e: ExitOption): NavTarget {
  return {
    id: e.id,
    label: e.name,
    sublabel: e.side,
    distanceM: e.distanceM,
    minutes: e.walkMin,
    accessible: true,
    crowd: e.crowd,
    steps: [
    `Walk straight for ${Math.round(e.distanceM / 2)} metres along the concourse.`,
    `Follow signage for ${e.name}.`,
    `You have arrived at ${e.name}.`],

    path: [
    { x: 104, y: 219 },
    { x: e.x, y: 219 },
    { x: e.x, y: e.y }]

  };
}

export const hospitalTarget: NavTarget = {
  id: 'hospital',
  label: 'Shushrusha Citizens Hospital',
  sublabel: 'Nearest 24 hr casualty · 1.2 km',
  distanceM: 1200,
  minutes: 5,
  accessible: true,
  crowd: 'Low',
  steps: [
  'Leave the station by Exit A, Dadar West.',
  'Prepaid taxi stand is 40 metres ahead on your left.',
  'Hospital is 1.2 km — approximately 5 minutes by vehicle.'],

  path: [
  { x: 104, y: 219 },
  { x: 30, y: 219 },
  { x: 30, y: 420 }]

};