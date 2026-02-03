import { SearchForecastHistoryApi } from '@/api/searchForecastHistory.api';
import type { ForecastFilterInterface } from '@/interfaces/filter.interface';

export abstract class SearchForecastHistoryService {
  /** CREATE **/
  static async create(filter: ForecastFilterInterface) {
    return await SearchForecastHistoryApi.create(filter);
  }
}
