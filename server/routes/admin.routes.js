import express from "express";
import {addCategory,deleteCategory,updateCategory} from '../controllers/admin.controller.js'
import {isAuthorized} from '../middlewares/auth.middleware.js'
const router = express.Router();
router.post("/category/add",isAuthorized,addCategory);
router.delete("/category/delete/:id",isAuthorized,deleteCategory)
router.put("/category/update/:id",isAuthorized,updateCategory)
export default router;
