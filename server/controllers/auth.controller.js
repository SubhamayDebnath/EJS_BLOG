import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
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
const registerPage=async (req,res,next) => {
    try {
        const locals = {
          title: "Register Page",

          description: "Welcome to Register Page",
        };
        res.render("auth/register", { locals, layout: authenticationLayout });
      } catch (error) {
        console.log(`Register error : ${error}`);
        res.render("utils/error", {
          locals: { title: "Error", description: "Welcome to our home page" },
          layout: utilsLayout,
          message: error,
        });
      }
}

const loginPage=async (req,res,next) => {
    try {
        const locals = {
          title: "Login Page",
          description: "Welcome to Login Page",
        };
        res.render("auth/login", { locals, layout: authenticationLayout });
      } catch (error) {
        console.log(`Login error : ${error}`);
        res.render("utils/error", {
          locals: { title: "Error", description: "Welcome to our home page" },
          layout: utilsLayout,
          message: error,
        });
      }
}
const register=async (req,res,next) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
  } catch (error) {
    console.log(`Login error : ${error}`);
    res.render("utils/error", {
      locals: { title: "Error", description: "Welcome to our home page" },
      layout: utilsLayout,
      message: error,
    });
  }
}
export{
    registerPage,
    loginPage,
    register
}