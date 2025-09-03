const Category = require('../../models/Admin/Category');

function getAllCategories(req, res){
    const categories = Category.fetchAllCategories();
    res.render('admin/page/category/view-category', {categories: categories});
}

module.exports = {
    getAllCategories: getAllCategories
}