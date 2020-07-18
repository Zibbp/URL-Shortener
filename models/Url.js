const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, "Please add a slug"],
  },
  longUrl: {
    type: String,
    required: [true, "Please add a URL"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Url", UrlSchema);
