const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const {isLoggedIn} = require('../middleware.js');

const validateListing = (req , res , next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error){
       throw new ExpressError(400, error.message);
    }else{
        next();
    }
}

//Home Route
router.get("/", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//New Route
router.get("/new", isLoggedIn , (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
router.post(
  "/", 
  isLoggedIn, validateListing ,
  wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  req.flash("success" , "New listing Created");
  res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updateListings = await Listing.findById(id);
    if(!updateListings){
      req.flash("error" , "Listing you're trying to find does not exists");
       return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { updateListings });
  })
);

//Update Route
router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { listing } = req.body;

  const oldListing = await Listing.findById(id);

  // If no image was provided in the edit form, preserve the old image
  const updatedData = {
    ...listing,
    image: oldListing.image
  };

  // Only update image URL if a new one was provided
  if (listing.image && listing.image.trim() !== "") {
    updatedData.image = {
      ...oldListing.image,
      url: listing.image
    };
  }

  await Listing.findByIdAndUpdate(id, updatedData);
  req.flash("success" , "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));


router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
  })
);

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let allInfo = await Listing.findById(id).populate("review");
    if(!allInfo){
      req.flash("error" , "Listing you're trying to find does not exists");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { allInfo });
  })
);

module.exports = router;