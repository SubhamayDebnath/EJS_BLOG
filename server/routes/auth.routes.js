import express from "express";
import {
  registerPage,
  loginPage,
  register,
  login,
  logout,
  forgetPasswordPage,
  resetPasswordPage,
  resetPasswordSendMail,
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import { isAuthorized } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
const router = express.Router();
router.get("/register", isLoggedIn, registerPage);
router.get("/login", isLoggedIn, loginPage);
router.get("/auth/password/forget-password", isLoggedIn, forgetPasswordPage);
router.get("/auth/password/reset-password/:slug", isLoggedIn, resetPasswordPage);
router.post("/api/v1/register", upload.single("avatar"), register);
router.post("/api/v1/login", login);
router.post("/api/v1/reset-password", resetPasswordSendMail);
router.get("/logout", isAuthorized, logout);

export default router;
