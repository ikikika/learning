import { Router } from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

export default router;
