const Listing = require("../models/listing");

//Show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}

//GET new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

//Create Listing
module.exports.createListing = async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success" , "New listing Created");
  res.redirect("/listings");
  }

//Edit listing
module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let updateListings = await Listing.findById(id);
    if(!updateListings){
      req.flash("error" , "Listing you're trying to find does not exists");
       return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { updateListings });
  }

//Update listing
module.exports.updateListing = async (req, res) => {
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
}

//Delete Listing
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings");
  }

//Show all listings
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let allInfo = await Listing.findById(id).populate({
      path: "review",
      populate: {
        path: "author",
      },
    }).populate("owner");
    if(!allInfo){
      req.flash("error" , "Listing you're trying to find does not exists");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { allInfo });
  }