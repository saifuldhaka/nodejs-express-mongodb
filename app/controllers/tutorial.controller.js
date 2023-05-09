const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

// const Tutorial = db.tutorials;
const Tutorial = db.tutorials;
const PurchasedTutorial = db.purchasedTutorials;

const getPagination = (page, size) => {
  const limit = size ? +size : 30;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const loginUserId = '';
const tutorialDetails = [];

const findUserId = (req, res, next) => {
  let token = req;  
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    this.loginUserId = decoded.id;
  });
};

// Create and Save a new Tutorial
exports.create = (req, res) => {
  
  let token = req.headers["x-access-token"];
  findUserId(token);
    
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    author_id: this.loginUserId,
    published: req.body.published ? req.body.published : false,
  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const { page, size, title } = req.query;

  var conditions = { 
    // author_id: this.loginUserId,
  };
  if(title){
    conditions.title = { $regex: new RegExp(title), $options: "i" }
  }    

  var options = {
    sort: ({ createdAt: -1 })
  };

  const { limit, offset  } = getPagination(page, size);

  Tutorial.paginate(conditions, { limit, offset, options })
    .then((data) => {

      const tempTutorials = [];
      var tutorials = data.docs;
      tutorials.forEach((tutorial) => {
        var temp = {
          "user_id": tutorial.author_id,
          // "title": tutorial.title,
          // "description": tutorial.description.split(/\s+/).slice(0, 10).join(" ") + " ....",
          // "published": tutorial.published,
          "createdAt": tutorial.createdAt,
          "updatedAt": tutorial.updatedAt,
          "id": tutorial.id
        };
        tempTutorials.push(temp);
      });

      res.send({
        totalItems: data.totalDocs,
        tutorials: tempTutorials,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id,
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  const { page, size, title } = req.query;

  var conditions = { 
    published: true
  };
  if(title){
    conditions.title = { $regex: new RegExp(title), $options: "i" }
  }    

  var options = {
    sort: ({ createdAt: -1 })
  };

  const { limit, offset  } = getPagination(page, size);

  Tutorial.paginate(conditions, { offset, limit, options })
    .then((data) => {

      const tempTutorials = [];
      var tutorials = data.docs;
      tutorials.forEach((tutorial) => {
        var temp = {
          "author_id": tutorial.author_id,
          "title": tutorial.title,
          "description": tutorial.description.split(/\s+/).slice(0, 10).join(" ") + " ....",
          "published": tutorial.published,
          "createdAt": tutorial.createdAt,
          "updatedAt": tutorial.updatedAt,
          "id": tutorial.id
        };
        tempTutorials.push(temp);
      });

      res.send({
        totalItems: data.totalDocs,
        tutorials: tempTutorials,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

// Find all My Tutorials
exports.findMyTutorials = (req, res) => {
  let token = req.headers["x-access-token"];
  findUserId(token);

  const { page, size, title } = req.query;

  var conditions = { 
    author_id: this.loginUserId,
  };
  if(title){
    conditions.title = { $regex: new RegExp(title), $options: "i" }
  }    

  var options = {
    sort: ({ createdAt: -1 })
  };

  const { limit, offset  } = getPagination(page, size);

  Tutorial.paginate(conditions, { offset, limit , options })
    .then((data) => {
      const tempTutorials = [];
      var tutorials = data.docs;

      // console.log(tutorials);


      tutorials.forEach((tutorial) => {
        var temp = {
          "author_id": tutorial.author_id,
          "title": tutorial.title,
          "description": tutorial.description.split(/\s+/).slice(0, 10).join(" ") + " ....",
          "published": tutorial.published,
          "createdAt": tutorial.createdAt,
          "updatedAt": tutorial.updatedAt,
          "id": tutorial.id
        };
        tempTutorials.push(temp);
      });

      res.send({
        totalItems: data.totalDocs,
        tutorials: tempTutorials,
        totalPages: data.totalPages,
        currentPage: data.page - 1,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
}

exports.getMyPurchasedTutorials = (req, res) => {

  let token = req.headers["x-access-token"];
  findUserId(token);

  const { page, size, title } = req.query;

  var conditions = { 
    user_id: this.loginUserId,
  };
   

  var options = {
    sort: ({ createdAt: -1 })
  };

  const { limit, offset  } = getPagination(page, size);

  PurchasedTutorial.paginate(conditions, { offset, limit , options })
    .then((data) => {
      const tempTutorials = [];
      
      // get my purchased tutorial
      var tutorials = data.docs;

      const ids = []; // an array of ids to find
      tutorials.forEach((tutorial) => {
        ids.push(tutorial.tutorial_id);
      });

      Tutorial.find({ _id: { $in: ids } }).populate('author_id').exec(function(err, tempTutorials) {
        if (err) return handleError(err);
        res.send({
          totalItems: data.totalDocs,
          tutorials: tempTutorials,
          totalPages: data.totalPages,
          currentPage: data.page - 1
        });

      });

      // Tutorial.populate('author_id').find({ _id: { $in: ids } }, function(err, tempTutorials) {
      //   if (err) return handleError(err);       
      //   res.send({
      //     totalItems: data.totalDocs,
      //     tutorials: tempTutorials,
      //     totalPages: data.totalPages,
      //     currentPage: data.page - 1
      //   });        
      // });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });

}


exports.createMyPurchasedTutorials = (req, res) => {

  let token = req.headers["x-access-token"];
  findUserId(token);

  // Validate request
  if (!req.body.tutorial_id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Purchased Tutorial
  const tutorial = new PurchasedTutorial({
    tutorial_id: req.body.tutorial_id,
    user_id: this.loginUserId
  });

  console.log( req.body.tutorial_id);

  // Save Purchased Tutorial in the database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });



}