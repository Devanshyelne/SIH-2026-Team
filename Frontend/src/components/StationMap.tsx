import React from 'react';
import {
  MAP_H,
  MAP_W,
  PLATFORM_H,
  PLATFORM_W,
  PLATFORM_X,
  YOU_ARE_HERE,
  bridges,
  centralPlatforms,
  concourses,
  crowdAreas,
  exits,
  facilities,
  westernPlatforms } from
'../data/station';
import type { MapLayer, NavTarget } from '../types/setu';

const CROWD_FILL: Record<string, string> = {
  Low: '#22A06B',
  Moderate: '#F5B942',
  High: '#D64545',
  'Very High': '#D64545'
};

const facilityLayer: Record<string, MapLayer> = {
  washroom: 'facilities',
  ticket: 'facilities',
  food: 'facilities',
  pharmacy: 'facilities',
  hospital: 'facilities',
  info: 'facilities',
  waiting: 'facilities',
  police: 'facilities',
  security: 'facilities',
  lift: 'accessibility',
  escalator: 'accessibility',
  fob: 'accessibility',
  parking: 'transport',
  bus: 'transport',
  auto: 'transport',
  taxi: 'transport'
};

interface Props {
  layers: Record<MapLayer, boolean>;
  route?: NavTarget | null;
  highlightPlatform?: string;
  destination?: {x: number;y: number;label: string;} | null;
  compact?: boolean;
  recenterFlash?: boolean;
}

