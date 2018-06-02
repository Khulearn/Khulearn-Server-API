const User = require('../models/user.server.model');
const nodemailer = require('../apis/nodemailer');

exports.signup = (req, res, next) => {
  const user = req.body;
  //user.userPassword = hashasbase64(req.body.userPassword);

  User.createUser(user, res, next);
};

exports.sendEmailForVerified = (req, res, next) => {
  const user = {
    "userID" : req.params.userID,
    "userEmail" : req.body.UserEmail
  };

  nodemailer(user).then(result => {
    return res.json({
      "result" : "SUCCESS",
      "code" : "SEND_EMAIL",
      "message" : result
    });
  }).error(err => {
    return next(err);
  });
};


//user
exports.verifyEmail = (req, res, next) => {
  const user = {
    "userID" : req.params.userID,
    "userEmailChecked" : "y"
  };

  User.updateUser(user, res, next);
};


exports.checkEmailVerified = (req, res, next) => {
  const user = {
    "userID" : req.params.userID
  };

  User.findUser(user, res, next);
};
