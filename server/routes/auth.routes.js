import express from "express";
import { registerPage, loginPage,register,login,logout} from "../controllers/auth.controller.js";
import {isLoggedIn} from '../middlewares/auth.middleware.js'
import {isAuthorized} from '../middlewares/auth.middleware.js'
import  upload  from '../middlewares/multer.middleware.js'
const router = express.Router();
router.get("/register", isLoggedIn,registerPage);
router.get("/login", isLoggedIn,loginPage);
router.post("/api/v1/register",upload.single('avatar'),register);
router.post("/api/v1/login",login);
router.get('/logout',isAuthorized,logout)

export default router;
