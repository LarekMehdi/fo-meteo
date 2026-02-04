export interface SearchHistoryInterface {
  id: number;
  userId: number;
  latitude: number;
  longitude: number;
  cityName?: string;
  hourly: boolean;
  weatherCode: boolean;
  windSpeed10m: boolean;
  windSpeedUnit: string; //TODO: enum
  createdAt: string;
}
