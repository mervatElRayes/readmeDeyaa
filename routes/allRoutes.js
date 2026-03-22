const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const AuthUser = require("../models/authUser");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var {requireAuth, checkIfUser} = require("../middleware/middleware");
const { check, validationResult } = require("express-validator");





router.get("*", checkIfUser)



// Level 2
router.get("/signout", (req, res) => {
     
 res.cookie("jwt", "", {maxAge: 1 });
res.redirect("/")

});


router.get("/", (req, res) => {
  console.log("hiiiiiiiiiiiiiiii");
  res.render("welcome");
});


router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup",
  [
   check("email", "Please provide a valid email").isEmail(),
   check("password", "Password must be at least 8 characters with 1 upper case letter and 1 number").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
],
   
  
  
  async (req, res) => {

console.log(req.body);
  try {
//  here we sure Or verify if email writed correcte or not correcte
const objError  = validationResult(req);
console.log(objError.errors);

console.log("-----------------------------");
// in case there are mistake Or error (sign ">" clear there are Elements this mean exist error)

if (objError.errors.length > 0) {
  // res.redirect("/signup")
return  res.json({ arrValidationError: objError.errors });  
}



   const IsCurrentEmail = await AuthUser.findOne({ email: req.body.email    })
    console.log(IsCurrentEmail);

    if (IsCurrentEmail) {
    return res.json({existEmail: "this email already exiset"})
   
     
    }
  
   const newUser = await AuthUser.create(req.body);

     var token = jwt.sign({ id: newUser._id }, "c4a.dev");
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({id: newUser._id})
  
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }

  
});

//"just verification"  check if email correct Or No
router.post("/login", async (req, res) => {
  console.log("88888888888888888");
  const logInUser = await AuthUser.findOne({ email: req.body.email });
  console.log(logInUser);

  if (logInUser === null) {
    console.log("This email not Found In DB");
  } else {
    const match = await bcrypt.compare(req.body.password, logInUser.password);
    if (match) {
      console.log("correct Email & Password");
      var token = jwt.sign({ id: logInUser._id }, "c4a.dev");
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.redirect("/home");
    } else {
      console.log("wrong password");
    }
  }
});

// Level 1
// GET Requst

router.get("/home", requireAuth, userController.user_index_get);

router.get("/edit/:id", requireAuth, userController.user_edit_get);

router.get("/view/:id", requireAuth, userController.user_view_get);

router.post("/search", userController.user_search_post);

// DELETE Request
router.delete("/edit/:id", userController.user_delete);

// PUT Requst
router.put("/edit/:id", userController.user_put);

module.exports = router;





