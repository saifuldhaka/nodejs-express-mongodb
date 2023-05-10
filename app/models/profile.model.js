const mongoose = require('mongoose');

const Profile = mongoose.model(
    "Profile",
    new mongoose.Schema({
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        first_name: String,
        last_name: String,
        address_line1: String,
        address_line2: String,        
        city: String,
        state: String,
        country: String,
    })
);

module.exports = Profile;


// module.exports =( mongoose) => {
//     var schema = mongoose.Schema(
//       {
//         user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//         first_name: String,
//         last_name: String,
//         address_line1: String,
//         address_line2: String,        
//         city: String,
//         state: String,
//         country: String
//       },
//       { timestamps: true }
//     );
  
//     schema.method("toJSON", function() {
//       const { __v, _id, ...object } = this.toObject();
//       object.id = _id;
//       return object;
//     });

//     const Profile = mongoose.model("profile", schema);
//     return Profile;
//   };

