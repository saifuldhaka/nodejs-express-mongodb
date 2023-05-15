const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

// const Tutorial = db.tutorials;
const Tutorial = db.tutorial;
const PurchasedTutorial = db.purchasedTutorial;
const Profile = db.profile;
const User = db.user;

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
    res.status(400).send({ message: "Title Content can not be empty!" });
    return;
  }

  if (!req.body.description) {
    res.status(400).send({ message: "Description Content can not be empty!" });
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

exports.getMyPurchasedTutorials = async (req, res) => {

  try {

    let token = req.headers["x-access-token"];
    findUserId(token);


    const page = parseInt(req.query.page) || 1; // get page number from query params, default to 1
    const limit = parseInt(req.query.limit) || 10; // get limit number from query params, default to 10
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;


    const purchasedTutorials = await PurchasedTutorial.find({user_id: this.loginUserId})
                                    .skip(startIndex)
                                    .limit(limit);

    const tutorials = await Tutorial.find();
    const profiles = await Profile.find();

    const tutorialCount = await PurchasedTutorial.countDocuments({user_id: this.loginUserId});

    const results = purchasedTutorials.map(purchasedTutorial => {
      const tutorial = tutorials.find(tutorial => tutorial._id.toString() === purchasedTutorial.tutorial_id.toString());
      const author = profiles.find(profile => profile.user_id.toString() === purchasedTutorial.author_id.toString());

      return {
        tutorial,
        author
      };
    });


    var totalPage = Math.ceil(tutorialCount / limit) 
    currentPage = page;

    var previousPage = 1;
    var nextPage = 1;
    if(totalPage == 1){
      previousPage = 1;
      nextPage = 1;
    }else
    if(currentPage == totalPage){
      previousPage = currentPage - 1;
      nextPage = currentPage;
    }else if( currentPage == 1 && totalPage > 1 ){
      previousPage = currentPage;
      nextPage = currentPage + 1;
    }else{
      previousPage = currentPage - 1;
      nextPage = currentPage + 1;
    }

    if(totalPage == 0){
      previousPage = 1;
      nextPage = 1;
    }


    res.json({
      purchased_tutorial: results,
      previousPage: previousPage,
      nextPage: nextPage,
      totalPage: totalPage,
      currentPage : currentPage,
      totalTutorial :tutorialCount
    });
    
  } catch (err) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
}

// Purchase a tutorial 
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
    author_id: req.body.author_id,
    user_id: this.loginUserId
  });

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


// Update Tutorial By Author
exports.updateTutorials = async (req, res) => {

  let token = req.headers["x-access-token"];
  findUserId(token);
    
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Title Content can not be empty!" });
    return;
  }

  if (!req.body.description) {
    res.status(400).send({ message: "Description Content can not be empty!" });
    return;
  }

  const id = req.params.id;
  
  // Tutorial Data
  var data = {
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false,
  };

  var conditions = { 
    id: id,
    author_id: this.loginUserId
  };

  Tutorial.findOneAndUpdate(
    conditions,
    { $set: data },
    { new: true }
  )
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
  
}

// count My Sold Tutorial
exports.countMySoldTutorials = (req, res) => {
  let token = req.headers["x-access-token"];
  findUserId(token);


  PurchasedTutorial.aggregate([
    {
      $match: {
        author_id: this.loginUserId
      }
    },
    {
      $group: {
        _id: '$tutorial_id',
        sold_units: { $sum: 1 }
      }
    }
  ])
    .then(results => {
      // Fetch the tutorial details for each sold tutorial
      const tutorialPromises = results.map(result => {
        return Tutorial.findById(result._id)
          .then(tutorial => {
            return {
              // tutorial: {},
              title: tutorial.title, 
              tutorial_id: tutorial.id,
              sold_units: result.sold_units
            };
          });
      });
  
      // Resolve all tutorial promises
      return Promise.all(tutorialPromises);
    })

    .then((resultsWithTutorialDetails) => {
      res.send(resultsWithTutorialDetails);


    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });


}




exports.countTutorialSold = (req, res) => {

    PurchasedTutorial.aggregate([
      {
        $match: {
          author_id: 4
        }
      },
      {
        $group: {
          _id: '$tutorial_id',
          sold_units: { $sum: 1 }
        }
      }
    ])
    .then(results => {
      // Fetch the tutorial details for each sold tutorial
      const tutorialPromises = results.map(result => {
        return Tutorial.findById(result._id)
          .then(tutorial => {
            return {
              tutorial: tutorial,
              sold_units: result.sold_units
            };
          });
      });

      // Resolve all tutorial promises
      return Promise.all(tutorialPromises);
    })
    .then(resultsWithTutorialDetails => {
      // Output the results with tutorial details
      console.log(resultsWithTutorialDetails);
    })
    .catch(error => {
      // Handle the error
      console.log(error);
    });
}
