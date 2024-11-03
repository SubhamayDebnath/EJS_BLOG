const utilsLayout = "../views/layouts/utils";
const adminLayout = '../views/layouts/admin'
const dashboard=async (req,res,next) => {
    try {
        const locals = {
            title: "Dashboard",
            description: "Welcome to Dashboard",
        };
        res.render('admin/index',{ locals,layout: adminLayout,})
    } catch (error) {
        console.log(`Dashboard error : ${error}`);
        res.render('utils/error',{ locals:{title: "Error",description: "Welcome to our home page"}, layout: utilsLayout,message:error })
    }
}
const articlePage=async (req,res,next) => {
    try {
        const locals = {
            title: "Article",
            description: "Welcome to Article",
        };
        res.render('admin/articles',{ locals,layout: adminLayout,})
    } catch (error) {
        console.log(`Dashboard error : ${error}`);
        res.render('utils/error',{ locals:{title: "Error",description: "Welcome to our home page"}, layout: utilsLayout,message:error })
    }
}
export{
    dashboard,
    articlePage
}