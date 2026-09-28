import express from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { register , login , getMe, refreshToken, logout  } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/me", authenticate, getMe);
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;