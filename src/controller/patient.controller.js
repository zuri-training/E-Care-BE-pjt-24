/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const { sendError, sendSuccess } = require('../../utils/responseHandler');
const { throwError } = require('../../utils/handleErrors');
const { hashManager } = require('../../utils/bcrypt');
const { jwtManager } = require('../../utils/tokenizer');
const sendMail = require('../../utils/email');
const { activateAccount } = require('../../utils/messages');
const { uploadFile } = require('../../utils/uploader');
const Patient = require('../models/patient');

exports.signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      dob,
    } = req.body;

    if (
      !firstname
      || !lastname
      || !email
      || !password
      || !dob) {
      throwError('All data is required', 401);
    }

    if (req.file && req.file.path) {
      const url = await uploadFile(req.file.path);
      req.body.image = url;
    }

    const patientExist = await Patient.findOne({ email });

    if (!patientExist) {
      req.body.password = await hashManager().hash(password);
      const token = Math.floor(Math.random() * 90000) + 10000;
      const newPatient = await Patient.create({ ...req.body, token });

      if (newPatient) {
        const activationLink = activateAccount(token);
        await sendMail(email, 'account activation', activationLink);
        return sendSuccess(res, { patientId: newPatient._id }, 'success');
      }
    }
    throwError('Patient exist already', 401);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      throwError('Broken Link', 401);
    }

    const updatedPatient = await Patient.findOneAndUpdate({
      token,
      isVerified: false,
    }, { isVerified: true }, {
      new: true,
    });

    if (updatedPatient) {
      const message = `<h3> Welcome ${updatedPatient.firstname},</h3> <br/> Your account was activated successfully <br/> Regards. <br/> E-care Team`;
      await sendMail(updatedPatient.email, 'E-Care Activation Status', message);
      const jwttoken = await jwtManager().sign({
        patientId: updatedPatient._id,
        email: updatedPatient.email,
        role: updatedPatient.role,
        firstname: updatedPatient.firstname,
        lastname: updatedPatient.lastname,
      });
      return sendSuccess(res, { token: jwttoken });
    }
  } catch (err) {
    return sendError(res, err);
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throwError('All data is required', 401);
    }

    const patientExist = await Patient.findOne({ email });

    if (!patientExist) {
      return { error: 'Invalid Credentials' };
    }

    const validatePassword = await hashManager().compare(password, patientExist.password);
    if (patientExist && validatePassword) {
      if (!patientExist.isVerified) {
        const token = Math.floor(Math.random() * 90000) + 10000;
        const updatedPatient = await Patient.findOneAndUpdate({ email },
          { token },
          { new: true });
        if (updatedPatient) {
          const activationLink = activatePatient(token, updatedPatient._id);
          await sendMail(updatedPatient.email, 'account activation', activationLink);
          throwError('Account not activated, check your email to activate', 401);
        }
      }
      const token = await jwtManager().sign({
        patientId: patientExist._id,
        email: patientExist.email,
        role: patientExist.role,
        firstname: patientExist.firstname,
        lastname: patientExist.lastname,
      });
      return sendSuccess(res, { token });
    }
    throwError('Incorrect Password or Email', 401);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.resendToken = async (req, res) => {
  try {
    const { patientId } = req.params;

    if (!patientId) {
      throwError('patientId is required', 401);
    }

    const token = Math.floor(Math.random() * 90000) + 10000;
    const updatedPatient = await Patient.findOneAndUpdate({
      _id: patientId,
      isVerified: false,
    }, { token }, { new: true });
    if (!updatedPatient) {
      throwError('Account has been activated', 401);
    }
    const activationLink = activate(token);
    await sendMail(updatedPatient.email, 'account activation', activationLink);

    return sendSuccess(res, 'Token Sent');
  } catch (err) {
    return sendError(res, err);
  }
};

exports.getAllPatients = async (req, res) => {
  const { offset, limit } = req.query;

  const patients = await Patient.find({}).skip(offset).limit(limit);

  const response = {
    count: patients.length,
    patients,
  };

  return sendSuccess(res, response);
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      throwError('Email is required', 401);
    }

    const patient = await Patient.findOne({ email });

    if (!patient) {
      throwError('Invalid patient', 401);
    }

    const token = Math.floor(Math.random() * 90000) + 10000;
    const updatedPatient = await Patient.findOneAndUpdate({
      email,
    }, { token }, {
      new: true,
    });

    if (updatedPatient) {
      await sendMail(patient.email, 'Reset Password', token);
      return sendSuccess(res, {}, 'Email sent');
    }
  } catch (err) {
    return sendError(res, err);
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throwError('Token and new password is required', 401);
    }

    const password = await hashManager().hash(newPassword);
    const updatedPatient = await Patient.findOneAndUpdate({
      token,
    }, { password, token: '' }, {
      new: true,
    });

    if (updatedPatient) {
      const { email, lastname } = updatedPatient;
      const message = `<h3> Hi ${lastname},</h3> <br/> Password reset successful <br/> Regards. <br/> E-care Team`;
      await sendMail(email, 'E-Care Reset Password', message);
      return sendSuccess(res, {}, 'success');
    }
    throwError('something went wrong', 401);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.getPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    if (!patientId) {
      throwError('patientId is required', 401);
    }

    const patient = await Patient.findById(patientId);

    const response = patient.toObject();
    delete response.password;
    delete response.token;
    delete response.isVerified;
    delete response.__v;

    if (!patient) {
      throwError('Patient not found', 404);
    }

    return sendSuccess(res, response);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { patientId } = req.auth;
    const patient = req.body;

    if (Object.keys(patient).length === 0 && patient.constructor === Object) {
      throwError('patientId and data is required', 401);
    }

    if (req.file && req.file.path) {
      const url = await uploadFile(req.file.path);
      patient.image = url;
    }

    let updatedPatient = await Patient.findOneAndUpdate({ _id: patientId }, patient, { new: true });
    if (updatedPatient) {
      updatedPatient = updatedPatient.toObject();
      delete updatedPatient.password;
      delete updatedPatient.token;
      delete updatedPatient.isVerified;
      delete updatedPatient.__v;
      return sendSuccess(res, updatedPatient);
    }
    throwError('Patient not found', 401);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { patientId } = req.auth;
    const patient = await Patient.findById(patientId);

    if (!patient) {
      throwError('Patient not found', 401);
    }

    const deletePatient = await Patient.findOneAndDelete({ _id: patientId });
    if (deletePatient) {
      return sendSuccess(res, {}, 'success');
    }
  } catch (err) {
    return sendError(res, err);
  }
};
