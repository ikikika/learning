import { Router } from "express";
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signup,
  updatePassword,
} from "../controllers/authController";
import { deleteMe, getAllUsers, updateMe } from "../controllers/userController";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);

router.patch("/update-password", protect, updatePassword);

router.route("/").get(getAllUsers);

router.patch("/update-me", protect, updateMe);
router.delete("/delete-me", protect, deleteMe);

export default router;
