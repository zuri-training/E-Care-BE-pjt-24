/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const { sendError, sendSuccess } = require('../../utils/responseHandler');
const { throwError } = require('../../utils/handleErrors');
const { hashManager } = require('../../utils/bcrypt');
const { jwtManager } = require('../../utils/tokenizer');
const sendMail = require('../../utils/email');
const { activateAccount } = require('../../utils/messages');
const { uploadFile } = require('../../utils/uploader');
const Doctor = require('../models/doctor');

exports.signup = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      licenseNumber,
      specialization,
      gender,
      role,
    } = req.body;

    if (
      !firstname
      || !lastname
      || !email
      || !password
      || !licenseNumber
      || !specialization
      || !gender
      || !role) {
      throwError('All data is required', 401);
    }

    if (req.file && req.file.path) {
      const url = await uploadFile(req.file.path);
      req.body.image = url;
    }

    const doctorExist = await Doctor.findOne({ email });

    if (!doctorExist) {
      req.body.password = await hashManager().hash(password);
      const token = Math.floor(Math.random() * 90000) + 10000;
      const newDoctor = await Doctor.create({ ...req.body, token });

      if (newDoctor) {
        const activationLink = activateAccount(token, newDoctor._id);
        await sendMail(email, 'account activation', activationLink);
        return sendSuccess(res, { message: 'Success', doctorId: newDoctor._id });
      }
    }
    throwError('Doctor exist already', 401);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.activateAccount = async (req, res) => {
  try {
    const { doctorId, token } = req.params;

    if (!doctorId || !token) {
      throwError('Broken Link', 401);
    }

    const updatedDoctor = await Doctor.findOneAndUpdate({
      _id: doctorId,
      token,
      isVerified: false,
    }, { isVerified: true }, {
      new: true,
    });

    if (updatedDoctor) {
      const message = `<h3> Welcome ${updatedDoctor.firstname},</h3> <br/> Your account was activated successfully <br/> Regards. <br/> E-care Team`;
      await sendMail(updatedDoctor.email, 'E-Care Activation Status', message);
      const jwttoken = await jwtManager().sign({
        doctorId: updatedDoctor._id,
        email: updatedDoctor.email,
        role: updatedDoctor.role,
        firstname: updatedDoctor.firstname,
        lastname: updatedDoctor.lastname,
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

    const doctorExist = await Doctor.findOne({ email });

    if (!doctorExist) {
      return { error: 'Invalid Credentials' };
    }

    const validatePassword = await hashManager().compare(password, doctorExist.password);
    if (doctorExist && validatePassword) {
      if (!doctorExist.isVerified) {
        const token = Math.floor(Math.random() * 90000) + 10000;
        const updatedDoctor = await Doctor.findOneAndUpdate({ email },
          { token },
          { new: true });
        if (updatedDoctor) {
          const activationLink = activateAccount(token, updatedDoctor._id);
          await sendMail(updatedDoctor.email, 'account activation', activationLink);
          throwError('Account not activated, check your email to activate', 401);
        }
      }
      const token = await jwtManager().sign({
        doctorId: doctorExist._id,
        email: doctorExist.email,
        role: doctorExist.role,
        firstname: doctorExist.firstname,
        lastname: doctorExist.lastname,
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
    const { doctorId } = req.params;

    if (!doctorId) {
      throwError('doctorId is required', 401);
    }

    const token = Math.floor(Math.random() * 90000) + 10000;
    const updatedDoctor = await Doctor.findOneAndUpdate({
      _id: doctorId,
      isVerified: false,
    }, { token }, { new: true });
    if (!updatedDoctor) {
      throwError('Account has been activated', 401);
    }
    const activationLink = activateAccount(token, doctorId);
    await sendMail(updatedDoctor.email, 'account activation', activationLink);

    return sendSuccess(res, 'Token Sent');
  } catch (err) {
    return sendError(res, err);
  }
};

exports.getAllDoctors = async (req, res) => {
  const { offset, limit } = req.query;

  const doctors = await Doctor.find({}).skip(offset).limit(limit);

  const response = {
    count: doctors.length,
    doctors,
  };

  return sendSuccess(res, response);
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      throwError('Email is required', 401);
    }

    const doctor = await Doctor.findOne({ email });

    if (!doctor) {
      throwError('Invalid doctor', 401);
    }

    const token = Math.floor(Math.random() * 90000) + 10000;
    const updatedDoctor = await Doctor.findOneAndUpdate({
      email,
    }, { token }, {
      new: true,
    });

    if (updatedDoctor) {
      await sendMail(doctor.email, 'Reset Password', token);
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
    const updatedDoctor = await Doctor.findOneAndUpdate({
      token,
    }, { password, token: '' }, {
      new: true,
    });

    if (updatedDoctor) {
      const { email, lastname } = updatedDoctor;
      const message = `<h3> Hi ${lastname},</h3> <br/> Password reset successful <br/> Regards. <br/> E-care Team`;
      await sendMail(email, 'E-Care Reset Password', message);
      return sendSuccess(res, {}, 'success');
    }
    throwError('something went wrong', 401);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.getDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    if (!doctorId) {
      throwError('doctorId is required', 401);
    }

    const doctor = await Doctor.findById(doctorId);

    const response = doctor.toObject();
    delete response.password;
    delete response.token;
    delete response.isVerified;
    delete response.__v;

    if (!doctor) {
      throwError('Doctor not found', 404);
    }

    return sendSuccess(res, response);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const { doctorId } = req.auth;
    const doctor = req.body;

    if (Object.keys(doctor).length === 0 && doctor.constructor === Object) {
      throwError('doctorId and data is required', 401);
    }

    if (req.file && req.file.path) {
      const url = await uploadFile(req.file.path);
      doctor.image = url;
    }

    let updatedDoctor = await Doctor.findOneAndUpdate({ _id: doctorId }, doctor, { new: true });
    if (updatedDoctor) {
      updatedDoctor = updatedDoctor.toObject();
      delete updatedDoctor.password;
      delete updatedDoctor.token;
      delete updatedDoctor.isVerified;
      delete updatedDoctor.__v;
      return sendSuccess(res, updatedDoctor);
    }
    throwError('Doctor not found', 401);
  } catch (err) {
    return sendError(res, err);
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.auth;
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      throwError('Doctor not found', 401);
    }

    const deleteDoctor = await Doctor.findOneAndDelete({ _id: doctorId });
    if (deleteDoctor) {
      return sendSuccess(res, {}, 'success');
    }
  } catch (err) {
    return sendError(res, err);
  }
};
