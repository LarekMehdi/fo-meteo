import type { WindSpeedUnit } from '@/constants/windSpeedUnit.constant';

export interface PageInterface<T> {
  datas: T[];
  totalElements: number;
}

export interface GenericFilterInterface {
  page: number;
  limit: number;
}

export interface HistoryFilterInterface extends GenericFilterInterface {
  latitude?: number;
  longitude?: number;
}

export interface ForecastFilterInterface {
  cityName?: string;
  latitude: number | null;
  longitude: number | null;
  hourly?: boolean;
  weatherCode?: boolean;
  windSpeed10m: boolean;
  windSpeedUnit: WindSpeedUnit;
}
