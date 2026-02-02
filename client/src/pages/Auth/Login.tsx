import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff, HiOutlineExclamationCircle, HiOutlineHome } from 'react-icons/hi';
import { useLoginMutation } from '../../redux/api/authApi';
import { loginSchema, LoginFormData } from '../../validation/authValidation';
import styles from './Auth.module.scss';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data).unwrap();
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
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to continue your dream journey</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className={styles.apiError}>
              <HiOutlineExclamationCircle />
              <span>{apiError}</span>
            </div>
          )}

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
                placeholder="Enter your password"
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

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className={styles.spinner} />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className={styles.footer}>
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>

        <Link to="/" className={styles.homeLink}>
          <HiOutlineHome />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
