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
a. can see the tutorial list and search
b. can read first 150 words
c. can do registration 


Registered user
-----------------
a. update profile
b. change password
c. can see the tutorial list and search
d. can read first 150 words if not purchase
e. can see his purchased tutorial list
f. can read the full tutorial

Author user
-----------------
a. update profile
b. change password
c. can see the tutorial list and search
d. can read first 150 words if not purchase
e. can see his purchased tutorial list
f. can read the full tutorial
g. can see his own tutorial list
h. can write his own tutorial
i. can update his own tutorial

Moderator user
-----------------
a. update profile
b. change password
c. can see the tutorial list and search
f. can read the full tutorial
g. can publish or un-publish the tutorial


Admin user
-----------------
a. update profile
b. change password
c. Moderator list (add , edit, delete )
d. Author list
e. Registered User list
f. can see the tutorial list and search
g. can read the full tutorial
h. can publish or un-publish the tutorial
i. order list 



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
