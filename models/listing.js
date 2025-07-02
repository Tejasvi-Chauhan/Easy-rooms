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
    type: String,
    default:
      "https://unsplash.com/photos/beach-scene-with-a-boat-palm-trees-and-a-chair-HpGZt6CeAas",
    set: (v) =>
      v === ""
        ? "https://unsplash.com/photos/beach-scene-with-a-boat-palm-trees-and-a-chair-HpGZt6CeAas"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;
