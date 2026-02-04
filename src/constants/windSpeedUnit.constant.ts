import type { OptionSelectInterface } from '@/interfaces/input.interface';

export enum WindSpeedUnit {
  KMH = 'kmh',
  MS = 'ms',
  MPH = 'mph',
  KN = 'kn',
}

const windSpeedLabels: Record<WindSpeedUnit, string> = {
  [WindSpeedUnit.KMH]: 'km/h',
  [WindSpeedUnit.MS]: 'm/s',
  [WindSpeedUnit.MPH]: 'mph',
  [WindSpeedUnit.KN]: 'knots',
};

export function getWindSpeedUnitOptions(): OptionSelectInterface[] {
  return Object.values(WindSpeedUnit).map((value) => ({
    label: windSpeedLabels[value],
    value,
  }));
}
