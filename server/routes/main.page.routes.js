import express from "express";
import { homePage ,articlesPage,contactPage, categoriesPage} from "../controllers/main.page.controller.js";
const router = express.Router();

router.get("/", homePage);
router.get('/articles',articlesPage);
router.get('/categories', categoriesPage)
router.get('/contact',contactPage);
// router.get('/posts',allPostPage);

export default router;
