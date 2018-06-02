const util = require('util');
const odbc = require('odbc');
const config = require('../../config/config');
const db = new odbc.Database();

exports.connect = () => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      console.log(err);
      return;
    }
    console.log("TIBERO connected");
    db.close(()=>{});
  });
}

exports.select = () => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      console.log(err);
      return;
    }
    db.query("select * from regions;", (err, rows, moreResultSets) => {
      if(err) {
        console.log("select query error");
        console.log(err);
        db.close(()=>{});
        return;
      }
      console.log(util.inspect(rows));
      db.close(()=>{});
    });
  });
}
