const patientRoute = require('../core/routerConfig');
const patientController = require('../controller/patient.controller');
const { authenticate, permit } = require('../core/auth');
const { upload } = require('../../utils/uploader');

patientRoute.post('/create', upload, patientController.signup);
patientRoute.get('/activate-patient-account/:patientId/:token', patientController.activateAccount);
patientRoute.get('/resend-token/:patientId', patientController.resendToken);
patientRoute.post('/login', patientController.signin);
patientRoute.get('/all-patients', authenticate, patientController.getAllPatients);
patientRoute.get('/get-patient/:patientId', authenticate, patientController.getPatient);
patientRoute.get('/patient-forgot-password/:email', patientController.forgotPassword);
patientRoute.post('/patient-reset-password', patientController.resetPassword);
patientRoute.put('/update-patient', authenticate, permit(['patient']), upload, patientController.updatePatient);
patientRoute.delete('/delete-patient', authenticate, permit(['patient']), patientController.deletePatient);

module.exports = patientRoute;
