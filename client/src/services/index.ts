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
