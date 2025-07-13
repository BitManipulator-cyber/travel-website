const Listing = require("./models/listing.js");

module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated())
    {
        req.session.redirectUrl = req.originalUrl;
        //req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in to add a new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req , res , next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req , res , next)=>{
    const { id } = req.params;
    let listings = await Listing.findById(id);
    if(!listings.owner.equals(res.locals.currentUser))
    {
        req.flash("error" , "You don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}