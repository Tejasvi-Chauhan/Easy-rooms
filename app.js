const express = require("express");
const app = express();
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const {listingschema} = require("./views/schema.js");

const wrapAsync = require("./utils/wrapAsync.js");

const ExpressError = require("./utils/ExpressError.js");

const methodOverride = require("method-override");

const mongoose = require("mongoose");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/staynest");
}

main()
  .then(() => {
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

const port = 8080;
app.listen(port, () => {
  console.log(`App is listening at ${port}`);
});

const validatelisting=(req,res,next)=>{
  let {error}=listingschema.validate(req.body);
  if(error){
    throw new ExpressError(400,error);
  }
  else{
    next();
  }
}


app.get("/", (req, res) => {
  res.send("Working");
});

//Index Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let alllistings = await Listing.find();
    res.render("listings/index.ejs", { alllistings });
  })
);

// New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/New.ejs");
});
//Show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listings/show.ejs", { list });
  })
);

//Create Route
app.post(
  "/listings",validatelisting,
  wrapAsync(async (req, res) => {
  
    let newList = req.body;
    
    let newListing = new Listing(newList);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    res.render("listings/edit.ejs", { list });
  })
);

//Update Route
app.put(
  "/listings/:id",validatelisting,
  wrapAsync(async (req, res) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Something went wrong");
    }
    let { id } = req.params;
    let updatedData = req.body;
    await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true });

    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);

    

app.use((err, req, res, next) => {
  let { status = 401, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs",{err});
});

