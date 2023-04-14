const mongoose = require('mongoose');

const Profile = mongoose.model(
    "Profile",
    new mongoose.Schema({
        user_id: String,
        first_name: String,
        last_name: String,
        address_line1: String,
        address_line2: String,        
        city: String,
        state: String,
        country: String
    })
);

module.exports = Profile;
