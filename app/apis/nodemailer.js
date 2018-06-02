const nodemailer = require('nodemailer'),
      Promise = require('bluebird'),
      google = require('../../googleKey'),
      config = require('../../config/config');

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: config.nodemailer.host,
  port: config.nodemailer.port,
  auth: {
    user: google.email,
    pass: google.password
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = user => {
  return new Promise((resolve, reject) => {
    const verifyEmailUrl = "http://" + config.ip + "/email/verify/" + user._id;

    const mailOption = {
      from : google.email,
      to : user.email,
      subject : "Khulearn 가입 인증메일입니다",
      text : "링크를 클릭하시면 인증이 완료됩니다.\n <" + verifyEmailUrl + ">"
    };

    transporter.sendMail(mailOption, (err, info) => {
      transporter.close();
      if(err){
        reject(err);
      }
      console.log("send mail done");
      resolve(info);
    });
  });
};
