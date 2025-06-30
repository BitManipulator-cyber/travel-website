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
const { listingSchema } = require("./schema.js");

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

const validateListing = (req , res , next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error){
        throw new ExpressError(400 , result.error);
    }else{
        next();
    }
}

// app.get("/testlisting" , async (req,res)=>{
//     let sample = new Listing({
//         title: "New Villa",
//         description: "A big Villa with 10 rooms and a lawn",
//         price: 20000,
//         location: "Goa",
//         country: "India",

//     });
//     await sample.save()
//     .then(()=>{
//         console.log("Saved info to the database...");
//     })
//     .catch((err)=>{
//         console.log("Error occured...Try again!");
//     })

//     res.send("Data Saved Succesfully...");
// })

app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
app.post(
  "/listings", validateListing ,
  wrapAsync(async (req, res) => {
//     const { error } = listingSchema.validate(req.body);
//     if (error) {
//     console.log(error);
//   // Send a 400 Bad Request with the error details (or your choice)
//   return res.status(400).send(error.details[0].message);
// }

const newListing = new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");

    // let {title , description , image , price , location , country} = req.body;
    // let newListings = new Listing({
    //     title ,
    //     description ,
    //     image ,
    //     price ,
    //     location ,
    //     country
    // // });
    // const result = listingSchema.validate(req.body);
    // if (result.error) {
    // console.log("Full Joi Validation Error Object:");
    // console.dir(result.error, { depth: null });
    // }
    // const newListings = new Listing(req.body.listing);
    // await newListings.save();
    // console.log("Data saved Successfully!");
    // res.redirect("/listings");
  })
);

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updateListings = await Listing.findById(id);
    res.render("listings/edit.ejs", { updateListings });
  })
);

app.put(
  "/listings/:id", validateListing ,
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

app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let allInfo = await Listing.findById(id);
    res.render("listings/show.ejs", { allInfo });
  })
);

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
