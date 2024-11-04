import express from "express";
import {addCategory,deleteCategory,updateCategory,addPost} from '../controllers/admin.controller.js'
import {isAuthorized} from '../middlewares/auth.middleware.js'
import  upload  from '../middlewares/multer.middleware.js'
const router = express.Router();
router.post("/category/add",isAuthorized,addCategory);
router.delete("/category/delete/:id",isAuthorized,deleteCategory)
router.put("/category/update/:id",isAuthorized,updateCategory)
router.post("/post/add",isAuthorized,upload.single('avatar'),addPost)
export default router;