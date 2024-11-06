import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Category from "../models/category.model.js"
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const utilsLayout = "../views/layouts/utils";

/*
  Home Page Render
*/ 
const homePage = async (req, res, next) => {
  try {
    const locals = {
      title: "Home Page",
      description: "Welcome to our home page",
    };
    const categories = await Category.find();
    const latestPosts = await Post.find({ status: true }).sort({ createdAt: -1 }).limit(5).populate('category', 'name');
    res.render("index", { locals,user:req.user,categories,latestPosts });
  } catch (error) {
    console.log(`Home page error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Articles Page Render
*/ 
const articlesPage = async (req, res, next) => {
  try {
    const locals = {
      title: "articles Page",
      description: "Welcome to our articles page",
    };
    let perPage = 6;
    let page = req.query.page || 1;
    const posts = await Post.find({status: true })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments({});
    const totalPages = Math.ceil(count / perPage);
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    const prevPage = page > 1 ? page - 1 : null;
    res.render("articles", { 
      locals,
      user:req.user ,
      posts,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      prevPage,
      totalPages,
     });
  } catch (error) {
    console.log(`Articles page error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Full article Page Render
*/ 
const articlePage=async (req,res,next) => {
  try {
    const articleSlug=req.params.slug;
    if(!articleSlug){
      return res.redirect("/articles");
    }
    const article =  await Post.findOne({slug:articleSlug}).populate("category", "name").populate('author','username avatar');
    if(!article){
      return res.redirect("/articles");
    }
    const locals = {
      title: article.title,
      description: "Welcome to our articles page",
    };
    res.render("article", { locals,user:req.user,article});
  } catch (error) {
    console.log(`Article page error : ${error}`);
    res.redirect("/error");
  }
}

/*
  Categories Page Render
*/ 
const categoriesPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Categories Page",
      description: "Welcome to our Categories page",
    };
    const categories = await Category.find();
    res.render("categories", { locals,user:req.user,categories});
  } catch (error) {
    console.log(`Categories page error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Categories Page Render
*/ 
const categoryPage = async (req, res, next) => {
  try {
    const categoryName = req.params.slug;
    const category = await Category.findOne({ name: categoryName });
    let perPage = 6;
    let page = req.query.page || 1;
    const posts = await Post.find({ category: category._id,status: true })
      .populate("category", "name")
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
    const count = await Post.countDocuments({});
    const totalPages = Math.ceil(count / perPage);
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    const prevPage = page > 1 ? page - 1 : null;
    const locals = {
      title: "Posts in " + category.name,
      description: "Posts in " + category.name,
    };
    res.render("category", {
      locals,
      user:req.user,
      posts, 
      categoryName: category.name, 
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      prevPage,
      totalPages,
    });
  } catch (error) {
    console.log(`Categories page error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Contact Page Render
*/ 
const contactPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Contact Page",
      description: "Welcome to our Contact page",
    };
    res.render("contact", { locals,user:req.user  });
  } catch (error) {
    console.log(`Contact page error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Error Page Render
*/ 
const errorPage=async (req,res,next) => {
  res.render("utils/error", {
    locals: { title: "Error", description: "Welcome to our home page" },
    layout: utilsLayout,
  });
}


export { homePage, articlesPage,articlePage, contactPage, categoriesPage,categoryPage,errorPage};
