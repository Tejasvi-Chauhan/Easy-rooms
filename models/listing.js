const mongoose = require("mongoose");

const listingschema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
 image: {
  filename: {
    type: String,
    default: "listingimage"
  },
  url: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60"
  }
}
,
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;
