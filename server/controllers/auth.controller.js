import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import fs from "fs/promises";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary.js";
config();
import User from "../models/user.model.js";
const jwtSecret = process.env.JWT_SECRET;
const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};
const authenticationLayout = "../views/layouts/authentication";
const registerPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Register Page",
      description: "Welcome to Register Page",
    };
    res.render("auth/register", { locals, layout: authenticationLayout });
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
    res.render("auth/login", { locals, layout: authenticationLayout });
  } catch (error) {
    console.log(`Login error : ${error}`);
    res.redirect("/error");
  }
};

const forgetPasswordPage=async (req,res,next)=>{
  try {
    const locals = {
      title: "Forget Page",
      description: "Welcome to Forget Page",
    };
    res.render("auth/forgetPassword", { locals, layout: authenticationLayout });
  } catch (error) {
    console.log(`Forget Password Page error : ${error}`);
    res.redirect("/error");
  }
}
const resetPasswordPage=async (req,res,next)=>{
  try {
    const locals = {
      title: "Reset Password Page",
      description: "Welcome to Reset Password Page",
    };
    res.render("auth/resetPassword", { locals, layout: authenticationLayout });
  } catch (error) {
    console.log(`Reset Password Page error : ${error}`);
    res.redirect("/error");
  }
}
const resetPassword = async(req,res,next)=>{
  try {
    console.log(req.body);
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log(resetToken)
  } catch (error) {
    console.log(`Reset Password error : ${error}`);
    res.redirect("/error");
  }
}
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      req.flash("error_msg", "Please fill in all fields");
      return res.redirect("/register");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error_msg", "Email already in use");
      return res.redirect("/register");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    let image = "";
    let public_id = "";
    if (!req.file) {
      req.flash("error_msg", "Please upload an image.");
      return res.redirect("/register");
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
    const user = await User.create({
      username,
      email,
      password: hashPassword,
      avatar: {
        public_id: public_id,
        secure_url:image
      },
    });
    if (!user) {
      req.flash("error_msg", "Failed to create user");
      return res.redirect("/register");
    }
    await user.save();
    res.redirect("/activation");
  } catch (error) {
    console.log(`Login error : ${error}`);
    res.redirect("/error");
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash("error_msg", "Please fill in all fields");
      return res.redirect("/login");
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/login");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/login");
    }
    if (user.status !== "ACTIVE") {
      res.redirect("/activation");
    } else {
      const token = jwt.sign({ userId: user._id }, jwtSecret);
      res.cookie("token", token, cookieOption);
      res.redirect("/dashboard");
    }
  } catch (error) {
    console.log(`Login error : ${error}`);
    res.redirect("/error");
  }
};
const logout=async (req,res,next) => {
  try {
    res.clearCookie('token');
    return res.redirect("/login");
  } catch (error) {
    console.log(`Logout error : ${error}`);
    res.redirect("/error");
  }
}
export { registerPage, loginPage, register, login,logout,forgetPasswordPage,resetPasswordPage,resetPassword };
