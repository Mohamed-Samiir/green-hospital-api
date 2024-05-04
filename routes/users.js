const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();
const createBaseResponse = require('../startup/baseResponse')

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/addUser", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send(createBaseResponse(null, false, 400, 0, "error", "User already registered."));

  user = new User(_.pick(req.body, ["name", "email", "password", "isAdmin", "isActive"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(createBaseResponse(_.pick(user, ["_id", "name", "email", "isAdmin", "isActive"]), true, 200));
});

router.post("/editUser", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(createBaseResponse(null, false, 400, 0, "error", "User not registered."));

  const salt = await bcrypt.genSalt(10);
  let newPassword = req.body.password ? await bcrypt.hash(req.body.password, salt) : user.password;

  user = await User.findByIdAndUpdate(
    user._id,
    {
      name: req.body.name,
      email: req.body.email,
      isAdmin: req.body.isAdmin,
      isActive: req.body.isActive,
      password: newPassword
    }
  );

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(createBaseResponse(_.pick(user, ["_id", "name", "email", "isAdmin", "isActive"]), true, 200));
});

router.get("/getUsers", async (req, res) => {
  const users = await User.find()
    .sort("email")

  res.send(createBaseResponse(users, true, 200, 1));
})

module.exports = router;
