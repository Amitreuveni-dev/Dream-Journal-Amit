import express from "express";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();


router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logOut", userController.logOut);

router.get("/me", authenticate, userController.getCurrentUser);

export default router;