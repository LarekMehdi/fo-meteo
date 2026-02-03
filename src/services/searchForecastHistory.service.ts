import { SearchForecastHistoryApi } from '@/api/searchForecastHistory.api';
import type {
  ForecastFilterInterface,
  HistoryFilterInterface,
  PageInterface,
} from '@/interfaces/filter.interface';
import type { SearchHistoryInterface } from '@/interfaces/searchHistory.interface';

export abstract class SearchForecastHistoryService {
  /** CREATE **/
  static async create(filter: ForecastFilterInterface) {
    return await SearchForecastHistoryApi.create(filter);
  }

  /** FIND ALL **/
  static async getHistories(
    filter: HistoryFilterInterface,
  ): Promise<PageInterface<SearchHistoryInterface>> {
    return await SearchForecastHistoryApi.getHistories(filter);
  }
}
