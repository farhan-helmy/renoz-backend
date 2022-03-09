const User = require("../models/user");

const createUser = async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({
      user,
      token,
    });
  } catch (e) {
    res.status(400).send(e);
  }
}

const getAllUsers = async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const allUsers = await User.find();
      res.status(200).send(allUsers);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res.status(401).send();
  }
}

const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({
      user,
      token,
    });
  } catch (e) {
    res.status(400).send();
  }
}

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
}

const getMe = async (req, res) => {
  const user = req.user
  res.send({
    user
  });
}

const updateMe = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid updates!",
    });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
}

const deleteMe = async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
}

module.exports = {
  createUser,
  getAllUsers,
  loginUser,
  logoutUser,
  getMe,
  updateMe,
  deleteMe
}