const User = require('../models/user.server.model');
const nodemailer = require('../apis/nodemailer');

exports.signup = (req, res, next) => {
  const user = req.body;
  //user.userPassword = hashasbase64(req.body.userPassword);

  User.createUser(user, (err, result) => {
    if(err) return next(err);
    res.json(result);
  });
};

exports.sendEmailForVerified = (req, res, next) => {
  const user = {
    "userID" : req.params.userID,
    "userEmail" : req.body.userEmail
  };
  //user.userID = hashasbase64(req.params.userID);

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


exports.verifyEmail = (req, res, next) => {
  const user = {
    "userID" : req.params.userID
  };
  //user.userID = decodehashing(req.params.userID);

  User.updateUser(user, (err, userName) => {
    if(err) return next(err);
    res.render('emailCheck', {
      "name" : userName
    });
  });
};


exports.checkEmailVerified = (req, res, next) => {
  const user = {
    "userID" : req.params.userID
  };

  User.findUser(user, (err, result) => {
    if(err) return next(err);
    res.json(result);
  });
};
