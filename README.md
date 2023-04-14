# nodejs-express-mongodb Project outline / goal
User Roles
------------
1. admin
2. moderator
3. author
4. registered user
5. guest user (not registered )

Guest user
-----------------
1. can see the tutorial list and search
2. can read first 150 words
3. can do registration 


Registered user
-----------------
1. create profile &#10003; 
2. update profile
3. change password &#10003;
4. can see the tutorial list and search &#10003;
5. can read first 150 words if not purchase &#10003;
6. can see his purchased tutorial list
7. can read the full tutorial

Author user
-----------------
1. create profile &#10003;
2. update profile
3. change password &#10003;
4. can see the tutorial list and search &#10003;
5. can read first 150 words if not purchase &#10003;
6. can see his purchased tutorial list
7. can read the full tutorial
8. can see his own tutorial list
9. can write his own tutorial
10. can update his own tutorial

Moderator user
-----------------
1. create profile &#10003;
2. update profile
3. change password
4. can see the tutorial list and search &#10003;
5. can read the full tutorial 
6. can publish or un-publish the tutorial


Admin user
-----------------
1. create profile &#10003;
2. update profile
2. change password
3. Moderator list (add , edit, delete )
4. Author list
5. Registered User list
6. can see the tutorial list and search
7. can read the full tutorial
8. can publish or un-publish the tutorial
9. order list 



# Configuration
1. create config folder inside app folder
2. configure db.config.js as app>config>db.config.js
3. configure DB as 
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
