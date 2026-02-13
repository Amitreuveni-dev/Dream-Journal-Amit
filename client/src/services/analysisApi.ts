import { api } from './api';
import { Dream } from './dreamsApi';

export interface AnalysisResult {
  mood: string;
  symbols: string[];
  interpretation: string;
  detectedLanguage: string;
}

export interface AnalyzeDreamResponse {
  success: boolean;
  message: string;
  data: {
    dream: Dream;
    analysis: AnalysisResult;
  };
}

export const analysisApi = api.injectEndpoints({
  endpoints: (builder) => ({
    analyzeDream: builder.mutation<AnalyzeDreamResponse, string>({
      query: (dreamId) => ({
        url: `/analysis/dream/${dreamId}`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, dreamId) => [
        { type: 'Dreams', id: dreamId },
        { type: 'Dreams', id: 'LIST' },
      ],
    }),

    reanalyzeDream: builder.mutation<AnalyzeDreamResponse, string>({
      query: (dreamId) => ({
        url: `/analysis/dream/${dreamId}/reanalyze`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, dreamId) => [
        { type: 'Dreams', id: dreamId },
        { type: 'Dreams', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useAnalyzeDreamMutation,
  useReanalyzeDreamMutation,
} = analysisApi;
