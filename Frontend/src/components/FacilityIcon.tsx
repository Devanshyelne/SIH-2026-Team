import React from 'react';
import {
  AccessibilityIcon,
  AmbulanceIcon,
  ArrowUpDownIcon,
  BanknoteIcon,
  BathIcon,
  BusIcon,
  CarIcon,
  CarTaxiFrontIcon,
  CoffeeIcon,
  DoorOpenIcon,
  InfoIcon,
  LandmarkIcon,
  MoveUpIcon,
  PillIcon,
  ShieldIcon,
  ShieldCheckIcon,
  SofaIcon,
  SquareParkingIcon,
  TicketIcon,
  TrainFrontIcon } from
'lucide-react';
import type { FacilityIconKey } from '../types/setu';

const map: Record<FacilityIconKey, React.ComponentType<{className?: string;strokeWidth?: number;}>> = {
  ticket: TicketIcon,
  washroom: BathIcon,
  food: CoffeeIcon,
  pharmacy: PillIcon,
  hospital: AmbulanceIcon,
  platform: TrainFrontIcon,
  lift: ArrowUpDownIcon,
  escalator: MoveUpIcon,
  fob: LandmarkIcon,
  police: ShieldIcon,
  security: ShieldCheckIcon,
  waiting: SofaIcon,
  info: InfoIcon,
  parking: SquareParkingIcon,
  exit: DoorOpenIcon,
  bus: BusIcon,
  auto: CarIcon,
  taxi: CarTaxiFrontIcon,
  atm: BanknoteIcon
};

export function FacilityIcon({
  name,
  className = 'w-5 h-5'



}: {name: FacilityIconKey;className?: string;}) {
  const Cmp = map[name] ?? AccessibilityIcon;
  return <Cmp className={className} strokeWidth={1.8} />;
}