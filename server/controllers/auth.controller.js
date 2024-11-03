import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
import User from "../models/user.model.js";
const jwtSecret = process.env.JWT_SECRET;
const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};
const utilsLayout = "../views/layouts/utils";
const authenticationLayout = "../views/layouts/authentication";
const registerPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Register Page",

      description: "Welcome to Register Page",
    };
    res.render("auth/register", {
      locals,
      layout: authenticationLayout,
      message: undefined,
    });
  } catch (error) {
    console.log(`Register error : ${error}`);
res.redirect("/error");
  }
};

const loginPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Login Page",
      description: "Welcome to Login Page",
    };
    res.render("auth/login", {
      locals,
      layout: authenticationLayout,
      message: undefined,
    });
  } catch (error) {
    console.log(`Login error : ${error}`);
res.redirect("/error");
  }
};
const register = async (req, res, next) => {
  try {
    // const locals = {
    //   title: "Register Page",

    //   description: "Welcome to Register Page",
    // };
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.redirect("/register", {
        locals,
        layout: authenticationLayout,
        message: "Please fill in all fields",
      });
    }
    res.redirect("/register", {
      locals,
      layout: authenticationLayout,
      message: "Please fill in all fields",
    });
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
  } catch (error) {
    console.log(`Login error : ${error}`);
    res.redirect("/error");
  }
};
export { registerPage, loginPage, register };
