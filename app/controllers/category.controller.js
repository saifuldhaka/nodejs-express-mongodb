const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");

// const Tutorial = db.tutorials;
const Tutorial = db.tutorial;
const PurchasedTutorial = db.purchasedTutorial;
const Profile = db.profile;
const User = db.user;

const Category = db.category;
const Subcategory = db.subcategory;

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



exports.getAllCategory = async (req, res, next) => {

}

exports.getAllSubCategory = async (req, res, next) => {

}

exports.getAllCategoriesSubCategory = async (req, res, next) => {}
