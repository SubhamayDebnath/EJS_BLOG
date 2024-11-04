import express from "express";
import {
  dashboard,
  articlesPage,
  categoriesPage,
  usersPage,
  contactPage,
  addPostPage,
  addCategoryPage,
  updateCategoryPage
} from "../controllers/admin.page.controller.js";
import {isAuthorized} from '../middlewares/auth.middleware.js'
const router = express.Router();
router.get("/",isAuthorized,dashboard);
router.get("/articles",isAuthorized,articlesPage);
router.get("/categories",isAuthorized,categoriesPage);
router.get("/users",isAuthorized,usersPage);
router.get("/contact",isAuthorized,contactPage);
router.get("/articles/add",isAuthorized,addPostPage)
router.get("/category/add",isAuthorized,addCategoryPage)
router.get("/category/update/:id",isAuthorized,updateCategoryPage)
export default router;
