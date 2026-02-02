export interface ForecastFilterInterface {
  latitude: number | null;
  longitude: number | null;
  hourly?: boolean;
  weatherCode?: boolean;
  windSpeed10m?: boolean;
}
