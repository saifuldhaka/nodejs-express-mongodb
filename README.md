# nodejs-express-mongodb Project outline / goal
User Roles
------------
=> admin<br />
=> moderator<br />
=> author<br />
=> registered user<br />
=> guest user (not registered )<br />

Guest user
-----------------
=> can see published tutorial list and search &#10003; <br />
=> can do registration &#10003; <br />
 

Registered user
-----------------
=> create profile &#10003; <br />
=> view profile details &#10003;<br />
=> update profile &#10003;<br />
=> change password &#10003;<br />
=> can see the tutorial list and search &#10003;<br />
=> can see his purchased tutorial list &#10003;<br />
=> can read the full tutorial (purchased tutorial only) &#10003;<br />

Author user
-----------------
=> create profile &#10003; <br />
=> view profile details &#10003;<br />
=> update profile &#10003;<br />
=> change password &#10003;<br />
=> can see the tutorial list and search &#10003;<br />
=> can see his purchased tutorial list<br />
=> can read the full tutorial &#10003; <br />
=> can see his own tutorial list &#10003; <br />
=> can create his own tutorial &#10003;<br />
=> can update his own tutorial &#10003;<br />
=> count tutorial how many copies are sold &#10003;<br />
=> list of users (my customers) who have purchased my tutorials &#10003;<br />


Moderator user
-----------------
=> create profile &#10003;<br />
=> view profile details &#10003;<br />
=> update profile &#10003;<br />
=> change password &#10003;<br />
=> can see the tutorial list and search &#10003;<br />
=> can read the full tutorial <br />
=> can publish or un-publish the tutorial<br />


Admin user
-----------------
=> create profile &#10003;<br />
=> view profile details &#10003;<br />
=> update profile &#10003;<br />
=> change password &#10003;<br />
=> Moderator list (add , edit, delete )<br />
=> Author list<br />
=> Registered User list<br />
=> can see the tutorial list and search<br />
=> can read the full tutorial<br />
=> can publish or un-publish the tutorial<br />
=> order list <br />

** Follow the postman collection for testing

# Configuration
=> create config folder inside app folder<br />
=> configure db.config.js as app>config>db.config.js<br />
=> configure DB as <br />
module.exports = {<br />
    url: "your mongo DB link "<br />
}<br />
<br />
example <br />
module.exports = {<br />
    url: "mongodb+srv://xxxxxxx:xxxxxxxx@cluster0.dvi0ncx.mongodb.net/databaseName"<br />
} <br />


## Project setup
```
npm install
```

### Run
```
npm start
```
