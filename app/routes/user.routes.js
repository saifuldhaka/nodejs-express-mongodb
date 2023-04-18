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

  app.get("/api/user/all", userController.allAccess);

  app.get("/api/user/user", [authJwt.verifyToken], userController.userBoard);

  app.post("/api/user/change-password", [authJwt.verifyToken], userController.changePassword);

  app.get("/api/user/view-profile/:id", [authJwt.verifyToken], userController.viewProfile);
  app.post("/api/user/create-profile", [authJwt.verifyToken], userController.createProfile);
  app.post("/api/user/update-profile/:id", [authJwt.verifyToken], userController.changeProfile);

  
  
  app.get(
    "/api/user/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    userController.moderatorBoard
  );

  app.get(
    "/api/user/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.adminBoard
  );
};