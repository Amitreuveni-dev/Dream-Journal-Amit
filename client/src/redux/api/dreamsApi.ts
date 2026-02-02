import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type MoodType = 'happy' | 'sad' | 'anxious' | 'peaceful' | 'confused' | 'excited' | 'fearful' | 'neutral';

export interface Analysis {
  mood?: MoodType;
  symbols: string[];
  interpretation?: string;
  detectedLanguage?: string;
  analyzedAt?: string;
}

export interface Dream {
  _id: string;
  user: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  isLucid: boolean;
  mood?: MoodType;
  clarity: number;
  analysis?: Analysis;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface DreamsResponse {
  success: boolean;
  count: number;
  dreams: Dream[];
}

interface DreamResponse {
  success: boolean;
  dream: Dream;
}

interface CreateDreamRequest {
  title: string;
  content: string;
  date?: string;
  tags?: string[];
  isLucid?: boolean;
  mood?: MoodType;
  clarity?: number;
}

interface UpdateDreamRequest extends Partial<CreateDreamRequest> {
  id: string;
}

interface DreamsQueryParams {
  search?: string;
  mood?: MoodType;
  isLucid?: boolean;
  startDate?: string;
  endDate?: string;
  tags?: string[];
  sort?: 'date' | '-date' | 'title' | '-title';
}

export const dreamsApi = createApi({
  reducerPath: 'dreamsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    credentials: 'include',
  }),
  tagTypes: ['Dreams', 'Dream'],
  endpoints: (builder) => ({
    getDreams: builder.query<DreamsResponse, DreamsQueryParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.set('search', params.search);
        if (params?.mood) searchParams.set('mood', params.mood);
        if (params?.isLucid !== undefined) searchParams.set('isLucid', String(params.isLucid));
        if (params?.startDate) searchParams.set('startDate', params.startDate);
        if (params?.endDate) searchParams.set('endDate', params.endDate);
        if (params?.tags?.length) searchParams.set('tags', params.tags.join(','));
        if (params?.sort) searchParams.set('sort', params.sort);

        const queryString = searchParams.toString();
        return `/dreams${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.dreams.map(({ _id }) => ({ type: 'Dreams' as const, id: _id })),
              { type: 'Dreams', id: 'LIST' },
            ]
          : [{ type: 'Dreams', id: 'LIST' }],
    }),

    getDream: builder.query<DreamResponse, string>({
      query: (id) => `/dreams/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Dream', id }],
    }),

    createDream: builder.mutation<DreamResponse, CreateDreamRequest>({
      query: (dream) => ({
        url: '/dreams',
        method: 'POST',
        body: dream,
      }),
      invalidatesTags: [{ type: 'Dreams', id: 'LIST' }],
    }),

    updateDream: builder.mutation<DreamResponse, UpdateDreamRequest>({
      query: ({ id, ...dream }) => ({
        url: `/dreams/${id}`,
        method: 'PUT',
        body: dream,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Dreams', id: 'LIST' },
        { type: 'Dream', id },
      ],
    }),

    deleteDream: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/dreams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Dreams', id: 'LIST' }],
    }),

    restoreDream: builder.mutation<DreamResponse, string>({
      query: (id) => ({
        url: `/dreams/${id}/restore`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Dreams', id: 'LIST' }],
    }),

    permanentDeleteDream: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/dreams/${id}/permanent`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Dreams', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetDreamsQuery,
  useGetDreamQuery,
  useCreateDreamMutation,
  useUpdateDreamMutation,
  useDeleteDreamMutation,
  useRestoreDreamMutation,
  usePermanentDeleteDreamMutation,
} = dreamsApi;
