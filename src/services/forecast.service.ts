import { ForecastApi } from '@/api/forecast.api';
import type { City } from '@/interfaces/city.interface';
import type { ForecastFilterInterface } from '@/interfaces/filter.interface';
import type { ForecastInterface } from '@/interfaces/forecast.interface';

export abstract class ForecastService {
  /** FORECAST **/
  static async getForecast(filter: ForecastFilterInterface): Promise<ForecastInterface> {
    return await ForecastApi.getForecast(filter);
  }

  /** CITY **/
  static async searchCity(name: string): Promise<City[]> {
    return await ForecastApi.searchCity(name);
  }
}
