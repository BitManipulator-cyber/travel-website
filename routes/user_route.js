const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const User = require('../models/user.js');

//GET - for /signup
router.get('/' , (req , res)=>{
    res.render("users/signup.ejs");
});

//POST - for /signup
router.post('/' , wrapAsync(async(req , res)=>{
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

module.exports = router;