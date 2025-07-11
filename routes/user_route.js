const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User = require('../models/user.js');
const passport = require('passport');

//GET - for /signup
router.get('/signup' , (req , res)=>{
    res.render("users/signup.ejs");
});

//POST - for /signup
router.post('/signup' , wrapAsync(async(req , res)=>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        let registeredUser = await User.register(newUser , password);
        console.log(registeredUser);
        req.flash("success" , "User registered successfully");
        res.redirect("/listings");
    }catch(error){
        req.flash("error" , error.message);
        res.redirect("/signup");
    }
    
}))

//GET - for /login page
router.get('/login' , (req , res)=>{
    res.render('users/login.ejs')
})

//POST - for /login page using passport.authenticate() to authencticate the user
router.post('/login' , passport.authenticate("local" , {failureRedirect: '/login' , failureFlash: true}) , wrapAsync(async (req , res)=>{
    try{
        req.flash("success" , "Welcome to Wanderlust ! You are logged in");
        res.redirect("/listings");
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/login");
    }
}))

router.get('/logout' , (req , res , next)=>{
    //req.logout(callback) so we can handle error here
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "You are logged out");
        res.redirect("/listings");
    })
})

module.exports = router;