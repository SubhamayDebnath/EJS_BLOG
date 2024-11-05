import express from "express";
import { homePage ,articlesPage,articlePage,contactPage, categoriesPage,categoryPage,errorPage} from "../controllers/main.page.controller.js";
import {isAuthenticated} from '../middlewares/auth.middleware.js'
const router = express.Router();

router.get("/",isAuthenticated, homePage);
router.get('/articles',isAuthenticated,articlesPage);
router.get('/article/:id',isAuthenticated,articlePage);
router.get('/categories', isAuthenticated,categoriesPage)
router.get('/category/:slug',isAuthenticated,categoryPage)
router.get('/contact',isAuthenticated,contactPage);
router.get('/error',errorPage)
// router.get('/posts',allPostPage);

export default router;
