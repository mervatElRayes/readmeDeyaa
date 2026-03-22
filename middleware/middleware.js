var jwt = require("jsonwebtoken");
const AuthUser = require("../models/authUser")

const requireAuth = (req, res, next) => {
 
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "c4a.dev", (err) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};



// 👇👇this function make verification if user exists Or No 
const checkIfUser = (req, res, next) => {
  res.locals.www = "ali hassan";
  const token = req.cookies.jwt;
  if (token) {
    //  login user
    jwt.verify(token, "c4a.dev", async (err, decoded) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const loginUser = await AuthUser.findById(decoded.id);

        res.locals.user = loginUser;
        next();
      }
    });
  } else {
    // not login user
    res.locals.user = null;
    next();
  }
};

module.exports = {requireAuth , checkIfUser};
