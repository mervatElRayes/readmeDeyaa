const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const AuthUser = require("../models/authUser")
const bcrypt = require('bcrypt');


// Level 2
router.get("/",  (req, res) => {
res.render("welcome")

});

router.get("/login",  (req, res) => {
res.render("auth/login")

});


router.get("/signup",  (req, res) => {
res.render("auth/signup")

});


router.post("/signup", async (req, res) => {
    console.log(req.body);

try {
    const result = await AuthUser.create(req.body)
console.log(result);
res.redirect("/")
} catch (error) {
    console.log(error);
}

});

// check if email correct Or No
router.post("/login", async (req, res) => {
 console.log("7777777777777777777777777");
const logInUser = await AuthUser.findOne({email: req.body.email})
 console.log(logInUser);

if (logInUser === null) {
    console.log("This email not Found In DB");
    
}else{
    const match = await bcrypt.compare(req.body.password, logInUser.password)
    if (match) {
        console.log("correct Email & Password");
    }else{
        console.log("wrong password");
    }

    res.redirect("/signup")
    
}



});








// Level 1
// GET Requst

router.get("/home", userController.user_index_get);

router.get("/edit/:id", userController.user_edit_get);

router.get("/view/:id", userController.user_view_get);

router.post("/search", userController.user_search_post);

// DELETE Request
router.delete("/edit/:id", userController.user_delete);

// PUT Requst
router.put("/edit/:id", userController.user_put);

module.exports = router;
