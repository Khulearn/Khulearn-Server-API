const video = require('../../app/controllers/video.server.controller');

module.exports = app => {
  app.route('/')
    .get((req, res, next)=>{
      res.render('index', {
        "videoURL" : "http://localhost:3000/video/ourtime.mkv"
      });
    });

  app.route('/video/:videoID')
    .get(video.streaming);
};
