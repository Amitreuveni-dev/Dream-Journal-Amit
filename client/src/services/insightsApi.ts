import { api } from './api';

// Query params
export interface InsightsQueryParams {
  period?: '7d' | '30d' | '90d' | '1y' | 'all';
}

// Stats response types
export interface InsightsStats {
  totalDreams: number;
  avgClarity: number;
  lucidCount: number;
  lucidPercentage: number;
  avgTagsPerDream: number;
}

export interface StatsResponse {
  success: boolean;
  data: InsightsStats;
}

// Moods response types
export interface MoodData {
  mood: string;
  count: number;
}

export interface DreamTimeData {
  date: string;
  count: number;
}

export interface MoodsResponse {
  success: boolean;
  data: {
    moodDistribution: MoodData[];
    dreamsOverTime: DreamTimeData[];
  };
}

// Symbols response types
export interface TagData {
  tag: string;
  count: number;
}

export interface SymbolData {
  symbol: string;
  count: number;
}

export interface SymbolsResponse {
  success: boolean;
  data: {
    topTags: TagData[];
    topSymbols: SymbolData[];
  };
}

export const insightsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInsightsStats: builder.query<StatsResponse, InsightsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.period) {
          queryParams.append('period', params.period);
        }
        const queryString = queryParams.toString();
        return `/insights/stats${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Insights'],
    }),

    getMoodDistribution: builder.query<MoodsResponse, InsightsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.period) {
          queryParams.append('period', params.period);
        }
        const queryString = queryParams.toString();
        return `/insights/moods${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Insights'],
    }),

    getSymbolFrequency: builder.query<SymbolsResponse, InsightsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.period) {
          queryParams.append('period', params.period);
        }
        const queryString = queryParams.toString();
        return `/insights/symbols${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Insights'],
    }),
  }),
});

export const {
  useGetInsightsStatsQuery,
  useGetMoodDistributionQuery,
  useGetSymbolFrequencyQuery,
} = insightsApi;
