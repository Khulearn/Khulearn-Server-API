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

    const query = "update users set userEmailChecked = 'y' where userID = '"
            +user.userID+"';";

    db.query(query, (err, rows, moreResultSets) => {
      if(err){
        console.log("updateUser error");
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
        "userEmailChecked" : util.inspect(rows)
      });
      db.close(()=>{});
    });
  });
};
