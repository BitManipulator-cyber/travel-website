const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const {isLoggedIn, isOwner} = require('../middleware.js');
const listingController = require("../controllers/listing.js");

const validateListing = (req , res , next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error){
       throw new ExpressError(400, error.message);
    }else{
        next();
    }
}

//Home Route
router.get("/", wrapAsync(listingController.index)
);

//New Route
router.get("/new", isLoggedIn , listingController.renderNewForm);

//Create Route
router.post(
  "/", 
  isLoggedIn, 
  validateListing ,
  wrapAsync(listingController.createListing)
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editListing)
);

//Update Route
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.deleteListing)
);

//Show Route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

module.exports = router;