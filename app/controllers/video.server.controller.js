const Video = require('../models/video.server.model');
const fs = require('fs');

exports.streaming = (req, res, next) => {
  const video = {
    "videoID" : req.params.videoID
  };
  const path = 'public/vd/'+video.videoID;
  const vdSplit = video.videoID.split('.');
  const vdType = vdSplit[vdSplit.length-1];
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    const chunksize = (end-start)+1;
    const file = fs.createReadStream(path, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/'+vdType,
    };
    console.log(head);
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/'+vdType,
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
};
