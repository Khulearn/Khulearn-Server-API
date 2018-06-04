const video = require('../../app/controllers/video.server.controller');

module.exports = app => {
  app.route('/')
    .get((req, res, next)=>{
      res.render('index');
    });

  app.route('/video')
    .post(video.upload);

  app.route('/video/:videoID')
    .get(video.streaming);
};
