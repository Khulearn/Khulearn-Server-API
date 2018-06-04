const util = require('util');
const odbc = require('odbc');
const config = require('../../config/config');
const db = new odbc.Database();


/*
create table lecture(
	lectureID number constraint lectureID_pk primary key,
	lectureTitle varchar(50),
  lectureIntro varchar(300),
  lectureContent varchar(1024),
  lectureCategory varchar(50),
  isEmbedded varchar(2),
	constraint userID_fk foreign key(userID) references user(userID)
);
*/
exports.createLecture = (lecture, res, next) => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      console.log(err);
      return;
    }

    const query = "insert into lecture values('"
            +lecture.lectureID+"', '"
            +lecture.lectureTitle+"', '"
            +lecture.lectureIntro+"', '"
            +lecture.lectureContent+"', '"
            +lecture.lectureCategory+"', '"
            +lecture.isEmbedded+"', '"
            +lecture.userID+"');";

    db.query(query, (err, rows, moreResultSets) => {
      if(err){
        console.log("createLecture error");
        console.log(err);
        db.close(()=>{});
        return next(err);
      }
      res.json({
        "result" : "SUCCESS",
        "lecture" : lecture
      });
      db.close(()=>{});
    });
  });
};
