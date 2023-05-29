const { authJwt } = require("../middlewares");
// const controller = require("../controllers/user.controller");
const categoryController = require("../controllers/category.controller");
const { model } = require("mongoose");

module.exports = app => {

    app.use(function(req, res, next) {
        req.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
    });

    var router = require("express").Router();
    app.use("/api/categories", router);


    router.get("/categories", categoryController.getAllCategory);
    router.get("/sub-categories", categoryController.getAllSubCategory);
    router.get("/categories-sub-categories", categoryController.getAllCategoriesSubCategory);


} 