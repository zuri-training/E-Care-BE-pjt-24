// Core Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const InitiateMongoServer = require('./src/db/mongoose');

// Custom Dependencies
InitiateMongoServer();

// Routers
const baseRouter = require('./src/router');
const doctorRouter = require('./src/router/doctor.router');
const patientRouter = require('./src/router/patient.router');
const giveadvRouter = require('./src/router/giveadvRouter');
const advRouter = require('./src/router/advRouter');

// App Init
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: '*' }));
app.use(morgan('tiny'));

// Router Middleware
app.use('/', baseRouter);
app.use('/api/v1/doctor', doctorRouter);
app.use('/api/v1/patient', patientRouter);
app.use(giveadvRouter);
app.use(advRouter);

module.exports = app;