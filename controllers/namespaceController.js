const Namespace = require("./../models/namespaceModel");

exports.getAllNamespaces = async (req, res) => {
  try {
    const namespaces = await Namespace.find();
    res.status(200).json({ status: "success", namespaces });
  } catch (err) {
    res.status(400).json({ message: "failed", err });
  }
};

exports.getAllNamespacesLocal = async () => {
  try {
    const namespaces = await Namespace.find();
    return namespaces;
  } catch (err) {
    console.log(err);
  }
};

exports.createNamespace = async (req, res) => {
  try {
    const newNamespace = await Namespace.create(req.body);
    res.status(200).json({ status: "success", newNamespace });
  } catch (err) {
    res.status(400).json({ message: "failed", err });
  }
};

exports.addRoomToNamespace = async (req, res) => {
  try {
    const { nsTitle, room } = req.body;
    const namespaces = await Namespace.find({ nsTitle: nsTitle });
    let namespace = namespaces[0];
    namespace.rooms.push(room);
    namespace = await namespace.save();
    res.status(200).json({ status: "success", namespace });
  } catch (err) {
    res.status(400).json({ status: "fail  ", err });
  }
};

exports.addMessageToRoom = async (nsTitle, roomTitle, msg) => {
  try {
    const filter = { nsTitle: nsTitle };
    const namespaces = await Namespace.find(filter);
    const namespace = namespaces[0];
    const room = namespace.rooms.find((room) => room.roomTitle === roomTitle);
    room.history.push(msg);
    namespace.markModified("rooms");
    namespace.save();
    return namespace;
  } catch (err) {
    console.log(err);
  }
};

exports.getRoom = async (nsTitle, roomTitle) => {
  try {
    const filter = { nsTitle: nsTitle };
    const namespaces = await Namespace.find(filter);
    const namespace = namespaces[0];
    const room = namespace.rooms.find((room) => room.roomTitle === roomTitle);
    return room;
  } catch (err) {
    console.log(err);
  }
};
