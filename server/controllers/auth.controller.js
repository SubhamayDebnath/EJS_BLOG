import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import fs from "fs/promises";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary.js";
import sendEmail from "../utils/sendMail.js";
config();
import User from "../models/user.model.js";


const jwtSecret = process.env.JWT_SECRET;
const cookieOption = {
  maxAge: 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};
const authenticationLayout = "../views/layouts/authentication";

/*
  Register Page Render
*/ 
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
/*
  Login Page Render
*/ 
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


/*
  Forget Password Using Mail Page Render
*/ 
const forgetPasswordPage = async (req, res, next) => {
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
};
/*
  Reset password Using Mail Page Render
*/ 
const resetPasswordPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Reset Password Page",
      description: "Welcome to Reset Password Page",
    };
    const token=req.params.slug;
    res.render("auth/resetPassword", { locals, layout: authenticationLayout ,token});
  } catch (error) {
    console.log(`Reset Password Page error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Send Reset Mail Method
*/ 
const resetPasswordSendMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      req.flash("error_msg", "Email is required");
      return res.redirect("/auth/password/forget-password");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      req.flash("error_msg", "Please enter valid email");
      return res.redirect("/auth/password/forget-password");
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();
    const resetPasswordURL = `${process.env.APP_URL}/auth/password/reset-password/${resetToken}`;
    const subject = "Reset Password";
    const message = `You can reset your password by clicking <a href=${resetPasswordURL} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordURL}.\nIf you have not requested this, kindly ignore.`;
    try {
      await sendEmail(email, subject, message);
      req.flash(
        "success_msg",
        `<p class="text-warning"> Reset password has been send to ${email} successfully.Please check your email inbox and spam folder for the password reset link.</p> `
      );
      return res.redirect("/auth/password/forget-password");
    } catch (error) {
      user.forgotPasswordExpiry = undefined;
      user.forgotPasswordToken = undefined;
      await user.save();
      req.flash("error_msg", "Failed to send email");
      return res.redirect("/auth/password/forget-password");
    }
  } catch (error) {
    console.log(`Reset Password Send Mail error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Reset password Method
*/ 
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const resetToken = token;
    const newPassword=await bcrypt.hash(password, 10);
    const forgotPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await User.findOne({
      forgotPasswordToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error_msg", "Invalid reset token");
      return res.redirect("/auth/password/forget-password");
    }
    if(user.password === newPassword){
      req.flash("error_msg", "Your new password cannot be the same as the current password.");
      return res.redirect(`/auth/password/reset-password/${resetToken}`);
    }
    user.password = newPassword;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    await user.save();
    req.flash("success_msg", "Reset Password successfully,Please login to access your account");
    return res.redirect("/login");
  } catch (error) {
    console.log(`Reset Password error : ${error}`);
    res.redirect("/error");
  }
};
/*
  Change Password Method
*/ 
const changePassword=async(req,res,next)=>{
  try {
    const userID=req.params.id;
    const {currentPassword,newPassword}=req.body;
    const user=await User.findById({_id:userID});
    if(!user){
      req.flash("error_msg","Invalid User");
      res.redirect('/dashboard/me/change-password')
    }
    if(currentPassword == newPassword){
      req.flash("error_msg","Your new password cannot be the same as the current password.");
      return res.redirect(`/dashboard/me/change-password`);
    }
    const hashPassword=await bcrypt.hash(newPassword, 10);
    user.password=hashPassword;
    await user.save();
    req.flash("success_msg","Password changed successfully");
    return res.redirect('/dashboard/me/change-password');
  }catch(error){
    console.log(`Change Password error : ${error}`);
    res.redirect("/error");
  }
}
/*
  User Register Method
*/ 
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
        secure_url: image,
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

/*
  User Login Method
*/ 

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
/*
  Logout Method
*/ 
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.redirect("/login");
  } catch (error) {
    console.log(`Logout error : ${error}`);
    res.redirect("/error");
  }
};
export {
  registerPage,
  loginPage,
  register,
  login,
  logout,
  forgetPasswordPage,
  resetPasswordPage,
  resetPasswordSendMail,
  resetPassword,
  changePassword
};
