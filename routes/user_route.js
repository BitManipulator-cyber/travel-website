const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User = require('../models/user.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require("../controllers/user.js")

//GET - for /signup
router.get('/signup' , userController.signupPage);

//POST - for /signup
router.post('/signup' , wrapAsync(userController.signupFunctionality));

//GET - for /login page
router.get('/login' , userController.loginPage);

//POST - for /login page using passport.authenticate() to authencticate the user
router.post('/login' , 
    saveRedirectUrl ,
    passport.authenticate("local" , {failureRedirect: '/login' , failureFlash: true}) , 
    wrapAsync(userController.loginFunctionality));

router.get('/logout' , userController.logoutFunctionality);

module.exports = router;