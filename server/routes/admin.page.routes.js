import express from "express";
import {
  dashboard,
  articlesPage,
  categoriesPage,
  usersPage,
  contactPage,
} from "../controllers/admin.page.controller.js";
const router = express.Router();
router.get("/", dashboard);
router.get("/articles", articlesPage);
router.get("/categories", categoriesPage);
router.get("/users", usersPage);
router.get("/contact", contactPage);
export default router;
