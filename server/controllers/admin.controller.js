import Category from "../models/category.model.js";
const addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      req.flash("error_msg", "Please enter a category name");
      return res.redirect("/dashboard/category/add");
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      req.flash("error_msg", "Category already exists");
      return res.redirect("/dashboard/category/add");
    }
    const category = await Category.create({ name });
    if (!category) {
      req.flash("error_msg", "Failed to add category");
      return res.redirect("/dashboard/category/add");
    }
    await category.save();
    req.flash("success_msg", "Category added successfully!");
    return res.redirect("/dashboard/category/add");
  } catch (error) {
    console.log(`Add Category error : ${error}`);
    res.redirect("/error");
  }
};
const deleteCategory = async (req, res, next) => {
  try {
    const catID = req.params.id;
    if (!catID) {
      req.flash("error_msg", "Invalid category ID");
      return res.redirect("/dashboard/categories");
    }
    const deletedCategory = await Category.findByIdAndDelete({ _id: catID });
    if (!deletedCategory) {
      req.flash("error_msg", "Failed to delete category");
      res.redirect("/dashboard/categories");
    }
    req.flash("success_msg", "Category deleted successfully!");
    return res.redirect("/dashboard/categories");
  } catch (error) {
    console.log(`Delete Category error : ${error}`);
    res.redirect("/error");
  }
};
const updateCategory = async (req, res, next) => {
  try {
    const catId = req.params.id;
    if (!catId) {
      req.flash("error_msg", "Invalid category ID");
      return res.redirect("/dashboard/categories");
    }
    const category = await Category.findById(catId);
    if (!category) {
      req.flash("error_msg", "Category not found");
      return res.redirect("/dashboard/categories");
    }
    const { name } = req.body;
    if (!name) {
      req.flash("error_msg", "Category name is required");
      return res.redirect(`/dashboard/category/update/${catId}`);
    }
    category.name = name;
    await category.save();
    req.flash("success_msg", "Category updated successfully!");
    return res.redirect("/dashboard/categories");
  } catch (error) {
    console.log(`Update Category error : ${error}`);
    res.redirect("/error");
  }
};

const addPost=async (req,res,next) => {
    try {
        console.log(req.body);
    } catch (error) {
        console.log(`Add Post error : ${error}`);
        res.redirect("/error");
    }
}
export { addCategory, deleteCategory, updateCategory,addPost };
