import type {
  ForecastFilterInterface,
  HistoryFilterInterface,
} from '@/interfaces/filter.interface';
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

  /** FIND ALL **/
  static async getHistories(filter: HistoryFilterInterface) {
    try {
      const { data } = await useApi().get(`/history`, { params: filter });
      return data;
    } catch (e: unknown) {
      throw e;
    }
  }
}
