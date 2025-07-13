const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require("../controllers/review.js");

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
router.post("/", isLoggedIn ,
  validateReview, 
  wrapAsync(reviewController.addReview));

//Delete Review Route 
router.delete("/:reviewId" ,
  isLoggedIn ,
  isReviewAuthor, 
  wrapAsync(reviewController.deleteReview));


module.exports = router;
