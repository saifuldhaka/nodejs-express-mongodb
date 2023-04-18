# nodejs-express-mongodb Project outline / goal
User Roles
------------
=> admin
=> moderator
=> author
=> registered user
=> guest user (not registered )

Guest user
-----------------
=> can see the tutorial list and search
=> can read first 150 words
=> can do registration 


Registered user
-----------------
=> create profile &#10003; 
=> view profile details &#10003;
=> update profile
=> change password &#10003;
=> can see the tutorial list and search &#10003;
=> can read first 150 words if not purchase &#10003;
=> can see his purchased tutorial list
=> can read the full tutorial

Author user
-----------------
=> create profile &#1000;
=> view profile details &#10003;
=> update profile
=> change password &#10003;
=> can see the tutorial list and search &#10003;
=> can read first 150 words if not purchase &#10003;
=> can see his purchased tutorial list
=> can read the full tutorial
=> can see his own tutorial list
=> can write his own tutorial
=> can update his own tutorial

Moderator user
-----------------
=> create profile &#10003;
=> view profile details &#10003;
=> update profile
=> change password &#10003;
=> can see the tutorial list and search &#10003;
=> can read the full tutorial 
=> can publish or un-publish the tutorial


Admin user
-----------------
=> create profile &#10003;
=> view profile details &#10003;
=> update profile
=> change password &#10003;
=> Moderator list (add , edit, delete )
=> Author list
=> Registered User list
=> can see the tutorial list and search
=> can read the full tutorial
=> can publish or un-publish the tutorial
=> order list 



# Configuration
=> create config folder inside app folder
=> configure db.config.js as app>config>db.config.js
=> configure DB as 
> module.exports = {
>    url: "your mongo DB link "
>}

> example 
> module.exports = {
>    url: "mongodb+srv://xxxxxxx:xxxxxxxx@cluster0.dvi0ncx.mongodb.net/databaseName"
>} 


## Project setup
```
npm install
```

### Run
```
npm start
```
