const { authJwt } = require("../middlewares");
// const controller = require("../controllers/user.controller");
const tutorials = require("../controllers/tutorial.controller");

module.exports = app => {

    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });


    // const tutorials = require("../controllers/tutorial.controller.js");

    var router = require("express").Router();
    app.use("/api/tutorials", router);

    // Create a new Tutorial
    router.post("/", tutorials.create);

    // Retrieve all Tutorials and no need login
    router.get("/", tutorials.findAll);

    // Retrieve all published Tutorials and has admin access
    router.get("/published", [authJwt.verifyToken, authJwt.isAdmin ], tutorials.findAllPublished);

    // Retrieve a single Tutorial with id and can see after login
    router.get("/:id", [authJwt.verifyToken], tutorials.findOne)

    // authJwt.isAdmin , authJwt.isModerator

    // Update a Tutorial with id, admin and moderator can edit 
    router.put("/:id", [authJwt.verifyToken, authJwt.isAdmin , authJwt.isModerator], tutorials.update);

    // Delete a Tutorial with id, only admin can delete 
    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], tutorials.delete);

    // Delete all Tutorials, only admin can delete 
    router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], tutorials.deleteAll);

    
}