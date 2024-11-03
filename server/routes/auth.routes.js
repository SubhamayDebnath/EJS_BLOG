import express from "express";
import { registerPage, loginPage,register} from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/register", registerPage);
router.get("/login", loginPage);
router.post("/api/v1/register",register);
// router.post("/api/v23/login",login);

export default router;
