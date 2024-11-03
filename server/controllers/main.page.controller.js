import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
const utilsLayout = "../views/layouts/utils";
const homePage = async (req, res, next) => {
  try {
    const locals = {
      title: "Home Page",
      description: "Welcome to our home page",
    };
    res.render("index", { locals,user:req.user });
  } catch (error) {
    console.log(`Home page error : ${error}`);
    res.redirect("/error");
  }
};
const articlesPage = async (req, res, next) => {
  try {
    const locals = {
      title: "articles Page",
      description: "Welcome to our articles page",
    };
    res.render("articles", { locals,user:req.user  });
  } catch (error) {
    console.log(`Articles page error : ${error}`);
    res.redirect("/error");
  }
};

const categoriesPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Categories Page",
      description: "Welcome to our Categories page",
    };
    res.render("categories", { locals,user:req.user  });
  } catch (error) {
    console.log(`Categories page error : ${error}`);
    res.redirect("/error");
  }
};

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

const errorPage=async (req,res,next) => {
  res.render("utils/error", {
    locals: { title: "Error", description: "Welcome to our home page" },
    layout: utilsLayout,
  });
}


export { homePage, articlesPage, contactPage, categoriesPage,errorPage};
