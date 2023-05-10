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
db.tutorial = require("./tutorial.model.js")(mongoose, mongoosePaginate);
db.profile = require("./profile.model");
db.purchasedTutorial = require("./purchasedTutorial.model.js")(mongoose, mongoosePaginate);



module.exports = db;
