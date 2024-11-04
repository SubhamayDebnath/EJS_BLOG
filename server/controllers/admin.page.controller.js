import User from '../models/user.model.js'
import Category from '../models/category.model.js';
import Post from '../models/post.model.js'
const adminLayout = "../views/layouts/admin";
const dashboard = async (req, res, next) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Welcome to Dashboard",
    };
    const numberOfUsers = await User.countDocuments();
    const numberOfCategories = await Category.countDocuments();
    const numberOfPosts = await Post.countDocuments();
    res.render("admin/index", { locals, layout: adminLayout ,user:req.user, numberOfUsers,numberOfCategories ,numberOfPosts});
  } catch (error) {
    console.log(`Dashboard error : ${error}`);
    res.redirect("/error");
  }
};
const articlesPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Article",
      description: "Welcome to Article",
    };
    const posts = await Post.find()
    .populate('category', 'name') 
    .populate('author', 'username') 
    .sort({ createdAt: 1 });
    res.render("admin/articles", { locals, layout: adminLayout,user:req.user,posts });
  } catch (error) {
    console.log(`Dashboard error : ${error}`);
    res.redirect("/error");
  }
};
const categoriesPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Categories",
      description: "Welcome to Categories",
    };
    const categories = await Category.find().sort({ createdAt: 1 });
    res.render("admin/categories", { locals, layout: adminLayout,user:req.user,categories });
  } catch (error) {
    console.log(`Categories error : ${error}`);
    res.redirect("/error");
  }
};
const usersPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Users",
      description: "Welcome to Users",
    };
    res.render("admin/users", { locals, layout: adminLayout,user:req.user });
  } catch (error) {
    console.log(`Users error : ${error}`);
    res.redirect("/error");
  }
};
const contactPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Contact Form",
      description: "Welcome to Contact Form",
    };
    res.render("admin/contact", { locals, layout: adminLayout,user:req.user });
  } catch (error) {
    console.log(`Contact Form error : ${error}`);
    res.redirect("/error");
  }
};
const postByUserPage=async (req,res,next) => {
  try {
    const locals = {
      title: "Post By U",
      description: "Welcome to Post By U",
    };
    const posts = await Post.find({author:req.user._id}).sort({ createdAt: 1})
    res.render("admin/userArticle", { locals, layout: adminLayout,user:req.user,posts });
  } catch (error) {
    console.log(`Post By User page error : ${error}`);
    res.redirect("/error");
  }
}

const addPostPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Add Post Form",
      description: "Welcome to Add Post Form",
    };
    const categories = await Category.find();
    res.render("admin/form/addPostForm", { locals, layout: adminLayout,user:req.user,categories });
  } catch (error) {
    console.log(`Add Post error : ${error}`);
    res.redirect("/error");
  }
};
const addCategoryPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Add Category Form",
      description: "Welcome to Add Category Form",
    };
    res.render("admin/form/addCategoryForm", { locals, layout: adminLayout,user:req.user });
  } catch (error) {
    console.log(`Add Category error : ${error}`);
    res.redirect("/error");
  }
};
const updateCategoryPage = async (req,res,next) => {
  try {
    const locals = {
      title: "Update Category Form",
      description: "Welcome to Update Category Form",
    };
    const catID = req.params.id;
    if(!catID){
      req.flash("error_msg", "Invalid category ID");
      return res.redirect("/dashboard/categories");
    }
    const category = await Category.findById(catID);
    if(!category){
      req.flash("error_msg", "Invalid category ID");
      return res.redirect("/dashboard/categories");
    }
    res.render("admin/form/updateCategoryForm", { locals, layout: adminLayout,user:req.user,category});
    
  } catch (error) {
    console.log(`Update Category error : ${error}`);
    res.redirect("/error");
  }
}
export {
  dashboard,
  articlesPage,
  categoriesPage,
  usersPage,
  contactPage,
  postByUserPage,
  addPostPage,
  addCategoryPage,
  updateCategoryPage
};
