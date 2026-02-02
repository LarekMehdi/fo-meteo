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
}

export interface HourlyUnitsForecastInterface {
  temperature2m: string;
}

export interface HourlyForecastDisplayInterface {
  time: string;
  temperature: number;
}
