const { authJwt } = require("../middlewares");
// const controller = require("../controllers/user.controller");
const tutorialController = require("../controllers/tutorial.controller");

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

    

    // Retrieve all Tutorials and no need login
    // router.get("/", tutorials.findAllPublished);




    /* USER ROLE  */ 
    router.get("/tutorials", tutorialController.findAllPublished);  
    router.get("/purchased-tutorials", [authJwt.verifyToken], tutorialController.getMyPurchasedTutorials);
    router.post("/purchased-tutorials", [authJwt.verifyToken], tutorialController.createMyPurchasedTutorials);


    
    /* AUTHOR ROLE */
    router.post("/tutorials", [authJwt.verifyToken, authJwt.isAuthor ], tutorialController.create);
    router.get("/my-tutorials", [authJwt.verifyToken, authJwt.isAuthor ], tutorialController.findMyTutorials);
    router.put("/tutorials/:id", [authJwt.verifyToken, authJwt.isAuthor ], tutorialController.updateTutorials);
    

    




    /* MODERATOR ROLE */ 
    





    // Retrieve all published Tutorials and has admin access
    // router.get("/published", [authJwt.verifyToken, authJwt.isAdmin ], tutorials.findAllPublished);



    // Retrieve a single Tutorial with id and can see after login
    router.get("/:id", [authJwt.verifyToken], tutorialController.findOne)

    // authJwt.isAdmin , authJwt.isModerator

    // Update a Tutorial with id, admin and moderator can edit 
    router.put("/:id", [authJwt.verifyToken, authJwt.isAuthor, authJwt.isModerator, authJwt.isAdmin ], tutorialController.update);

    // Delete a Tutorial with id, only admin can delete 
    router.delete("/:id", [authJwt.verifyToken, authJwt.isAdmin], tutorialController.delete);

    // Delete all Tutorials, only admin can delete 
    router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], tutorialController.deleteAll);

    
}