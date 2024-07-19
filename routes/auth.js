const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const createBaseResponse = require('../startup/baseResponse')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send("يوجد خطأ بالمدخلات");

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('بريد إلكتروني أو كلمة سر غير صحيحة');


  const validPassword = await bcrypt.compare(req.body.password, user.password);
  // console.log(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('بريد إلكتروني أو كلمة سر غير صحيحة');

  const token = user.generateAuthToken();
  let response = createBaseResponse(
    { ..._.pick(user, ["_id", "name", "email", "isAdmin"]), token }, true, 200, 0)

  res.send(response);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}

module.exports = router; 
