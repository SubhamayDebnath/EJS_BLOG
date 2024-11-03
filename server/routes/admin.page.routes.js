import express from "express";
import {
  dashboard,
  articlesPage,
  categoriesPage,
} from "../controllers/admin.page.controller.js";
const router = express.Router();
router.get("/", dashboard);
router.get("/articles", articlesPage);
router.get("/categories", categoriesPage);
export default router;
