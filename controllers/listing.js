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
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url , filename};
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
    let originalImageUrl = updateListings.image.url;
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_200,h_100,q_auto:low")
    console.log(originalImageUrl);

    res.render("listings/edit.ejs", { updateListings , originalImageUrl });
  }

//Update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  //const { listing } = req.body;

  const listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

  if(typeof req.file !== "undefined")
  {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url , filename};
    await listing.save();
  }

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
    let map_api = process.env.MAP_API_KEY;
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
    res.render("listings/show.ejs", { allInfo , map_api });
  }