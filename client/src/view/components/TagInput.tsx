import { useState } from "react";
import styles from "./TagInput.module.scss";

interface TagInputProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
}

const TagInput = ({ tags, onChange }: TagInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const newTag = inputValue.trim().toLowerCase();

    if (!newTag) return;
    if (tags.includes(newTag)) {
      setInputValue("");
      return;
    }

    onChange([...tags, newTag]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className={styles.container}>
      
      <div className={styles.tags}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            #{tag}
            <button
              type="button"
              className={styles.remove}
              onClick={() => removeTag(tag)}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Add a tag..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button type="button" onClick={addTag}>
          Add
        </button>
      </div>

    </div>
  );
};

export default TagInput;
