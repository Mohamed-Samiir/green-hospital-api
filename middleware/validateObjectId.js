const mongoose = require('mongoose');

module.exports = function (paramName = 'id') {
  return function (req, res, next) {
    const paramValue = req.params[paramName];
    if (!paramValue || !mongoose.Types.ObjectId.isValid(paramValue))
      return res.status(404).send('Invalid ID.');

    next();
  }
}