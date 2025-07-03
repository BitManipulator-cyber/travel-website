const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(', ');
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

//Adding a Review (POST ROUTE)
router.post("/", validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }
  let newReview = new Review(req.body.review);

  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  
  res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route 
router.delete("/:reviewId" , wrapAsync(async (req , res)=>{
  let {id , reviewId} = req.params;

  await Listing.findByIdAndUpdate(id , {$pull: {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}))


module.exports = router;
