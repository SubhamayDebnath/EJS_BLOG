import express from "express";
import { homePage ,articlesPage,contactPage} from "../controllers/main.page.controller.js";
const router = express.Router();

router.get("/", homePage);
router.get('/articles',articlesPage);
// router.get('/post/:id',fullPostPage)
router.get('/contact',contactPage);
// router.get('/posts',allPostPage);

export default router;
