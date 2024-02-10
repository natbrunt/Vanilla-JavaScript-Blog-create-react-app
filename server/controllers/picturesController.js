const cloudinary = require("cloudinary");

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
  });

const remove = async (req, res) => {
  const { _id } = req.params;
  try {
    await cloudinary.v2.api.delete_resources([_id]);
    res.json({ ok: true, message: 'Image deleted from Cloudinary'});
  } catch (error) {
    console.log(error)
	res.send({ ok: false, message: "Could not delete image from Cloudinary"})
  }
};

module.exports = {
	remove,
};