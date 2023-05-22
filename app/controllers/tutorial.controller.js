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


function verifyToken(token) {
  try {
    jwt.verify(token, config.secret);
    return true;
  } catch (error) {
    return false;
    
  }
}

// Create and Save a new Tutorial
exports.create = (req, res) => {
  
  let token = req.headers["x-access-token"];
  findUserId(token);
    
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Title can not be empty!" });
    return;
  }

  if (!req.body.abstract) {
    res.status(400).send({ message: "Abstract can not be empty!" });
    return;
  }

  if (!req.body.description) {
    res.status(400).send({ message: "Description can not be empty!" });
    return;
  }



  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    abstract: req.body.abstract,
    description: req.body.description,
    author_id: this.loginUserId,
    published: req.body.published ? req.body.published : false,
  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then((data) => {
      res.status(200).send(data);
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
          "title": tutorial.title,
          // "description": tutorial.description.split(/\s+/).slice(0, 10).join(" ") + " ....",
          // "published": tutorial.published,
          "createdAt": tutorial.createdAt,
          "updatedAt": tutorial.updatedAt,
          "id": tutorial.id
        };
        tempTutorials.push(temp);
      });

      res.status(200).send({
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
exports.findOne = async (req, res) => {

  const validToken = false;
  let token = req.headers["x-access-token"];

  const isValid = verifyToken(token);

  const id = req.params.id;
  
  if(!isValid){
    console.log('false');
    const tutorial = await Tutorial.findById(id)
          .select("author_id title published createdAt updatedAt abstract id");

    const profile = await Profile.find({user_id: tutorial.author_id}).select("first_name last_name address_line1 address_line2 city state country");      
    
    
    const result = { tutorial, profile };

    res.status(200).send(result);
    

  }else{
    findUserId(token);
    const isPurchase = await PurchasedTutorial.find({user_id:this.loginUserId, tutorial_id: id});
      if(isPurchase){
        const tutorial = await Tutorial.findById(id)
          .select("author_id title published createdAt updatedAt abstract description id");
      
        const profile = await Profile.find({user_id: tutorial.author_id}).select("first_name last_name address_line1 address_line2 city state country");      

        const result = { tutorial, profile };

        res.status(200).send(result);

      }else{
      
        const tutorial = await Tutorial.findById(id)
          .select("author_id title published createdAt updatedAt abstract id");
      
        const profile = await Profile.find({user_id: tutorial.author_id}).select("first_name last_name address_line1 address_line2 city state country");      

        const result = { tutorial, profile };

        res.status(200).send(result);
      }
  }
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
      } else res.status(200).send({ message: "Tutorial was updated successfully." });
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
        res.status(200).send({
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
      res.status(200).send({
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
exports.findAllPublished = async (req, res) => {


  const { page, limit, title } = req.query;

  const currentPage = parseInt(page) || 1; // get page number from query params, default to 1
  const pageSize = parseInt(limit) || 10; // get limit number from query params, default to 10
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * currentPage;

  var conditions = { 
    published: true
  };
  if(title){
    conditions.title = { $regex: new RegExp(title), $options: "i" }
  }
  
  

  const tutorials = await Tutorial.find(conditions)
                                  .sort({ updatedAt: 'desc' })
                                  .skip(startIndex)
                                  .limit(pageSize)
                                  .select('author_id title abstract published createdAt updatedAt');

  const totalTutorial = await Tutorial.countDocuments(conditions);

  const profile = await Profile.find().select('user_id first_name last_name address_line1 address_line2 city state country'); 
  
  const results = tutorials.map(tutorial => {
    const author = profile.find(profile => profile.user_id.toString() === tutorial.author_id.toString()); 
  return {
      author,
      tutorial
    };
  });

 
  const totalPages = Math.ceil(totalTutorial / pageSize);
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  res.json({
    tutorials: results,
    previous_page: previousPage,
    next_page: nextPage,
    total_pages: totalPages,
    current_page : currentPage,
    total_tutorial :totalTutorial,
    page_limit: pageSize
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
          "abstract": tutorial.abstract,
          // "description": tutorial.description.split(/\s+/).slice(0, 10).join(" ") + " ....",
          "description": tutorial.description,
          "published": tutorial.published,
          "createdAt": tutorial.createdAt,
          "updatedAt": tutorial.updatedAt,
          "id": tutorial.id
        };
        tempTutorials.push(temp);
      });

      res.status(200).send({
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


    const currentPage = parseInt(req.query.page) || 1; // get page number from query params, default to 1
    const pageSize = parseInt(req.query.limit) || 10; // get limit number from query params, default to 10
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = currentPage * currentPage;


    const purchasedTutorials = await PurchasedTutorial.find({user_id: this.loginUserId})
                                    .skip(startIndex)
                                    .limit(pageSize);

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


    const totalPages = Math.ceil(tutorialCount / pageSize);
    const previousPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    res.json({
      purchased_tutorial: results,
      previous_page: previousPage,
      next_page: nextPage,
      total_pages: totalPages,
      current_page : currentPage,
      total_tutorial :tutorialCount,
      page_limit: pageSize
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
      res.status(200).send(data);
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
    abstract: req.body.abstract,
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
    } else res.status(200).send({ message: "Tutorial was updated successfully." });
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
              abstract: tutorial.abstract,
              sold_units: result.sold_units
            };
          });
      });
  
      // Resolve all tutorial promises
      return Promise.all(tutorialPromises);
    })

    .then((resultsWithTutorialDetails) => {
      res.status(200).send(resultsWithTutorialDetails);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });


}


exports.myCustomers = async (req, res) => {

  let token = req.headers["x-access-token"];
  findUserId(token);
  var authorId = this.loginUserId;

  // Count the total number of records matching the condition

  const totalRecords = await PurchasedTutorial.aggregate([
    { $match: { author_id: authorId } }, // Filter documents by author_id
    { $group: { _id: "$user_id", count: { $sum: 1 } } }, // Group documents by user_id and count the occurrences
  ]);
  // totalRecords.length;

  const currentPage = parseInt(req.query.page) || 1; // get page number from query params, default to 1
  const pageSize = parseInt(req.query.limit) || 10; // get limit number from query params, default to 10


  const userIDs = await PurchasedTutorial.aggregate([
    { $match: { author_id: authorId } },
    { $group: { _id: "$user_id" } },
    { $project: { _id: 0, user_id: "$_id" } },
    { $skip: (currentPage - 1) * pageSize }, // Apply pagination - skip records
    { $limit: pageSize } // Apply pagination - limit records per page    
  ]);

    


  var promises = userIDs.map((user) =>
    Profile.find({ user_id: user.user_id.toString() })
    .select('user_id first_name last_name address_line1 address_line2 city state country')
    .exec()
  );


  const totalPages = Math.ceil(totalRecords.length / pageSize);
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  Promise.all(promises)
  .then((customers) => {
    // console.log(customers);
    res.json({
      total_record: totalRecords.length,
      total_page: totalPages,
      current_page: currentPage,
      previous_page: previousPage,
      next_page: nextPage,
      page_size: pageSize,
      customers : customers,
      page_limit: pageSize
    });
  })
  .catch((error) => {
    console.error("Error retrieving profiles:", error);
  });


  
}



//  -------------- MODERATOR AND  ADMIN -----------------  //

exports.unPublishedTutorials = async (req, res, next) => {

  const { page, limit, title } = req.query;

  const currentPage = parseInt(page) || 1; // get page number from query params, default to 1
  const pageSize = parseInt(limit) || 10; // get limit number from query params, default to 10
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * currentPage;

  var conditions = { 
    published: false,
    sort: ({ createdAt: -1 })
  };

  if(title){
    conditions.title = { $regex: new RegExp(title), $options: "i" }
  }
  
  const tutorials = await Tutorial.find(conditions)
                                  .sort({ updatedAt: 'desc' })
                                  .skip(startIndex)
                                  .limit(pageSize)
                                  .select('author_id title abstract published createdAt updatedAt description');

  const totalTutorial = await Tutorial.countDocuments(conditions);

  const profile = await Profile.find().select('user_id first_name last_name address_line1 address_line2 city state country'); 
  
  const results = tutorials.map(tutorial => {
    const author = profile.find(profile => profile.user_id.toString() === tutorial.author_id.toString()); 
  return {
      author,
      tutorial
    };
  });

 
  const totalPages = Math.ceil(totalTutorial / pageSize);
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  res.json({
    tutorials: results,
    previous_page: previousPage,
    next_page: nextPage,
    total_pages: totalPages,
    current_page : currentPage,
    total_tutorial :totalTutorial,
    page_limit: pageSize
  });

}

exports.changePublishStatus = async (req, res, next) => {

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
      } else res.status(200).send({ message: "Tutorial publish status was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id,
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
