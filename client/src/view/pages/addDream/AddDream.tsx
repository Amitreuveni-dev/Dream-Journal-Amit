import type React from "react"
import styles from "./AddDream.module.scss"
import { useState } from "react"
import type { DreamFormData } from "../../../types/Dream";
import { useNavigate } from "react-router";
import { createDream } from "../../services/dreamService";


const AddDream = () => {

    const navigate = useNavigate();

    const [dream, setDream] = useState<DreamFormData>({
        title: "",
        content: "",
        date: "",
        clarity: 3,
        mood: "",
        tags: [] as string[],
        isFavorite: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setDream((prev) => ({
            ...prev,
            [name]:
                name === "clarity" ? Number(value) : value,
        }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const preparedData: DreamFormData = {
            ...dream,
            date: dream.date || new Date().toISOString(),
        };

        try {
            const newDream = await createDream(preparedData);

            console.log("Dream saved:", newDream);

            navigate("/home");
        } catch (error) {
            console.error("Failed to create dream:", error);
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>

                <input type="text" name="title" placeholder="Dream title" value={dream.title} onChange={handleChange} required />

                <textarea name="content" placeholder="Describe your dream..." value={dream.content} onChange={handleChange} required />

                <input type="date" name="date" value={dream.date} onChange={handleChange} />

                <select name="clarity" value={dream.clarity} onChange={handleChange}>
                    <option value="1">1 - Very blurry</option>
                    <option value="2">2 - Blurry</option>
                    <option value="3">3 - Normal</option>
                    <option value="4">4 - Clear</option>
                    <option value="5">5 - Extremely clear</option>
                </select>

                <select name="mood" value={dream.mood} onChange={handleChange}>
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

                {/* <TagsInput tags={dream.tags} setDream={setDream} /> */}

                <button type="submit">Save Dream</button>
            </form>
        </div>
    );
}

export default AddDream
