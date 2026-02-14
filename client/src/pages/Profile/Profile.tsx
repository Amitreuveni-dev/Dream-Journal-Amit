import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../redux/store';
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
} from '../../services';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import {
  ProfileSectionSkeleton,
  PreferencesSectionSkeleton,
  SecuritySectionSkeleton,
} from '../../components/Skeleton/Skeleton';
import styles from './Profile.module.scss';

const profileSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  bio: z.string().max(500, 'Bio must be at most 500 characters'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Must include uppercase, lowercase, and number'
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || '',
      bio: user?.bio || '',
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        username: data.username,
        bio: data.bio,
      }).unwrap();
      toast.success('Profile updated successfully');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword(data).unwrap();
      toast.success('Password changed successfully');
      resetPasswordForm();
      setShowPasswordForm(false);
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      toast.success('Account deleted');
      navigate('/');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to delete account');
    }
  };

  const handlePreferenceChange = async (key: string, value: boolean) => {
    try {
      await updateProfile({
        preferences: { [key]: value },
      }).unwrap();

      if (key === 'theme') {
        setTheme(value ? 'light' : 'dark');
      }
    } catch {
      toast.error('Failed to update preference');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await uploadAvatar(formData).unwrap();
      toast.success('Avatar uploaded successfully');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Failed to upload avatar');
    }

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      className={styles.profile}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className={styles.title}>Profile Settings</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        {!user ? (
          <div className={styles.content}>
            <ProfileSectionSkeleton />
            <PreferencesSectionSkeleton />
            <SecuritySectionSkeleton />
          </div>
        ) : (
        <div className={styles.content}>
          {/* Profile Info Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Profile Information</h2>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className={styles.form}>
              <div className={styles.avatarSection}>
                <div
                  className={`${styles.avatar} ${styles.avatarClickable}`}
                  onClick={handleAvatarClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleAvatarClick()}
                >
                  {isUploadingAvatar ? (
                    <div className={styles.avatarLoading}>
                      <div className={styles.spinner} />
                    </div>
                  ) : user?.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span>{user?.username?.charAt(0).toUpperCase()}</span>
                  )}
                  <div className={styles.avatarOverlay}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleAvatarChange}
                  className={styles.hiddenInput}
                />
                <div className={styles.avatarInfo}>
                  <button
                    type="button"
                    className={styles.uploadBtn}
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                  </button>
                  <p className={styles.avatarHint}>JPEG, PNG, WebP or GIF. Max 5MB.</p>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  {...registerProfile('username')}
                  className={profileErrors.username ? styles.inputError : ''}
                />
                {profileErrors.username && (
                  <span className={styles.error}>{profileErrors.username.message}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={user?.email || ''} disabled />
                <span className={styles.hint}>Email cannot be changed</span>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  {...registerProfile('bio')}
                  className={profileErrors.bio ? styles.inputError : ''}
                />
                {profileErrors.bio && (
                  <span className={styles.error}>{profileErrors.bio.message}</span>
                )}
              </div>

              <button
                type="submit"
                className={styles.saveBtn}
                disabled={isUpdating || !isDirty}
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </section>

          {/* Preferences Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Preferences</h2>
            <div className={styles.preferences}>
              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <h3>Theme</h3>
                  <p>Switch between dark and light mode</p>
                </div>
                <div className={styles.themeToggleWrapper}>
                  <span className={styles.themeLabel}>
                    {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                  </span>
                </div>
              </div>

              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <h3>Email Notifications</h3>
                  <p>Receive updates about your dreams</p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={user?.preferences?.emailNotifications ?? true}
                    onChange={(e) =>
                      handlePreferenceChange('emailNotifications', e.target.checked)
                    }
                  />
                  <span className={styles.slider} />
                </label>
              </div>

              <div className={styles.preferenceItem}>
                <div className={styles.preferenceInfo}>
                  <h3>Weekly Digest</h3>
                  <p>Get a weekly summary of your dreams</p>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={user?.preferences?.weeklyDigest ?? false}
                    onChange={(e) =>
                      handlePreferenceChange('weeklyDigest', e.target.checked)
                    }
                  />
                  <span className={styles.slider} />
                </label>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Security</h2>

            {!showPasswordForm ? (
              <button
                className={styles.secondaryBtn}
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </button>
            ) : (
              <form
                onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                className={styles.form}
              >
                <div className={styles.inputGroup}>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    {...registerPassword('currentPassword')}
                    className={passwordErrors.currentPassword ? styles.inputError : ''}
                  />
                  {passwordErrors.currentPassword && (
                    <span className={styles.error}>
                      {passwordErrors.currentPassword.message}
                    </span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    id="newPassword"
                    type="password"
                    {...registerPassword('newPassword')}
                    className={passwordErrors.newPassword ? styles.inputError : ''}
                  />
                  {passwordErrors.newPassword && (
                    <span className={styles.error}>{passwordErrors.newPassword.message}</span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="confirmNewPassword">Confirm New Password</label>
                  <input
                    id="confirmNewPassword"
                    type="password"
                    {...registerPassword('confirmNewPassword')}
                    className={passwordErrors.confirmNewPassword ? styles.inputError : ''}
                  />
                  {passwordErrors.confirmNewPassword && (
                    <span className={styles.error}>
                      {passwordErrors.confirmNewPassword.message}
                    </span>
                  )}
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setShowPasswordForm(false);
                      resetPasswordForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.saveBtn}
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Danger Zone */}
          <section className={`${styles.section} ${styles.dangerZone}`}>
            <h2 className={styles.sectionTitle}>Danger Zone</h2>
            <p className={styles.dangerText}>
              Once you delete your account, there is no going back. All your dreams will be
              permanently deleted.
            </p>

            {!showDeleteConfirm ? (
              <button
                className={styles.dangerBtn}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            ) : (
              <div className={styles.deleteConfirm}>
                <p>Are you sure? This action cannot be undone.</p>
                <div className={styles.buttonGroup}>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.dangerBtn}
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
        )}
      </main>
    </motion.div>
  );
}
