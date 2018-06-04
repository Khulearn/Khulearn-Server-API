const util = require('util');
const odbc = require('odbc');
const config = require('../../config/config');
const db = new odbc.Database();


/*
create table VIDEO(
	videoID number constraint videoID_pk primary key,
	videoURL varchar(100),
	constraint lectureID_fk foreign key(lectureID) references lecture(lectureID)
);
*/
exports.createVideo = (video, res, next) => {
  db.open(config.tibero, err => {
    if(err){
      console.log("TIBERO connect FAIL");
      console.log(err);
      return;
    }

    const query = "insert into video values('"
            +video.videoID+"', '"
            +video.videoURL+"', '"
            +video.lectureID+"');";

    db.query(query, (err, rows, moreResultSets) => {
      if(err){
        console.log("createVideo error");
        console.log(err);
        db.close(()=>{});
        return next(err);
      }
      res.json({
        "result" : "SUCCESS",
        "video" : video
      });
      db.close(()=>{});
    });
  });
};
