const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/user.js")

router.route("/signup")
.get(userController.signupPage)
.post(wrapAsync(userController.signupFunctionality));

router.route("/login")
.get(userController.loginPage)
.post( 
    saveRedirectUrl ,
    passport.authenticate("local" , {failureRedirect: '/login' , failureFlash: true}) , 
    wrapAsync(userController.loginFunctionality)
);

router.get('/logout' , userController.logoutFunctionality);

module.exports = router;