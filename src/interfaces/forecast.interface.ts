export interface ForecastInterface {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utcOffsetSeconds: number;
  timezone: string;
  timezoneAbbreviation: string; // TODO: enum?
  hourly: HourlyForecastInterface;
  hourlyUnits: HourlyUnitsForecastInterface;
}

export interface HourlyForecastInterface {
  time: string[];
  temperature2m: number[];
  weatherCode: number[];
  windSpeed10m: number[];
}

export interface HourlyUnitsForecastInterface {
  temperature2m: string;
  windSpeedUnit: string;
}

export interface HourlyForecastDisplayInterface {
  time: string;
  temperature: number;
  weatherCode: number;
  windSpeed10m: number;
}

export interface DailyForecastInterface {
  date: string;
  minTemp: number;
  maxTemp: number;
  weatherCode: number;
}
