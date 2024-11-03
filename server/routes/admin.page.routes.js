import express from "express";
import{dashboard,articlePage} from '../controllers/admin.page.controller.js'
const router = express.Router();
router.get("/", dashboard);
router.get('/articles',articlePage)
export default router;
