const User = require("./../models/userModel");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: "success", length: users.length, users });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
};

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({ status: "success", user: newUser });
  } catch (err) {
    res.status(400).json({ message: "failed", err });
  }
};
