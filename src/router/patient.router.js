const patientRoute = require('../core/routerConfig');
const patientController = require('../controller/patient.controller');
const { authenticate } = require('../core/auth');
const { upload } = require('../../utils/uploader');

patientRoute.post('/create', upload, patientController.signup);
patientRoute.get('/activate-patient-account/:token', patientController.activateAccount);
patientRoute.get('/resend-token/:patientId', patientController.resendToken);
patientRoute.post('/login', patientController.signin);
patientRoute.get('/all-patients/all', authenticate, patientController.getAllPatients);
patientRoute.get('/get-patient/single', authenticate, patientController.getPatient);
patientRoute.get('/patient-forgot-password/:email', patientController.forgotPassword);
patientRoute.post('/patient-reset-password', patientController.resetPassword);
patientRoute.put('/update-patient', authenticate, upload, patientController.updatePatient);
patientRoute.delete('/delete-patient', authenticate, patientController.deletePatient);

module.exports = patientRoute;
