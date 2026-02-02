import type { ForecastFilterInterface } from '@/interfaces/filter.interface';
import { useApi } from './useApi';
import type { ForecastInterface } from '@/interfaces/forecast.interface';
import type { City } from '@/interfaces/city.interface';

export abstract class ForecastApi {
  /** FORECAST **/
  static async getForecast(filter: ForecastFilterInterface): Promise<ForecastInterface> {
    try {
      const { data } = await useApi().get(`/forecast`, { params: filter });
      console.log(data);
      return data;
    } catch (e: unknown) {
      throw e;
    }
  }

  /** CITY **/
  static async searchCity(name: string): Promise<City[]> {
    try {
      const { data } = await useApi().get(`/forecast/city`, { params: { name } });
      return data;
    } catch (e: unknown) {
      throw e;
    }
  }
}
