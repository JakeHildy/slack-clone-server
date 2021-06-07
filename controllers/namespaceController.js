const { listeners } = require("./../models/namespaceModel");
const Namespace = require("./../models/namespaceModel");

exports.getAllNamespaces = async () => {
  try {
    const namespaces = await Namespace.find();
    return namespaces;
  } catch (err) {
    console.log(err);
  }
};

exports.createNamespace = async (initData) => {
  try {
    const newNamespace = await Namespace.create(initData);
    return newNamespace;
  } catch (err) {
    console.log(err);
  }
};

exports.addRoomToNamespace = async (nsTitle, room) => {
  try {
    const namespaces = await Namespace.find({ nsTitle: nsTitle });
    let namespace = namespaces[0];
    namespace.rooms.push(room);
    namespace = await namespace.save();
    return namespace;
  } catch (err) {
    console.log(err);
  }
};

exports.addMessageToRoom = async (nsTitle, roomTitle, msg) => {
  try {
    const filter = { nsTitle: nsTitle };
    const namespaces = await Namespace.find(filter);
    const namespace = namespaces[0];
    const room = namespace.rooms.find((room) => room.roomTitle === roomTitle);
    room.history.push(msg);
    console.log(namespace);
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
