import jwt from "jsonwebtoken";
import slugify from 'slugify';
import { config } from "dotenv";
import fs from "fs/promises";
config();

import cloudinary from "../utils/cloudinary.js";
import Category from "../models/category.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

const jwtSecret = process.env.JWT_SECRET;

/*
  Add Category Method
*/ 
const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      req.flash("error_msg", "Please enter a category name");
      return res.redirect("/dashboard/category/add");
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      req.flash("error_msg", "Category already exists");
      return res.redirect("/dashboard/category/add");
    }
    const category = await Category.create({ name });
    if (!category) {
      req.flash("error_msg", "Failed to add category");
      return res.redirect("/dashboard/category/add");
    }
    await category.save();
    req.flash("success_msg", "Category added successfully!");
    return res.redirect("/dashboard/category/add");
  } catch (error) {
    console.log(`Add Category error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Delete Category Method
*/ 
const deleteCategory = async (req, res, next) => {
  try {
    const catID = req.params.id;
    if (!catID) {
      req.flash("error_msg", "Invalid category ID");
      return res.redirect("/dashboard/categories");
    }
    const deletedCategory = await Category.findByIdAndDelete({ _id: catID });
    if (!deletedCategory) {
      req.flash("error_msg", "Failed to delete category");
      res.redirect("/dashboard/categories");
    }
    req.flash("success_msg", "Category deleted successfully!");
    return res.redirect("/dashboard/categories");
  } catch (error) {
    console.log(`Delete Category error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Update Category Method
*/ 
const updateCategory = async (req, res, next) => {
  try {
    const catId = req.params.id;
    if (!catId) {
      req.flash("error_msg", "Invalid category ID");
      return res.redirect("/dashboard/categories");
    }
    const category = await Category.findById(catId);
    if (!category) {
      req.flash("error_msg", "Category not found");
      return res.redirect("/dashboard/categories");
    }
    const { name } = req.body;
    if (!name) {
      req.flash("error_msg", "Category name is required");
      return res.redirect(`/dashboard/category/update/${catId}`);
    }
    category.name = name;
    await category.save();
    req.flash("success_msg", "Category updated successfully!");
    return res.redirect("/dashboard/categories");
  } catch (error) {
    console.log(`Update Category error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Add Post Method
*/ 
const addPost = async (req, res, next) => {
  try {
    const { title, postBody, tags, category, status } = req.body;
    if (!title || !postBody || !tags || !category || !status) {
      req.flash("error_msg", "All fields are required");
      return res.redirect("/dashboard/articles/add");
    }
    const slug = slugify(title, {lower: true,strict: true,replacement: '-', });
    let existingPost = await Post.findOne({ slug: slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }
    const decoded = jwt.verify(req.cookies.token, jwtSecret);
    let image = "";
    let public_id = "";
    if (!req.file) {
      req.flash("error_msg", "Please upload an image.");
      return res.redirect("/dashboard/articles/add");
    }
    if (req.file) {
      const transformationOptions = {
        transformation: [
          {
            quality: "auto:low",
            fetch_format: "avif",
          },
        ],
      };

      const cloudinaryResult = await cloudinary.uploader.upload(
        req.file.path,
        transformationOptions
      );
      image = cloudinaryResult.secure_url;
      public_id = cloudinaryResult.public_id;
      fs.rm(req.file.path);
    }
    const post = await Post.create({
      image: {
        public_id: public_id,
        secure_url: image,
      },
      title: title,
      content: postBody,
      category: category,
      tags: tags.split(","),
      status: status === "true",
      author: decoded.userId,
      slug:slug
    });
    if (!post) {
      req.flash("error_msg", "Failed to create post");
      return res.redirect("/dashboard/articles/add");
    }
    await post.save();
    req.flash("success_msg", "Post created successfully");
    return res.redirect("/dashboard/articles/add");
  } catch (error) {
    console.log(`Add Post error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Update User Method
*/ 
const updateUser = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const { username } = req.body;
    if (!username) {
      req.flash("error_msg", "Please fill in all fields");
      return res.redirect(`/dashboard/me/update/${userID}`);
    }
    const user = await User.findById(userID);
    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/dashboard/me");
    }
    let image = user.avatar.secure_url;
    let public_id = user.avatar.public_id;
    if (req.file) {
      await cloudinary.uploader.destroy(public_id);
      const transformationOptions = {
        transformation: [
          {
            quality: "auto:low",
            fetch_format: "avif",
          },
        ],
      };

      const cloudinaryResult = await cloudinary.uploader.upload(
        req.file.path,
        transformationOptions
      );

      image = cloudinaryResult.secure_url;
      public_id = cloudinaryResult.public_id;
      await fs.rm(req.file.path);
    }
    user.avatar = {
      public_id: public_id,
      secure_url: image,
    };
    if (username) {
      user.username = username;
    }
    await user.save();
    req.flash("success_msg", "Profile updated successfully");
    return res.redirect("/dashboard/me");
  } catch (error) {
    console.log(`Update Post error : ${error}`);
    res.redirect("/error");
  }
};
export { addCategory, deleteCategory, updateCategory, addPost, updateUser };
