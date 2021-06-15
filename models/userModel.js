const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, "A user must have a username"] },
  avatarConfig: {
    topType: { type: String, default: "ShortHairShortFlat" },
    accessoriesType: { type: String, default: "Blank" },
    hairColor: { type: String, default: "Brown" },
    facialHairType: { type: String, default: "Blank" },
    clotheType: { type: String, default: "ShirtScoopNeck" },
    eyeType: { type: String, default: "Default" },
    eyebrowType: { type: String, default: "Default" },
    mouthType: { type: String, default: "Default" },
    skinColor: { type: String, default: "Tanned" },
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: [true, "Please provide a password"] },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
