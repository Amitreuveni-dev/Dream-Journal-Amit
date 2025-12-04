import type { Dream } from "../../types/Dream";
import styles from "./DreamCard.module.scss";

const DreamCard = ({ dream }: { dream: Dream }) => {
    return (
        <div className={styles.card}>
            <h3>{dream.title}</h3>
            <p>{new Date(dream.date).toLocaleDateString()}</p>
            <p>{dream.content.substring(0, 120)}...</p>

            <button>View</button>
        </div>
    );
};

export default DreamCard;
