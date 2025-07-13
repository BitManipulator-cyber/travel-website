const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

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

module.exports.isReviewAuthor = async (req , res , next)=>{
    let { id , reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id))
    {
        req.flash("error" , "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}