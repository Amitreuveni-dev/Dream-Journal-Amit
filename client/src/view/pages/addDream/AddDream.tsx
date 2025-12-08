import DreamForm from "../../components/DreamForm";
import { createDream } from "../../services/dreamService";
import type { DreamFormData } from "../../../types/Dream";
import { useNavigate } from "react-router";

const AddDream = () => {
  const navigate = useNavigate();

  const defaultDream: DreamFormData = {
    title: "",
    content: "",
    date: "",
    clarity: 3,
    mood: "",
    tags: [],
    isFavorite: false,
  };

  const handleCreate = async (data: DreamFormData) => {
    await createDream(data);
    navigate("/");
  };

  return <DreamForm initialData={defaultDream} onSubmit={handleCreate} />;
};

export default AddDream;
