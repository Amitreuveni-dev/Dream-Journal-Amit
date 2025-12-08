import { useEffect, useState } from "react";
import { getDreams } from "../services/dreamService";
import type { Dream } from "../../types/Dream";
import DreamCard from "../components/DreamCard";
import styles from "./DreamList.module.scss";

const DreamList = () => {
    const [dreams, setDreams] = useState<Dream[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getDreams();
                setDreams(data);
            } catch (error) {
                console.error("Failed to load dreams:", error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) return <p className={styles.message}>Loading dreams...</p>;
    if (dreams.length === 0) return <p className={styles.message}>No dreams found.</p>;

    return (
        <div className={styles.grid}>
            {dreams.map((dream) => (
                <DreamCard key={dream._id} dream={dream} />
            ))}
        </div>
    );
};

export default DreamList;
