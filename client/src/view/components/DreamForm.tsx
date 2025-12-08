import { useState } from "react";
import type { DreamFormData } from "../../types/Dream";
import TagInput from "./TagInput";
import styles from "./DreamForm.module.scss";

interface DreamFormProps {
    initialData: DreamFormData;
    onSubmit: (data: DreamFormData) => void;
}

const DreamForm = ({ initialData, onSubmit }: DreamFormProps) => {
    const [dream, setDream] = useState<DreamFormData>(initialData);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setDream(prev => ({
            ...prev,
            [name]: name === "clarity" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const preparedData: DreamFormData = {
            ...dream,
            date: dream.date || new Date().toISOString(),
        };

        onSubmit(preparedData);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>

            <input className={styles.input} type="text" name="title" placeholder="Dream title" value={dream.title} onChange={handleChange} required />

            <textarea className={styles.textarea} name="content" placeholder="Describe your dream..." value={dream.content} onChange={handleChange} required />

            <input className={styles.input} type="date" name="date" value={dream.date} onChange={handleChange} max={new Date().toISOString().split("T")[0]} />

            <select className={styles.input} name="clarity" value={dream.clarity} onChange={handleChange}>
                <option value="1">1 - Very blurry</option>
                <option value="2">2 - Blurry</option>
                <option value="3">3 - Normal</option>
                <option value="4">4 - Clear</option>
                <option value="5">5 - Extremely clear</option>
            </select>

            <select className={styles.input} name="mood" value={dream.mood} onChange={handleChange}>
                <option value="">Select mood</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="scared">Scared</option>
                <option value="confused">Confused</option>
                <option value="peaceful">Peaceful</option>
                <option value="anxious">Anxious</option>
                <option value="excited">Excited</option>
                <option value="neutral">Neutral</option>
            </select>

            <div className={styles.tagInputWrapper}>
                <TagInput
                    tags={dream.tags}
                    onChange={(newTags) =>
                        setDream(prev => ({ ...prev, tags: newTags }))
                    }
                />
            </div>

            <button className={styles.button} type="submit">Save Dream</button>
        </form>
    );
};

export default DreamForm;
