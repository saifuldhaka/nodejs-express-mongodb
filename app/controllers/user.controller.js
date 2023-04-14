var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Profile = db.profiles;


const loginUserId = '';
  
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

  
  console.log(this.loginUserId);
  console.log(req.body.first_name);
  console.log(req.body.last_name);
  console.log(req.body.address_line1);
  console.log(req.body.address_line2);
  console.log(req.body.city);
  console.log(req.body.state);
  console.log(req.body.country);

  const profile = new Profile({
    user_id: this.loginUserId,
    first_name: req.body.first_name,
    last_name: req.body.last_nam,
    address_line1: req.body.address_line1,
    address_line2: req.body.address_line2,        
    city: req.body.city,
    state: req.body.state,
    country: req.body.country
  });

  // Save Profile
  profile
    .save(profile)
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