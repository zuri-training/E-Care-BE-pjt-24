const doctorRoute = require('../core/routerConfig');
const doctorController = require('../controller/doctor.controller');
const { authenticate, permit } = require('../core/auth');
const { upload } = require('../../utils/uploader');

doctorRoute.post('/signup', upload, doctorController.signup);
doctorRoute.get('/activate-account/:token', doctorController.activateAccount);
doctorRoute.get('/resend-activation-link/:doctorId', doctorController.resendToken);
doctorRoute.post('/signin', doctorController.signin);
doctorRoute.get('/all/doctors', authenticate, doctorController.getAllDoctors);
doctorRoute.get('/:doctorId', authenticate, doctorController.getDoctor);
doctorRoute.get('/forgot-password/:email', doctorController.forgotPassword);
doctorRoute.post('/reset-password', doctorController.resetPassword);
doctorRoute.put('/update', authenticate, permit(['doctor']), upload, doctorController.updateDoctor);
doctorRoute.delete('/delete', authenticate, permit(['doctor']), doctorController.deleteDoctor);

module.exports = doctorRoute;
