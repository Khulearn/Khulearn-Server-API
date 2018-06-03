const util = require('util');
const odbc = require('odbc');
const config = require('../../config/config');
const db = new odbc.Database();


/*
create table USERS(
	userID varchar(25) constraint userID_pk primary key,
	userName varchar(50),
	userPassword varchar(64),
	userEmail varchar(50),
	userEmailChecked varchar(2)
);
*/
exports.createUser = (user, res, next) => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      console.log(err);
      return;
    }

    const query = "insert into users values('"
            +user.userID+"', '"
            +user.userName+"', '"
            +user.userPassword+"', '"
            +user.userEmail+"', 'n');"

    db.query(query, (err, rows, moreResultSets) => {
      if(err){
        console.log("createUser error");
        console.log(err);
        db.close(()=>{});
        return next(err);
      }
      res.json({
        "result" : "SUCCESS",
        "user" : user
      });
      db.close(()=>{});
    });
  });
};

exports.updateUser = (user, res, next) => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      console.log(err);
      return;
    }

    const query1 = "update users set userEmailChecked = 'y' where userID = '"
            +user.userID+"';";
    const query2 = "select userName from users where userID = '"
            +user.userID+"';";

    db.query(query1, (err, rows, moreResultSets) => {
      if(err){
        console.log("updateUser1 error");
        console.log(err);
        db.close(()=>{});
        return next(err);
      }
      db.query(query2, (err, rows, moreResultSets) => {
        if(err){
          console.log("updateUser2 error");
          console.log(err);
          db.close(()=>{});
          return next(err);
        }
        res.render('emailCheck', {
          "name" : rows[0].USERNAME
        });
        db.close(()=>{});
      })
    });
  });
};

exports.findUser = (user, res, next) => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      console.log(err);
      return;
    }

    const query = "select userEmailChecked from users where userID = '"
                    + user.userID + "';";

    db.query(query, (err, rows, moreResultSets) => {
      if(err){
        console.log("findUser error");
        console.log(err);
        db.close(()=>{});
        return next(err);
      }

      res.json({
        "result" : "SUCCESS",
        "userEmailChecked" : rows[0].USEREMAILCHECKED
      });
      db.close(()=>{});
    });
  });
};
