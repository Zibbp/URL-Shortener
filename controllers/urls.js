const Url = require("../models/Url");
const { nanoid } = require("nanoid");

// @desc      Resolve URL
// @route     GET /:slug
// @access    Public
exports.resolve = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    // Find slug
    const url = await Url.findOne({ slug });
    if (!url) {
      throw new Error("Invalid URL");
    }
    // Redirect to full url
    res.redirect(url.longUrl);
  } catch (error) {
    const err = error.message;
    res.status(400).json({ err });
  }
};

// @desc      Shorten URL
// @route     POST /
// @access    Public
exports.createUrl = async (req, res, next) => {
  try {
    // Check for URL
    if (!req.body.url) {
      throw new Error("Enter a URL");
    }
    const longUrl = req.body.url;
    // Validate URL
    const valid = await validURL(longUrl);
    if (valid === false) {
      throw new Error("Invalid URL, Ensure http/https in included");
    }
    // Create slug
    const slug = await nanoid(parseInt(process.env.URL_SIZE));
    // Check if slug is in use
    const check = await Url.findOne({ slug });
    if (check) {
      throw new Error("Duplicate slug");
    }
    // Save url
    const shortenUrl = await Url.create({
      slug,
      longUrl,
    });
    const shortUrl = `${process.env.URL}${slug}`;
    res.status(200).json({ success: true, slug, shortUrl });
  } catch (error) {
    const err = error.message;
    res.status(400).json({ err });
  }
};

function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}
