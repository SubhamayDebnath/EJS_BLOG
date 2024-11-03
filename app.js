import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
import expressLayout from "express-ejs-layouts";
import methodOverride from "method-override";
import cookieParser from "cookie-parser";
import session from "express-session";
import flush from "connect-flash";
import MongoStore from "connect-mongo";
config();

import DBConnection from "./server/config/DBConnection.js";
import mainPageRoutes from "./server/routes/main.page.routes.js";
import adminPageRoutes from "./server/routes/admin.page.routes.js";
import authRoutes from "./server/routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(express.static("public"));
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use(flush());
app.use(morgan("dev"));
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.use("", mainPageRoutes);
app.use("", authRoutes);
app.use("/dashboard", adminPageRoutes);

app.use("*", (req, res) => {
  res.status(404).send("Page Not Found");
});

app.listen(PORT, async () => {
  DBConnection();
  console.log(`server is running on port http://localhost:${PORT}`);
});
