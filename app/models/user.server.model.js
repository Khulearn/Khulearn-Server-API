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
exports.createUser = (user, callback) => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      return callback(err, null);
    }

    const query = "insert into users values('"
            +user.userID+"', '"
            +user.userName+"', '"
            +user.userPassword+"', '"
            +user.userEmail+"', 'n');";

    db.query(query, (err, rows, moreResultSets) => {
      if(err){
        console.log("createUser error");
        console.log(err);
        db.close(()=>{});
        return callback(err, null);
      }
      const result = {
        "result" : "SUCCESS",
        "user" : user
      };
      callback(null, result);
      db.close(()=>{});
    });
  });
};

exports.updateUser = (user, callback) => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      return callback(err, null);
    }

    const query1 = "update users set userEmailChecked = 'y' where userID = '"
            +user.userID+"';";
    const query2 = "select userName from users where userID = '"
            +user.userID+"';";

    db.query(query1, (err, rows, moreResultSets) => {
      if(err){
        console.log("updateUser1 error");
        db.close(()=>{});
        return callback(err, null);
      }
      const userName = db.querySync(query2)[0].USERNAME;
      callback(null, userName);
      db.close(()=>{});
    });
  });
};

exports.findUser = (user, callback) => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      return callback(err, null);
    }

    const query = "select userEmailChecked from users where userID = '"
                    + user.userID + "';";

    db.query(query, (err, rows, moreResultSets) => {
      if(err){
        console.log("findUser error");
        db.close(()=>{});
        return callback(err, null);
      }
      const result = {
        "result" : "SUCCESS",
        "userEmailChecked" : rows[0].USEREMAILCHECKED
      };
      callback(null, result);
      db.close(()=>{});
    });
  });
};
