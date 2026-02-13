export { api } from './api';
export {
  authApi,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useRefreshTokenMutation,
} from './authApi';
export type { User, AuthResponse, LoginRequest, RegisterRequest } from './authApi';

export {
  dreamsApi,
  useGetDreamsQuery,
  useGetDreamQuery,
  useCreateDreamMutation,
  useUpdateDreamMutation,
  useDeleteDreamMutation,
  useGetTrashedDreamsQuery,
  useRestoreDreamMutation,
  usePermanentDeleteDreamMutation,
} from './dreamsApi';
export type {
  Dream,
  DreamsResponse,
  DreamResponse,
  CreateDreamRequest,
  UpdateDreamRequest,
  DreamsQueryParams,
} from './dreamsApi';

export {
  userApi,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from './userApi';
export type {
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserResponse,
} from './userApi';

export {
  insightsApi,
  useGetInsightsStatsQuery,
  useGetMoodDistributionQuery,
  useGetSymbolFrequencyQuery,
} from './insightsApi';
export type {
  InsightsQueryParams,
  InsightsStats,
  StatsResponse,
  MoodData,
  DreamTimeData,
  MoodsResponse,
  TagData,
  SymbolData,
  SymbolsResponse,
} from './insightsApi';

export {
  analysisApi,
  useAnalyzeDreamMutation,
  useReanalyzeDreamMutation,
} from './analysisApi';
export type {
  AnalysisResult,
  AnalyzeDreamResponse,
} from './analysisApi';
