import jwt from "jsonwebtoken";
import { config } from "dotenv";
import User from "../models/user.model.js";
config();

const jwtSecret = process.env.JWT_SECRET;

const isLoggedIn = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (token) {
      return res.redirect("/");
    }
    next();
  } catch (error) {
    console.log(`JWT error : ${error}`);
    res.redirect("/error");
  }
};

const isAuthorized = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      req.flash("error_msg", "Please log in to access this page.");
      return res.redirect("/login");
    }
    const decoded = jwt.verify(token, jwtSecret);
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      req.flash("error_msg", "Please log in to access this page.");
      return res.redirect("/login");
    }
    if (
      currentUser.role != "ADMIN" &&
      currentUser.role != "SUPERUSER" &&
      currentUser.role != "USER"
    ) {
      req.flash(
        "error_msg",
        "Unauthorized!you do not have permission to access the route"
      );
      return res.redirect("/login");
    }
    req.user=currentUser
    next();
  } catch (error) {
    console.log(`JWT error : ${error}`);
    res.redirect("/error");
  }
};

export { isLoggedIn, isAuthorized };
