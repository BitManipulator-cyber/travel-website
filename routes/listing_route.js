const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schema.js");

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
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
router.post(
  "/", validateListing ,
  wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updateListings = await Listing.findById(id);
    res.render("listings/edit.ejs", { updateListings });
  })
);

//Update Route
router.put(
  "/:id", validateListing ,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body;

    const listing = await Listing.findById(id);

    const updatedData = {
      title,
      description,
      price,
      location,
      country,
      image: listing.image,
    };

    if (image && image.trim() !== "") {
      updatedData.image = {
        ...listing.image, // preserve filename
        url: image, // update only URL
      };
    }

    await Listing.findByIdAndUpdate(id, updatedData);
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let allInfo = await Listing.findById(id).populate("review");
    res.render("listings/show.ejs", { allInfo });
  })
);

module.exports = router;