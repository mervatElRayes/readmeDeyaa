const AuthUser = require("../models/authUser");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const {validationResult } = require("express-validator");




 

const get_welcome =(req, res) => {
 
  res.render("welcome");
}

const get_signout = (req, res) => {
     
 res.cookie("jwt", "", {maxAge: 1 });
res.redirect("/")

}
const get_login = (req, res) => {
  res.render("auth/login");
}


const get_signup =(req, res) => {
  res.render("auth/signup");
}


const post_signup =   async (req, res) => {


  try {
//  here we sure Or verify if email writed correcte or not correcte
const objError  = validationResult(req);

// in case there are mistake Or error (sign ">" clear there are Elements this mean exist error)

if (objError.errors.length > 0) {
  // res.redirect("/signup")
return  res.json({ arrValidationError: objError.errors });  
}

// this codes👇 check is Email Already Exist In DB ==>> and go to logIn 

   const IsCurrentEmail = await AuthUser.findOne({ email: req.body.email    })

    if (IsCurrentEmail) {
    return res.json({existEmail: "this email already existing"}) 
    }
  // these codes 👇 Create new user and than  logIn
   const newUser = await AuthUser.create(req.body);

     var token = jwt.sign({ id: newUser._id }, "c4a.dev");
      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({id: newUser._id})
  
    // res.redirect("/");
  } catch (error) {
    console.log(error);
  }

  
}



const post_login = async (req, res) => {
 
  const logInUser = await AuthUser.findOne({ email: req.body.email });
  try {
    
  if (logInUser === null) {
    res.json({notFoundEmail: "Email not Found" })
    
  } else {
    const match = await bcrypt.compare(req.body.password, logInUser.password);
    if (match) {
     
      var token = jwt.sign({ id: logInUser._id }, "c4a.dev");

      res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
      res.json({id: logInUser._id})
    } else {
     res.json({passwordError: `InCorrect Password for ${req.body.email}   `})
    }
  }
  } catch (error) {
    console.log(error);
  }

}



module.exports = {
get_signout,
get_login,
get_signup,
post_signup,
post_login,
 get_welcome


}