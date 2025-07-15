const express = require('express');
const users = require('../routes/users');
const auth = require('../routes/auth');
const specializations = require('../routes/specializations')
const doctors = require('../routes/doctors')
const clinics = require('../routes/clinics')
const clinicDoctors = require('../routes/clinicDoctors')
const shortcuts = require('../routes/shortcuts')
const questions = require('../routes/questions')
const procedures = require('../routes/procedures')
const departments = require('../routes/departments')
const branches = require('../routes/branches')
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/specializations', specializations);
  app.use('/api/doctors', doctors);
  app.use('/api/clinics', clinics);
  app.use('/api/clinicDoctors', clinicDoctors);
  app.use('/api/shortcuts', shortcuts);
  app.use('/api/questions', questions);
  app.use('/api/procedures', procedures);
  app.use('/api/departments', departments);
  app.use('/api/branches', branches);
  app.use('/api/auth', auth);
  app.use(error);
}