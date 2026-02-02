export interface ForecastFilterInterface {
  cityName?: string;
  latitude: number | null;
  longitude: number | null;
  hourly?: boolean;
  weatherCode?: boolean;
  windSpeed10m?: boolean;
}
