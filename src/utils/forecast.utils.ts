import type {
  DailyForecastInterface,
  ForecastInterface,
  HourlyForecastDisplayInterface,
} from '@/interfaces/forecast.interface';

export abstract class UtilForecast {
  /** TODAY **/
  static getTodayHourlyForecast(forecast: ForecastInterface): HourlyForecastDisplayInterface[] {
    const today = new Date().toISOString().split('T')[0];

    if (!today) return [];

    return forecast.hourly.time
      .map((time, index) => {
        const temperature = forecast.hourly.temperature2m[index];
        const weatherCode = forecast.hourly.weatherCode[index];
        const windSpeed10m = forecast.hourly.windSpeed10m?.[index];

        if (temperature === undefined) return null;

        return {
          time,
          temperature,
          weatherCode,
          windSpeed10m,
        };
      })
      .filter(
        (item): item is HourlyForecastDisplayInterface =>
          item !== null && item.time.startsWith(today),
      );
  }

  static getFilteredTodayHourlyForecast(
    hours: HourlyForecastDisplayInterface[],
    showPastHours: boolean,
  ): HourlyForecastDisplayInterface[] {
    const now = new Date();
    now.setMinutes(0, 0, 0);

    return hours.filter((hour) => {
      const hourDate = new Date(hour.time);
      if (showPastHours) return true;
      return hourDate >= now;
    });
  }

  /** WEEK **/
  static getWeeklyForecast(forecast: ForecastInterface): DailyForecastInterface[] {
    const today = new Date().toISOString().split('T')[0];
    const dailyData: { [key: string]: { temps: number[]; codes: number[] } } = {};

    // Grouper les données par jour
    forecast.hourly.time.forEach((time, index) => {
      const date = time.split('T')[0];

      if (!date || date === today) return;

      const temperature = forecast.hourly.temperature2m[index];
      const weatherCode = forecast.hourly.weatherCode[index];

      if (temperature === undefined || weatherCode === undefined) return;

      if (!dailyData[date]) {
        dailyData[date] = { temps: [], codes: [] };
      }

      dailyData[date].temps.push(temperature);
      dailyData[date].codes.push(weatherCode);
    });

    return this.processDailyData(dailyData);
  }

  /** PRIVATE **/
  private static processDailyData(dailyData: {
    [key: string]: { temps: number[]; codes: number[] };
  }): DailyForecastInterface[] {
    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        minTemp: Math.min(...data.temps),
        maxTemp: Math.max(...data.temps),
        weatherCode: data.codes[12] ?? data.codes[0] ?? 0,
      }))
      .slice(0, 7);
  }
}
