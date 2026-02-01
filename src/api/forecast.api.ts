import type { ForecastFilterInterface } from '@/interfaces/filter.interface';
import { useApi } from './useApi';
import type { ForecastInterface } from '@/interfaces/forecast.interface';

export abstract class ForecastApi {
  /** FORECAST **/
  static async getForecast(filter: ForecastFilterInterface): Promise<ForecastInterface> {
    try {
      const { data } = await useApi().get(`/forecast`, { params: filter });
      return data;
    } catch (e: unknown) {
      throw e;
    }
  }
}
