import type { Dream } from "../../types/Dream";
import styles from "./DreamCard.module.scss";
import { useNavigate } from "react-router";

const DreamCard = ({ dream }: { dream: Dream }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.card}>

            <div className={styles.header}>
                <h3 className={styles.title}>{dream.title}</h3>

                {dream.isFavorite && <span className={styles.star}>★</span>}
            </div>

            <p className={styles.date}>
                {new Date(dream.date).toLocaleDateString()}
            </p>

            <p className={styles.preview}>
                {dream.content.length > 120
                    ? dream.content.substring(0, 120) + "..."
                    : dream.content}
            </p>

            {dream.tags.length > 0 && (
                <div className={styles.tags}>
                    {dream.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <button
                onClick={() => navigate(`/dream/${dream._id}`)}
                className={styles.viewButton}
            >
                View
            </button>
        </div>
    );
};

export default DreamCard;
