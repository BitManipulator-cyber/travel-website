const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = 8080;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const listing_route = require("./routes/listing_route.js");
const review_route = require('./routes/review_route.js');
const session = require("express-session");
const flash = require("connect-flash");
const sessionOptions = {
   secret: "mysecretcode",
   resave: false,
   saveUninitialized: true,
   cookie:{
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true
   }
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is Working");
});

app.use(session(sessionOptions));
app.use(flash());

main()
  .then((res) => {
    console.log("Connection succesful...");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use((req , res , next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.use('/listings' , listing_route);
app.use('/listings/:id/review' , review_route);


app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  //res.status(statusCode).send(message);
  res.render("error.ejs", { message });
});

app.listen(8080, () => {
  console.log("App is listening");
});