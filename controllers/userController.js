exports.getAllUsers = async (req, res) => {
  try {
    res.status(200).json({ status: "success", message: "getAllUsers EP" });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
};
