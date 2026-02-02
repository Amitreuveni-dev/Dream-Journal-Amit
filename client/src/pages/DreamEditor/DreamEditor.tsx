import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  HiOutlineArrowLeft,
  HiOutlinePencil,
  HiOutlineCalendar,
  HiOutlineTag,
  HiOutlineSparkles,
  HiOutlineExclamationCircle,
  HiOutlineX,
} from 'react-icons/hi';
import {
  useGetDreamQuery,
  useCreateDreamMutation,
  useUpdateDreamMutation,
  MoodType,
} from '../../redux/api/dreamsApi';
import { dreamSchema, DreamFormData } from '../../validation/dreamValidation';
import Navbar from '../../components/Navbar/Navbar';
import styles from './DreamEditor.module.scss';

const moods: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'peaceful', emoji: '😌', label: 'Peaceful' },
  { value: 'confused', emoji: '😕', label: 'Confused' },
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'fearful', emoji: '😨', label: 'Fearful' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
];

const clarityLabels = ['Fuzzy', 'Vague', 'Clear', 'Vivid', 'Crystal'];

const DreamEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: existingDream, isLoading: isLoadingDream } = useGetDreamQuery(id!, {
    skip: !id,
  });

  const [createDream, { isLoading: isCreating, error: createError }] = useCreateDreamMutation();
  const [updateDream, { isLoading: isUpdating, error: updateError }] = useUpdateDreamMutation();

  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<DreamFormData>({
    resolver: zodResolver(dreamSchema),
    defaultValues: {
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      isLucid: false,
      mood: undefined,
      clarity: 3,
    },
  });

  useEffect(() => {
    if (existingDream?.dream) {
      const dream = existingDream.dream;
      reset({
        title: dream.title,
        content: dream.content,
        date: new Date(dream.date).toISOString().split('T')[0],
        tags: dream.tags,
        isLucid: dream.isLucid,
        mood: dream.mood,
        clarity: dream.clarity,
      });
    }
  }, [existingDream, reset]);

  const tags = watch('tags');
  const clarity = watch('clarity');
  const mood = watch('mood');
  const isLucid = watch('isLucid');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        setValue('tags', [...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((tag) => tag !== tagToRemove));
  };

  const onSubmit = async (data: DreamFormData) => {
    try {
      if (isEditing) {
        await updateDream({ id, ...data }).unwrap();
      } else {
        await createDream(data).unwrap();
      }
      navigate('/dashboard');
    } catch {
      // Error handled by RTK Query
    }
  };

  const error = createError || updateError;
  const apiError = error && 'data' in error
    ? (error.data as { message?: string })?.message
    : 'An error occurred';

  const isLoading = isCreating || isUpdating;

  if (isEditing && isLoadingDream) {
    return (
      <>
        <Navbar />
        <main className={styles.editorPage}>
          <div className={styles.container}>
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
              Loading dream...
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className={styles.editorPage}>
        <div className={styles.container}>
          <header className={styles.header}>
            <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="Go back">
              <HiOutlineArrowLeft />
            </button>
            <div className={styles.titleSection}>
              <h1>{isEditing ? 'Edit Dream' : 'Record Dream'}</h1>
              <p>{isEditing ? 'Update your dream entry' : 'Capture the details of your dream'}</p>
            </div>
          </header>

          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className={styles.apiError}>
                <HiOutlineExclamationCircle />
                <span>{apiError}</span>
              </div>
            )}

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <HiOutlinePencil />
                Dream Details
              </h2>

              <div className={styles.inputGroup}>
                <label htmlFor="title" className={styles.label}>Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Give your dream a title..."
                  className={`${styles.input} ${errors.title ? styles.error : ''}`}
                  {...register('title')}
                />
                {errors.title && (
                  <span className={styles.errorMessage}>
                    <HiOutlineExclamationCircle />
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="content" className={styles.label}>Dream Description</label>
                <textarea
                  id="content"
                  placeholder="Describe your dream in detail..."
                  className={`${styles.textarea} ${errors.content ? styles.error : ''}`}
                  {...register('content')}
                />
                {errors.content && (
                  <span className={styles.errorMessage}>
                    <HiOutlineExclamationCircle />
                    {errors.content.message}
                  </span>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="date" className={styles.label}>
                    <HiOutlineCalendar style={{ marginRight: 6 }} />
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    className={`${styles.input} ${errors.date ? styles.error : ''}`}
                    {...register('date')}
                  />
                  {errors.date && (
                    <span className={styles.errorMessage}>
                      <HiOutlineExclamationCircle />
                      {errors.date.message}
                    </span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Clarity</label>
                  <div className={styles.claritySlider}>
                    <div className={styles.clarityDots}>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          type="button"
                          className={`${styles.clarityDot} ${clarity >= level ? styles.active : ''}`}
                          onClick={() => setValue('clarity', level)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                    <span className={styles.clarityLabel}>{clarityLabels[clarity - 1]}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <HiOutlineTag />
                Tags & Categories
              </h2>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Tags</label>
                <div className={styles.tagsInput}>
                  {tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      #{tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)}>
                        <HiOutlineX />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={tags.length < 10 ? "Add tags (press Enter)" : "Max 10 tags"}
                    className={styles.tagInput}
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    disabled={tags.length >= 10}
                  />
                </div>
                {errors.tags && (
                  <span className={styles.errorMessage}>
                    <HiOutlineExclamationCircle />
                    {errors.tags.message}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label
                  className={styles.toggle}
                  onClick={() => setValue('isLucid', !isLucid)}
                >
                  <div className={`${styles.toggleSwitch} ${isLucid ? styles.active : ''}`} />
                  <span className={styles.toggleLabel}>This was a lucid dream</span>
                </label>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <HiOutlineSparkles />
                Mood & Emotions
              </h2>

              <div className={styles.inputGroup}>
                <label className={styles.label}>How did this dream make you feel?</label>
                <div className={styles.moodGrid}>
                  {moods.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      className={`${styles.moodOption} ${mood === m.value ? styles.selected : ''}`}
                      onClick={() => setValue('mood', mood === m.value ? undefined : m.value)}
                    >
                      <span>{m.emoji}</span>
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className={styles.spinner} />
                    {isEditing ? 'Saving...' : 'Recording...'}
                  </>
                ) : (
                  isEditing ? 'Save Changes' : 'Record Dream'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default DreamEditor;
