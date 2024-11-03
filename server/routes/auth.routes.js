import express from "express";
import { registerPage, loginPage,register,login} from "../controllers/auth.controller.js";
import {isLoggedIn} from '../middlewares/auth.middleware.js'
const router = express.Router();
router.get("/register", isLoggedIn,registerPage);
router.get("/login", isLoggedIn,loginPage);
router.post("/api/v1/register",register);
router.post("/api/v1/login",login);

export default router;
