const mongoose = require("mongoose");

const namespaceSchema = new mongoose.Schema({
  nsTitle: {
    type: String,
    required: [true, "A Namespace must have a Title"],
    unique: true,
  },
  img: {
    type: String,
    required: [true, "A Namespace must have an image path."],
  },
  endpoint: {
    type: String,
    required: [true, "A Namespace must have an endpoint."],
    unique: true,
  },
  rooms: [],
});

const Namespace = mongoose.model("Namespace", namespaceSchema);

module.exports = Namespace;
