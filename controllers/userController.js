const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");

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

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ status: "fail", message: "user not found" });
    res.status(201).json({ status: "success", user });
  } catch (err) {
    res.status(400).json({ message: "failed", err });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user)
      return res
        .status(404)
        .json({ status: "fail", message: "user not found" });
    res.status(200).json({ status: "success", user });
  } catch (err) {
    res.status(400).json({ message: "failed", err });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ message: "failed", err });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const users = await User.find({ email });
    if (users.length !== 1) throw Error();
    const user = users[0];
    if (user.password !== password) throw Error();

    // User Authenticated
    let token = jwt.sign({ username: user.username }, process.env.JWT_KEY);
    res.status(200).json({ token, id: user._id, username: user.username });
  } catch (err) {
    res.status(400).json({ message: "failed", err });
  }
};
