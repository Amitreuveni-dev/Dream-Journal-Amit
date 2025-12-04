import express from "express";
import * as dreamController from "../controllers/dream.controller";
import { authenticate } from "../middleware/auth";
import { validateId } from "../middleware/isValidObjectId";


const router = express.Router();
router.use(authenticate);

router.get("/", dreamController.getAllDreams);

router.get("/:id", validateId, dreamController.getDreamById);

router.post("/", dreamController.createDream);

router.put("/:id", validateId, dreamController.updateDream);

router.delete("/:id", validateId, dreamController.deleteDream);

router.put("/:id/favorite", validateId, dreamController.toggleFavorite);

router.get("/favorites", dreamController.getFavorites);


export default router;