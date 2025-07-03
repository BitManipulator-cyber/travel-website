const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const PORT = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const listing_route = require("./routes/listing_route.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.json());

main()
  .then((res) => {
    console.log("Connection succesful...");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("App is Working");
});


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
app.post("/listings/:id/review", validateReview, wrapAsync(async (req, res) => {
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
app.delete("/listings/:id/review/:reviewId" , wrapAsync(async (req , res)=>{
  let {id , reviewId} = req.params;

  await Listing.findByIdAndUpdate(id , {$pull: {review: reviewId}});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}))

app.use('/listings' , listing_route);

// app.get('/^/.*/' , (req , res)=>{
//     res.send(path.join(__dirname , 'public' , 'index.html'));
// })

// app.all("./*/" , (req , res , next)=>{
//     next(new ExpressError(404 , "Page Not found!"));
// })

// app.use((err , req , res , next)=>{
//     let {statusCode , message} = err;
//     res.status(statusCode).send(message);
// })

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not found!"));
// });



app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  //res.status(statusCode).send(message);
  res.render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("App is listening");
});
