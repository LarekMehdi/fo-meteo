export interface ForecastInterface {
  latitude: number;
  longitude: number;
  elevation: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string; // TODO: enum?
  hourly: HourlyForecastInterface;
  hourly_units: HourlyUnitsForecastInterface;
}

export interface HourlyForecastInterface {
  time: string[];
  temperature_2m: number[];
}

export interface HourlyUnitsForecastInterface {
  temperature_2m: string;
}
