import express from "express";
import {addCategory,deleteCategory,updateCategory,addPost,updateUser,addComment,doReplay,changePostStatus,deletePost,updatePost} from '../controllers/admin.controller.js'
import {isAuthorized} from '../middlewares/auth.middleware.js'
import  upload  from '../middlewares/multer.middleware.js'
const router = express.Router();
router.post("/category/add",isAuthorized,addCategory);
router.delete("/category/delete/:id",isAuthorized,deleteCategory)
router.put("/category/update/:id",isAuthorized,updateCategory)
router.post("/post/add",isAuthorized,upload.single('avatar'),addPost)
router.post("/add-comment",addComment)
router.post("/add-reply",isAuthorized,doReplay)
router.post("/status/change/:id",isAuthorized,changePostStatus);
router.delete("/post/delete/:id",isAuthorized,deletePost)
router.put("/post/update/:id",isAuthorized,upload.single('avatar'),updatePost)
router.put("/user/update/:id",isAuthorized,upload.single('avatar'),updateUser)

export default router;
