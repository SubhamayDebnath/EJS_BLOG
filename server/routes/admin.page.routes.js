import express from "express";
import{dashboard} from '../controllers/admin.page.controller.js'
const router = express.Router();
router.get("/", dashboard);
export default router;
