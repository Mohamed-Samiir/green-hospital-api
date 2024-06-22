const express = require('express');
const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const phoneNumbers = require('../routes/phoneNumbers')
const specializations = require('../routes/specializations')
const doctors = require('../routes/doctors')
const clinics = require('../routes/clinics')
const clinicDoctors = require('../routes/clinicDoctors')
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/genres', genres);
  app.use('/api/customers', customers);
  app.use('/api/movies', movies);
  app.use('/api/rentals', rentals);
  app.use('/api/users', users);
  app.use('/api/phoneNumbers', phoneNumbers);
  app.use('/api/specializations', specializations);
  app.use('/api/doctors', doctors);
  app.use('/api/clinics', clinics);
  app.use('/api/clinicDoctors', clinicDoctors);
  app.use('/api/auth', auth);
  app.use(error);
}