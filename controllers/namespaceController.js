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
