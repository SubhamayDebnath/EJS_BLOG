import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
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
    res.render("utils/error", {
      locals: { title: "Error", description: "Welcome to our home page" },
      layout: utilsLayout,
    });
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
    res.render("utils/error", {
      locals: { title: "Error", description: "Welcome to our home page" },
      layout: utilsLayout,
    });
  }
};
const register = async (req, res, next) => {
  try {
    const locals = {
      title: "Register Page",

      description: "Welcome to Register Page",
    };
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.render("auth/register", {
        locals,
        layout: authenticationLayout,
        message: "Please fill in all fields",
      });
    }
    if (username !== "weee") {
      res.render("auth/register", {
        locals,
        layout: authenticationLayout,
        message: "working",
      });
    }
  } catch (error) {
    console.log(`Login error : ${error}`);
    res.render("utils/error", {
      locals: { title: "Error", description: "Welcome to our home page" },
      layout: utilsLayout,
    });
  }
};
export { registerPage, loginPage, register };
