const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.ROLES = ["user", "admin", "moderator","author"];
db.user = require('./user.model');
db.role = require('./role.model');
db.tutorials = require("./tutorial.model.js")(mongoose, mongoosePaginate);
db.profiles = require("./profile.model");



module.exports = db;
