const User = require('../models/user.js');

module.exports.signupPage = (req , res)=>{
    res.render("users/signup.ejs");
}

module.exports.signupFunctionality = async(req , res)=>{
    try{
        let {username , email , password} = req.body;
        const newUser = new User({email , username});
        let registeredUser = await User.register(newUser , password);
        if(registeredUser)
        {
            req.login(registeredUser , (err)=>{
                if(err)
                {
                    return next(err);
                }
                req.flash("success" , "User registered successfully");
                res.redirect("/listings");
            })
        }
    }catch(error){
        req.flash("error" , error.message);
        res.redirect("/signup");
    }
    
}

module.exports.loginPage = (req , res)=>{
    res.render('users/login.ejs')
}

module.exports.loginFunctionality = async (req , res)=>{
    try{
        req.flash("success" , "Welcome to Wanderlust ! You are logged in");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/login");
    }
}

module.exports.logoutFunctionality = (req , res , next)=>{
    //req.logout(callback) so we can handle error here
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "You are logged out");
        res.redirect("/listings");
    })
}