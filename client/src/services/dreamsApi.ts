import { api } from './api';
import { MoodType } from '../validation/dreamSchemas';

export interface Dream {
  _id: string;
  user: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  isLucid: boolean;
  mood?: MoodType;
  clarity?: number;
  analysis?: {
    mood?: string;
    symbols?: string[];
    interpretation?: string;
    detectedLanguage?: string;
  };
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DreamsResponse {
  success: boolean;
  dreams: Dream[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DreamResponse {
  success: boolean;
  dream: Dream;
}

export interface CreateDreamRequest {
  title: string;
  content: string;
  date?: string;
  tags?: string[];
  isLucid?: boolean;
  mood?: MoodType;
  clarity?: number;
}

export interface UpdateDreamRequest extends Partial<CreateDreamRequest> {
  id: string;
}

export interface DreamsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  mood?: MoodType;
  isLucid?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const dreamsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDreams: builder.query<DreamsResponse, DreamsQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
              queryParams.append(key, String(value));
            }
          });
        }
        const queryString = queryParams.toString();
        return `/dreams${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: { success: boolean; data: { dreams: Dream[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasMore: boolean } } }) => ({
        success: response.success,
        dreams: response.data.dreams,
        pagination: {
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          pages: response.data.pagination.totalPages,
        },
      }),
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
      transformResponse: (response: { success: boolean; data: { dream: Dream } }) => ({
        success: response.success,
        dream: response.data.dream,
      }),
      providesTags: (_result, _error, id) => [{ type: 'Dreams', id }],
    }),

    createDream: builder.mutation<DreamResponse, CreateDreamRequest>({
      query: (data) => ({
        url: '/dreams',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: { success: boolean; data: { dream: Dream } }) => ({
        success: response.success,
        dream: response.data.dream,
      }),
      invalidatesTags: [{ type: 'Dreams', id: 'LIST' }],
    }),

    updateDream: builder.mutation<DreamResponse, UpdateDreamRequest>({
      query: ({ id, ...data }) => ({
        url: `/dreams/${id}`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: { success: boolean; data: { dream: Dream } }) => ({
        success: response.success,
        dream: response.data.dream,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Dreams', id },
        { type: 'Dreams', id: 'LIST' },
      ],
    }),

    deleteDream: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/dreams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Dreams', id: 'LIST' }],
    }),

    getTrashedDreams: builder.query<{ success: boolean; dreams: Dream[] }, void>({
      query: () => '/dreams/trash',
      transformResponse: (response: { success: boolean; data: { dreams: Dream[] } }) => ({
        success: response.success,
        dreams: response.data.dreams,
      }),
      providesTags: [{ type: 'Dreams', id: 'TRASH' }],
    }),

    restoreDream: builder.mutation<DreamResponse, string>({
      query: (id) => ({
        url: `/dreams/${id}/restore`,
        method: 'POST',
      }),
      transformResponse: (response: { success: boolean; data: { dream: Dream } }) => ({
        success: response.success,
        dream: response.data.dream,
      }),
      invalidatesTags: [
        { type: 'Dreams', id: 'LIST' },
        { type: 'Dreams', id: 'TRASH' },
      ],
    }),

    permanentDeleteDream: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/dreams/${id}/permanent`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Dreams', id: 'TRASH' }],
    }),
  }),
});

export const {
  useGetDreamsQuery,
  useGetDreamQuery,
  useCreateDreamMutation,
  useUpdateDreamMutation,
  useDeleteDreamMutation,
  useGetTrashedDreamsQuery,
  useRestoreDreamMutation,
  usePermanentDeleteDreamMutation,
} = dreamsApi;
