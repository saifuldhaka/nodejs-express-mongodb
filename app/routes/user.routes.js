const { authJwt } = require("../middlewares");
const userController = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  var router = require("express").Router();
  app.use("/api/users", router);

  app.get("/api/user/all", userController.allAccess);



  router.get("/user", [authJwt.verifyToken], userController.userBoard);
  router.get("/mod",[authJwt.verifyToken, authJwt.isModerator], userController.moderatorBoard );
  router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], userController.adminBoard);




  router.post("/change-password", [authJwt.verifyToken], userController.changePassword);
  router.post("/create-profile", [authJwt.verifyToken], userController.createProfile);
  router.get("/view-profile/:id", [authJwt.verifyToken], userController.viewProfile);
  router.post("/update-profile/:id", [authJwt.verifyToken], userController.updateProfile);


  router.get("/user-list/:id", [authJwt.verifyToken, authJwt.isAdmin], userController.getUserList);
  

};