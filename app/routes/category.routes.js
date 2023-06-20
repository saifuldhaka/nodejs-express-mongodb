const { authJwt } = require("../middlewares");
// const categoryController = require("../controllers/category.controller");

const express = require('express');
const router = express.Router();

module.exports = app => {

    app.use(function(req, res, next) {
        req.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
    });

    var router = require("express").Router();
    app.use("/api/categories", router);



    // router.get("/categories", categoryController.getAllCategory);
    // router.get("/sub-categories", categoryController.getAllSubCategory);
    // router.get("/categories-sub-categories", categoryController.getAllCategoriesSubCategory);

    router.get('/categories', async (req, res) => {
        try {
        //   const categories = await Category.find();
        //   res.json(categories);
          res.status(200).json({ error: 'Success to fetch categories' });

        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch categories' });
        }
    });

    // router.get("/categories", categoryController.getAllCategory);


    // router.get("/categories", [authJwt.verifyToken], categoryController.getAllCategory);

      
} 