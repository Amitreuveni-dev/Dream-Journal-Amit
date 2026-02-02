import { api } from './api';
import { User } from './authApi';

export interface UpdateProfileRequest {
  username?: string;
  bio?: string;
  preferences?: {
    theme?: 'dark' | 'light';
    emailNotifications?: boolean;
    weeklyDigest?: boolean;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UserResponse {
  success: boolean;
  user: User;
  message?: string;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserResponse, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<UserResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (data) => ({
        url: '/users/password',
        method: 'PUT',
        body: data,
      }),
    }),

    deleteAccount: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/users/account',
        method: 'DELETE',
      }),
      invalidatesTags: ['User', 'Dreams'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} = userApi;