export function StationMap({
  layers,
  route,
  highlightPlatform,
  destination,
  compact,
  recenterFlash,
}: Props) {
  const points = route?.path.map((p) => `${p.x},${p.y}`).join(' ');
  const end = route?.path[route.path.length - 1];

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className="w-full h-full"
      role="img"
      aria-label="Indoor map of Dadar Railway Station"
      preserveAspectRatio="xMidYMid meet">
      
      <rect width={MAP_W} height={MAP_H} fill="#EDF1F6" />

      {/* Station envelope */}
      <rect
        x={16}
        y={30}
        width={308}
        height={360}
        rx={10}
        fill="#FFFFFF"
        stroke="#CBD5E1" />
      

      {/* Group labels */}
      <text x={22} y={24} fontSize={9} fill="#64748B" fontFamily="Inter" fontWeight={600}>
        WESTERN RAILWAY
      </text>
      <text x={22} y={246} fontSize={9} fill="#64748B" fontFamily="Inter" fontWeight={600}>
        CENTRAL RAILWAY
      </text>

      {/* Concourses */}
      {concourses.map((c) =>
      <g key={c.id}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="#F1F5F9" />
          <text
          x={c.x + 6}
          y={c.y + 13}
          fontSize={8}
          fill="#94A3B8"
          fontFamily="Inter"
          letterSpacing="0.06em">
          
            {c.label.toUpperCase()}
          </text>
        </g>
      )}

      {/* Platforms */}
      {[...westernPlatforms, ...centralPlatforms].map((p) => {
        const active = highlightPlatform === p.id;
        return (
          <g key={p.id}>
            <rect
              x={PLATFORM_X}
              y={p.y}
              width={PLATFORM_W}
              height={PLATFORM_H}
              rx={3}
              fill={active ? '#FDF3DC' : '#F8FAFC'}
              stroke={active ? '#F5B942' : '#D8E0E9'}
              strokeWidth={active ? 2 : 1} />
            
            <line
              x1={PLATFORM_X + 4}
              x2={PLATFORM_X + PLATFORM_W - 4}
              y1={p.y + PLATFORM_H / 2}
              y2={p.y + PLATFORM_H / 2}
              stroke="#E2E8F0"
              strokeWidth={1}
              strokeDasharray="4 5" />
            
            <text
              x={PLATFORM_X + 7}
              y={p.y + 12}
              fontSize={10}
              fontFamily="IBM Plex Mono"
              fontWeight={600}
              fill={active ? '#8a5b00' : '#102A43'}>
              
              P{p.id}
            </text>
          </g>);

      })}

      {/* Foot over bridges */}
      {bridges.map((b) =>
      <g key={b.id}>
          <rect
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          fill="#E4EAF1"
          fillOpacity={0.92}
          stroke="#C3CEDA"
          strokeDasharray="3 3" />
        
          <text
          x={b.x + b.w / 2}
          y={b.y + 14}
          fontSize={8}
          fill="#64748B"
          fontFamily="Inter"
          textAnchor="middle"
          transform={`rotate(90 ${b.x + b.w / 2} ${b.y + 14})`}>
          
            {b.label.toUpperCase()}
          </text>
        </g>
      )}

      {/* Crowd layer */}
      {layers.crowd &&
      crowdAreas.map((c) =>
      <rect
        key={c.id}
        x={c.x}
        y={c.y}
        width={c.w}
        height={c.h}
        rx={4}
        fill={CROWD_FILL[c.level]}
        fillOpacity={c.level === 'Very High' ? 0.3 : c.level === 'High' ? 0.22 : 0.14} />

      )}

      {/* Facility markers */}
      {facilities.
      filter((f) => layers[facilityLayer[f.category] ?? 'facilities']).
      map((f) =>
      <g key={f.id}>
            <circle
          cx={f.x}
          cy={f.y}
          r={5.5}
          fill="#FFFFFF"
          stroke={
          facilityLayer[f.category] === 'accessibility' ?
          '#008C95' :
          facilityLayer[f.category] === 'transport' ?
          '#102A43' :
          '#94A3B8'
          }
          strokeWidth={1.6} />
        
            <circle
          cx={f.x}
          cy={f.y}
          r={2}
          fill={
          facilityLayer[f.category] === 'accessibility' ?
          '#008C95' :
          facilityLayer[f.category] === 'transport' ?
          '#102A43' :
          '#64748B'
          } />
        
          </g>
      )}

      {/* Exits */}
      {layers.exits &&
      exits.map((e) =>
      <g key={e.id}>
            <rect
          x={e.x - 13}
          y={e.y - 8}
          width={26}
          height={16}
          rx={3}
          fill="#102A43" />
        
            <text
          x={e.x}
          y={e.y + 4}
          fontSize={9}
          fontFamily="IBM Plex Mono"
          fontWeight={600}
          fill="#FFFFFF"
          textAnchor="middle">
          
              {e.name.replace('Exit ', 'EX')}
            </text>
          </g>
      )}

      {/* Route */}
      {points &&
      <>
          <polyline
          points={points}
          fill="none"
          stroke="#008C95"
          strokeOpacity={0.22}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round" />
        
          <polyline
          points={points}
          fill="none"
          stroke="#008C95"
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="10 8"
          className="route-dash" />
        
        </>
      }

      {/* Destination pin */}
      {(end || destination) &&
      <g>
          <circle
          cx={(destination?.x ?? end?.x) as number}
          cy={(destination?.y ?? end?.y) as number}
          r={8}
          fill="#F5B942"
          stroke="#FFFFFF"
          strokeWidth={2.5} />
        
        </g>
      }

      {/* You are here */}
      <g className={recenterFlash ? 'recenter-flash' : undefined}>
        <circle
          cx={YOU_ARE_HERE.x}
          cy={YOU_ARE_HERE.y}
          r={7}
          fill="#008C95"
          fillOpacity={0.5}
          className="here-pulse"
          style={{ transformBox: 'fill-box' }} />
        
        <circle
          cx={YOU_ARE_HERE.x}
          cy={YOU_ARE_HERE.y}
          r={6}
          fill="#008C95"
          stroke="#FFFFFF"
          strokeWidth={2.5} />
        
        {!compact &&
        <text
          x={YOU_ARE_HERE.x - 12}
          y={YOU_ARE_HERE.y + 22}
          fontSize={9}
          fontFamily="Inter"
          fontWeight={600}
          fill="#102A43">
          
            You are here
          </text>
        }
      </g>

      {/* Side labels */}
      <text x={20} y={404} fontSize={9} fill="#64748B" fontFamily="Inter" fontWeight={600}>
        DADAR WEST
      </text>
      <text
        x={320}
        y={404}
        fontSize={9}
        fill="#64748B"
        fontFamily="Inter"
        fontWeight={600}
        textAnchor="end">
        
        DADAR EAST
      </text>
    </svg>);

}