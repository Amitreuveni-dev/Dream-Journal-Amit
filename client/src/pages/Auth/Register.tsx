import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineExclamationCircle,
  HiOutlineUser,
  HiOutlineHome,
} from 'react-icons/hi';
import { useRegisterMutation } from '../../redux/api/authApi';
import { registerSchema, RegisterFormData } from '../../validation/authValidation';
import styles from './Auth.module.scss';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerUser, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data).unwrap();
      navigate('/dashboard');
    } catch {
      // Error is handled by RTK Query
    }
  };

  const apiError = error && 'data' in error
    ? (error.data as { message?: string })?.message
    : 'An error occurred';

  return (
    <div className={styles.authPage}>
      <div className={styles.backgroundOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      <div className={styles.authCard}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🌙</span>
          <span className={styles.logoText}>NightLog</span>
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Start your dream journal journey today</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className={styles.apiError}>
              <HiOutlineExclamationCircle />
              <span>{apiError}</span>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <div className={styles.inputWrapper}>
              <HiOutlineUser className={styles.inputIcon} />
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
                {...register('username')}
              />
            </div>
            {errors.username && (
              <span className={styles.errorMessage}>
                <HiOutlineExclamationCircle />
                {errors.username.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <HiOutlineMail className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <span className={styles.errorMessage}>
                <HiOutlineExclamationCircle />
                {errors.email.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <HiOutlineLockClosed className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorMessage}>
                <HiOutlineExclamationCircle />
                {errors.password.message}
              </span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
            <div className={styles.inputWrapper}>
              <HiOutlineLockClosed className={styles.inputIcon} />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>
                <HiOutlineExclamationCircle />
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>

        <Link to="/" className={styles.homeLink}>
          <HiOutlineHome />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
