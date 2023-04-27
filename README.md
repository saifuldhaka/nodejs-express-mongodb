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
=> can see the tutorial list and search<br />
=> can read first 150 words<br />
=> can do registration <br />


Registered user
-----------------
=> create profile &#10003; <br />
=> view profile details &#10003;<br />
=> update profile<br />
=> change password &#10003;<br />
=> can see the tutorial list and search &#10003;<br />
=> can read first 150 words if not purchase &#10003;<br />
=> can see his purchased tutorial list<br />
=> can read the full tutorial<br />

Author user
-----------------
=> create profile &#10003; <br />
=> view profile details &#10003;<br />
=> update profile<br />
=> change password &#10003;<br />
=> can see the tutorial list and search &#10003;<br />
=> can read first 150 words if not purchase &#10003;<br />
=> can see his purchased tutorial list<br />
=> can read the full tutorial<br />
=> can see his own tutorial list<br />
=> can write his own tutorial<br />
=> can update his own tutorial<br />

Moderator user
-----------------
=> create profile &#10003;<br />
=> view profile details &#10003;<br />
=> update profile<br />
=> change password &#10003;<br />
=> can see the tutorial list and search &#10003;<br />
=> can read the full tutorial <br />
=> can publish or un-publish the tutorial<br />


Admin user
-----------------
=> create profile &#10003;<br />
=> view profile details &#10003;<br />
=> update profile<br />
=> change password &#10003;<br />
=> Moderator list (add , edit, delete )<br />
=> Author list<br />
=> Registered User list<br />
=> can see the tutorial list and search<br />
=> can read the full tutorial<br />
=> can publish or un-publish the tutorial<br />
=> order list <br />



# Configuration
=> create config folder inside app folder<br />
=> configure db.config.js as app>config>db.config.js<br />
=> configure DB as <br />
> module.exports = {<br />
>    url: "your mongo DB link "<br />
>}<br />
<br />
> example <br />
> module.exports = {<br />
>    url: "mongodb+srv://xxxxxxx:xxxxxxxx@cluster0.dvi0ncx.mongodb.net/databaseName"<br />
>} <br />


## Project setup
```
npm install
```

### Run
```
npm start
```
