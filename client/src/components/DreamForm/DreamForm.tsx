import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { dreamSchema, DreamFormData, moodOptions, MoodType } from '../../validation/dreamSchemas';
import { Dream, useCreateDreamMutation, useUpdateDreamMutation } from '../../services';
import styles from './DreamForm.module.scss';

interface DreamFormProps {
  isOpen: boolean;
  onClose: () => void;
  editDream?: Dream | null;
}

const moodEmojis: Record<MoodType, string> = {
  happy: '😊',
  sad: '😢',
  anxious: '😰',
  peaceful: '😌',
  confused: '😕',
  excited: '🤩',
  fearful: '😨',
  neutral: '😐',
};

export default function DreamForm({ isOpen, onClose, editDream }: DreamFormProps) {
  const [createDream, { isLoading: isCreating }] = useCreateDreamMutation();
  const [updateDream, { isLoading: isUpdating }] = useUpdateDreamMutation();
  const [tagInput, setTagInput] = useState('');

  const isLoading = isCreating || isUpdating;
  const isEditing = !!editDream;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const tags = watch('tags') || [];
  const selectedMood = watch('mood');
  const clarity = watch('clarity') || 3;

  useEffect(() => {
    if (editDream) {
      reset({
        title: editDream.title,
        content: editDream.content,
        date: editDream.date.split('T')[0],
        tags: editDream.tags,
        isLucid: editDream.isLucid,
        mood: editDream.mood,
        clarity: editDream.clarity || 3,
      });
    } else {
      reset({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        tags: [],
        isLucid: false,
        mood: undefined,
        clarity: 3,
      });
    }
  }, [editDream, reset]);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setValue('tags', [...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = async (data: DreamFormData) => {
    try {
      if (isEditing && editDream) {
        await updateDream({ id: editDream._id, ...data }).unwrap();
        toast.success('Dream updated successfully');
      } else {
        await createDream(data).unwrap();
        toast.success('Dream recorded successfully');
      }
      onClose();
      reset();
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err.data?.message || 'Something went wrong');
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setTagInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <h2 className={styles.title}>
                {isEditing ? 'Edit Dream' : 'Record a Dream'}
              </h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={handleClose}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label htmlFor="title" className={styles.label}>
                    Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Give your dream a title"
                    className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                    {...register('title')}
                  />
                  {errors.title && (
                    <span className={styles.errorMessage}>{errors.title.message}</span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="date" className={styles.label}>
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    className={styles.input}
                    {...register('date')}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="content" className={styles.label}>
                  Dream Description
                </label>
                <textarea
                  id="content"
                  placeholder="Describe your dream in detail..."
                  className={`${styles.textarea} ${errors.content ? styles.inputError : ''}`}
                  rows={6}
                  {...register('content')}
                />
                {errors.content && (
                  <span className={styles.errorMessage}>{errors.content.message}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Tags</label>
                <div className={styles.tagInput}>
                  <input
                    type="text"
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                  />
                  <button
                    type="button"
                    className={styles.addTagBtn}
                    onClick={handleAddTag}
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className={styles.tags}>
                    {tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className={styles.removeTag}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Mood</label>
                  <div className={styles.moodGrid}>
                    {moodOptions.map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        className={`${styles.moodBtn} ${selectedMood === mood ? styles.moodSelected : ''}`}
                        onClick={() => setValue('mood', mood)}
                        title={mood}
                      >
                        {moodEmojis[mood]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Clarity ({clarity}/5)</label>
                  <div className={styles.claritySlider}>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      className={styles.slider}
                      {...register('clarity', { valueAsNumber: true })}
                    />
                    <div className={styles.clarityStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= clarity ? styles.starFilled : styles.starEmpty}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    {...register('isLucid')}
                  />
                  <span className={styles.checkmark} />
                  <span>This was a lucid dream</span>
                </label>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className={styles.spinner} />
                  ) : isEditing ? (
                    'Save Changes'
                  ) : (
                    'Record Dream'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
