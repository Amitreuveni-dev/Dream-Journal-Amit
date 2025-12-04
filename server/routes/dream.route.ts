import express from "express";
import * as dreamController from "../controllers/dream.controller";
import { authenticate } from "../middleware/auth";
import { validateId } from "../middleware/isValidObjectId";


const router = express.Router();

router.get("/dream", authenticate, dreamController.getAllDreams);

router.get("/dream/:id", authenticate, validateId, dreamController.getDreamById);

router.post("/dream", authenticate, dreamController.createDream);

router.put("/dream/:id", authenticate, validateId, dreamController.updateDream);

router.delete("/dream/:id", authenticate, validateId, dreamController.deleteDream);

router.put("/dream/:id/favorite", authenticate, validateId, dreamController.toggleFavorite);

router.get("/favorites", authenticate, dreamController.getFavorites);


export default router;