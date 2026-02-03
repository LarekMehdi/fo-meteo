import type { ForecastFilterInterface } from '@/interfaces/filter.interface';
import { useApi } from './useApi';

export abstract class SearchForecastHistoryApi {
  /** CREATE **/
  static async create(filter: ForecastFilterInterface) {
    try {
      const { data } = await useApi().post(`/history`, filter);
      return data;
    } catch (e: unknown) {
      throw e;
    }
  }
}
