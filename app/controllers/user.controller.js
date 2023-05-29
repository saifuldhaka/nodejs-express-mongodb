var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Profile = db.profile;
const Role = db.role;


const loginUserId = '';
const userProfile = {};
  
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


exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.authorBoard = (req, res) => {
  res.status(200).send("Author Content.");
};

exports.changePassword = (req, res) => {

  let token = req.headers["x-access-token"];
  findUserId(token);
    
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = this.loginUserId;

  var password = req.body.password;
  var rePassword = req.body.re_password;
  if(password != rePassword) {
    res.status(500).send({
      message: "Password not match. Please re-enter your password",
    });
  }

  var newPassword = {
    'password': bcrypt.hashSync(req.body.password, 8)
  };

  User.findByIdAndUpdate(id, newPassword, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `User record not found!`,
        });
      } else {
        // const token = token;
        // const now = new Date();
        // const expire = new Date(req.user.exp);
        // const milliseconds = now.getTime() - expire.getTime();
        // /* -------- BlackList Token ----------- */
        // await cache.set(token, token, milliseconds);

        res.send({ message: "Password was updated successfully." });
      } 
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Password",
      });
    });

}

exports.createProfile = (req, res) => {

  let token = req.headers["x-access-token"];
  findUserId(token);

  if (!req.body.first_name) {
    res.status(400).send({ message: "First name can not be empty!" });
    return;
  }

  if (!req.body.address_line1) {
    res.status(400).send({ message: "Address line 1 can not be empty!" });
    return;
  }

  if (!req.body.state) {
    res.status(400).send({ message: "State line 1 can not be empty!" });
    return;
  }

  if (!req.body.country) {
    res.status(400).send({ message: "Country line 1 can not be empty!" });
    return;
  }

  const profile = new Profile({
    user_id: this.loginUserId,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,        
    city: req.body.city,
    state: req.body.state,
    country: req.body.country
  });

  // Save Tutorial in the database
  profile
    .save(profile)
    .then((data) => {
      res.status(200).send({
        id: data._id,
        user_id: data.user_id,
        first_name: data.first_name,
        last_name: data.last_name,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city: data.city,
        state: data.state,
        country: data.country
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
}

exports.updateProfile = (req, res) => {

  let token = req.headers["x-access-token"];
  findUserId(token);

  if (!req.body.first_name) {
    res.status(400).send({ message: "First name can not be empty!" });
    return;
  }

  if (!req.body.address_line1) {
    res.status(400).send({ message: "Address line 1 can not be empty!" });
    return;
  }

  if (!req.body.state) {
    res.status(400).send({ message: "State line 1 can not be empty!" });
    return;
  }

  if (!req.body.country) {
    res.status(400).send({ message: "Country line 1 can not be empty!" });
    return;
  }

  const id = req.params.id;

  var data = {
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'address_line1': req.body.address_line1,
    'address_line2': req.body.address_line2,
    'city': req.body.city,
    'state': req.body.state,
    'country': req.body.country
  };

  Profile.findByIdAndUpdate(id, data, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `User record not found!`,
        });
      } else {
        res.send({ message: "Profile was updated successfully." });
      } 
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Profile",
      });
    });


}

exports.viewProfile = (req, res) => {

  const userId = req.params.id;

  Promise.all([
    // User.findOne({ _id: userId }, { username: 1, email: 1 }).exec(),    // both are working
    User.find({ _id: userId }, { username: 1, email: 1 }).exec(),
    Profile.find({ user_id: userId }).exec()
  ]).then(function(results) {
    const user = results[0];
    delete user.password;
    delete user.roles;
    const profile = results[1];
    const mergedResult = { user, profile };
    res.status(500).send(mergedResult);
      return;
  })
    .catch((err) => {
      res
        .status(500)
        .send({message: "Error retrieving User with id = " + id});
    });

}


exports.getAuthorList = async (req, res, next) => {
  const roleType = req.params.id;
}

exports.getAuthorList = async (req, res, next) => {
  const roleType = req.params.id;
}

exports.getUserList = async (req, res, next) => {
  const roleName = req.params.id;

  const { page, limit, name } = req.query;

  const currentPage = parseInt(page) || 1; // get page number from query params, default to 1
  const pageSize = parseInt(limit) || 10; // get limit number from query params, default to 10
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * currentPage;
  
  // const role = await Role.findOne({name: roleType}).select("id");

  // const roleId = role._id;

  var conditions = { 
    role: roleName,
    sort: ({ createdAt: -1 })
  };

  if(name){
    conditions.username = { $regex: new RegExp(name), $options: "i" }
  }

  const users = await User.find(conditions)
                              .skip(startIndex)
                              .limit(pageSize)
                              .select('id username email');


  const totalUser = await User.countDocuments(conditions);

  const totalPages = Math.ceil(totalUser / pageSize);
  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const profile = await Profile.find().select('user_id first_name last_name address_line1 address_line2 city state country'); 
  
  const results = users.map(user => {
    const details = profile.find(profile => profile.user_id.toString() === user._id.toString()); 
    if(details){
      return {
        details,
        user
      };
    }else{
      return {
        details : null,
        user
      };
    }
  });


  res.send({
    users: results,
    previous_page: previousPage,
    next_page: nextPage,
    total_pages: totalPages,
    current_page : currentPage,
    total_users :totalUser,
    page_limit: pageSize
  });


  
  

}