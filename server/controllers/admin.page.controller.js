const utilsLayout = "../views/layouts/utils";
const adminLayout = "../views/layouts/admin";
const dashboard = async (req, res, next) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Welcome to Dashboard",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(`Dashboard error : ${error}`);
    res.render("utils/error", {
      locals: { title: "Error", description: "Welcome to our home page" },
      layout: utilsLayout,
      message: error,
    });
  }
};
const articlesPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Article",
      description: "Welcome to Article",
    };
    res.render("admin/articles", { locals, layout: adminLayout });
  } catch (error) {
    console.log(`Dashboard error : ${error}`);
    res.render("utils/error", {
      locals: { title: "Error", description: "Welcome to our home page" },
      layout: utilsLayout,
      message: error,
    });
  }
};
const categoriesPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Categories",
      description: "Welcome to Categories",
    };
    res.render("admin/categories", { locals, layout: adminLayout });
  } catch (error) {
    console.log(`Categories error : ${error}`);
    res.render("utils/error", {
      locals: { title: "Error", description: "Welcome to our home page" },
      layout: utilsLayout,
      message: error,
    });
  }
};
const usersPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Users",
      description: "Welcome to Users",
    };
    res.render("admin/users", { locals, layout: adminLayout });
  } catch (error) {
    console.log(`Users error : ${error}`);
    res.render("utils/error", {
      locals: { title: "Error", description: "Welcome to our home page" },
      layout: utilsLayout,
      message: error,
    });
  }
};
const contactPage = async (req, res, next) => {
  try {
    const locals = {
      title: "Contact Form",
      description: "Welcome to Contact Form",
    };
    res.render("admin/contact", { locals, layout: adminLayout });
  } catch (error) {
    console.log(`Contact Form error : ${error}`);
    res.render("utils/error", {
      locals: { title: "Error", description: "Welcome to our home page" },
      layout: utilsLayout,
      message: error,
    });
  }
};
export { dashboard, articlesPage, categoriesPage, usersPage, contactPage };
