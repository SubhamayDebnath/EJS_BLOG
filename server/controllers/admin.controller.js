import jwt from "jsonwebtoken";
import slugify from "slugify";
import { ObjectId } from "mongodb";
import { config } from "dotenv";
import fs from "fs/promises";
config();

import cloudinary from "../utils/cloudinary.js";
import Category from "../models/category.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendMail.js";

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
    const slug = slugify(title, {
      lower: true,
      strict: true,
      replacement: "-",
    });
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
      slug: slug,
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
  Change Post Status Method
*/
const changePostStatus=async(req,res,next)=>{
  try {
    const postID=req.params.id;
    const {status}=req.body;
    const post=await Post.findById({_id:postID});
    if(!post){
      req.flash("error_msg","Post not found");
      return res.redirect("/dashboard/articles");
    }
    post.status=status==="true";  
    await post.save();
    req.flash("success_msg","Post status updated");
    return res.redirect("/dashboard/articles");
  } catch (error) {
    console.log(`Post Status error : ${error}`);
    res.redirect("/error");
  }
}
/*
  Add Comment Method
*/
const addComment = async (req, res, next) => {
  try {
    const { postID, name, email, comment } = req.body;
    const uniqueId = new ObjectId();
    const postSlug = await Post.findById({ _id: postID }).populate(
      "author",
      "email"
    );
    const post = await Post.findByIdAndUpdate(
      { _id: postID },
      {
        $push: {
          comments: {
            _id: uniqueId,
            name: name,
            email: email,
            comment: comment,
            date: Date.now(),
          },
        },
      }
    );
    if (!post) {
      req.flash("error_msg", "Failed to add comment");
      return res.redirect(`/article/${postSlug.slug}`);
    }
    const latestComment = post.comments[post.comments.length - 1];
    const commentId = latestComment._id;
    const authorEmail = postSlug.author.email;
    const commentURL = `${process.env.APP_URL}/article/${postSlug.slug}#${commentId}`;
    const subject = `New Comment on Your Blog Post: "${postSlug.title}"`;
    const message = `Hi there,\n\nYou have received a new comment on your blog post "${postSlug.title}".\n\nComment by: ${name}\n\n"${comment}"\n\nCheck out the full comment in the dashboard.\n\nBest regards,\nYour Blog Team \n\n.<a href=${commentURL} target="_blank">Click here to see</a>`;
    await sendEmail(authorEmail, subject, message);
    req.flash("success_msg", "Comment added successfully");
    return res.redirect(`/article/${postSlug.slug}`);
  } catch (error) {
    console.log(`Add Comment error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Reply Method
*/
const doReplay = async (req, res, next) => {
  try {
    const { postID, commentID, reply } = req.body;
    if (!postID || !commentID || !reply) {
      req.flash("error_msg", "Please fill in all fields");
      return res.redirect(`/dashboard/comments`);
    }
    const uniqueId = new ObjectId();
    const currentUser = req.user;
    const post = await Post.updateOne(
      {
        _id: new ObjectId(postID),
        "comments._id": new ObjectId(commentID),
      },
      {
        $push: {
          "comments.$.replies": {
            _id: uniqueId,
            reply: reply,
            user: currentUser._id,
            username: currentUser.username,
            date: Date.now(),
          },
        },
      }
    );
    if (!post) {
      req.flash("error_msg", "Failed to add reply");
      return res.redirect(`/dashboard/comment/${postID}/reply/${commentID}`);
    }
    const postSlug = await Post.findById({ _id: new ObjectId(postID) });
    const latestComment = postSlug.comments[postSlug.comments.length - 1];
    const commentId = latestComment._id;
    const commentURL = `${process.env.APP_URL}/article/${postSlug.slug}#${commentId}`;
    const subject = `Your Comment Was Replied To`;
    const message = `Hello,\n\nthere was a new reply to your comment on the post titled: "${postSlug.title}".\n\nReply:${reply}\n\n.You can view the reply at:<a href=${commentURL} target="_blank">Click here to see.</a> `;
    await sendEmail(currentUser.email, subject, message);
    req.flash("success_msg", "Reply added successfully");
    return res.redirect(`/dashboard/comment/${postID}/reply/${commentID}`);
  } catch (error) {
    console.log(`Reply error : ${error}`);
    res.redirect("/error");
  }
};

/*
  Update Post method
*/
const updatePost=async (req,res,next) => {
  try {
    const postId  = req.params.id; 
    console.log(req.body);
    const { title, postBody, tags, category, status } = req.body;
    if (!title || !postBody || !tags || !category || !status) {
      req.flash("error_msg", "All fields are required");
      return res.redirect(`/dashboard/articles/update/${postId}`);
    }
    const post = await Post.findById({_id:postId});
    if (!post) {
      req.flash("error_msg", "Post not found");
      return res.redirect("/dashboard/articles");
    }
    let slug = post.slug;
    if (title !== post.title) {
        slug = slugify(title, {
          lower: true,
          strict: true,
          replacement: "-",
        });
        const existingPost = await Post.findOne({ slug: slug, _id: { $ne: postId } });
        if(!existingPost){
          slug = `${slug}-${Date.now()}`;
        }
    }   
    let image = post.image.secure_url;
    let public_id = post.image.public_id;
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
    post.image = {
      public_id,
      secure_url: image,
    };
    post.title = title;
    post.content = postBody;
    post.category = category;
    post.tags = tags.split(',').map(tag => tag.trim());
    post.status = status === "true"; 
    post.slug = slug; 
    post.image = { public_id, secure_url: image };

    await post.save();
    req.flash("success_msg", "Post updated successfully");
    return res.redirect(`/dashboard/articles`);
  } catch (error) {
    console.error("Update Post: ", error);
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
    });
  }
}

/*
  Delete Post method
*/ 

const deletePost=async(req,res,next)=>{
  try {
    const postID=req.params.id;
    if(!postID){
      req.flash("error_msg","Invalid post ID");
      return res.redirect("/dashboard/articles");
    }
    const deletedPost=await Post.findByIdAndDelete({_id:postID});
    if(!deletedPost){
      req.flash("error_msg","Failed to delete post");
      return res.redirect("/dashboard/articles");
    }
    req.flash("success_msg", "Post deleted successfully!");
    return res.redirect("/dashboard/articles");
  } catch (error) {
    console.log(`Delete post error : ${error}`);
    res.redirect("/error");
  }
}
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

export {
  addCategory,
  deleteCategory,
  updateCategory,
  addPost,
  updateUser,
  addComment,
  doReplay,
  changePostStatus,
  deletePost,
  updatePost
};
