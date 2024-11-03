import express from "express";
import {
  dashboard,
  articlesPage,
  categoriesPage,
  usersPage,
  contactPage,
  addPostPage,
  addCategoryPage
} from "../controllers/admin.page.controller.js";
const router = express.Router();
router.get("/", dashboard);
router.get("/articles", articlesPage);
router.get("/categories", categoriesPage);
router.get("/users", usersPage);
router.get("/contact", contactPage);
router.get("/articles/add",addPostPage)
router.get("/category/add",addCategoryPage)
export default router;
