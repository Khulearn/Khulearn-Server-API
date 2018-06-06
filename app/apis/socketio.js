const fs = require('fs');

module.exports = (app) => {
  const io = require('socket.io')(app);
  const Files={};
  io.on('connection', socket => {
    socket.on('Start', data => {
       console.log('socket start!');
       const name = data.Name;
       Files[name] = {
           FileSize : data.Size,
           Data     : "",
           Downloaded : 0
       };
       let Place = 0;
       try{
         const Stat = fs.statSync('Temp/' +  name);
         if(Stat.isFile()){
             Files[name].Downloaded = Stat.size;
             Place = Stat.size / 524288;
         }
       }catch(err){}
       fs.open("Temp/" + name, "a+", (err, fd) => {
           if(err) console.log(err);
           else {
               Files[name].Handler = fd;
               socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
           }
       });
     });

     socket.on('Upload', data => {
       const name = data.Name;
       Files[name].Downloaded += data.Data.length;
       Files[name].Data += data.Data;
       if(Files[name].Downloaded == Files[name].FileSize){
           fs.write(Files[name].Handler, Files[name].Data, null, 'Binary', function(err, written) {
               if (err) console.error(err);
               //Generate movie thumbnail
               var readable = fs.createReadStream("Temp/" + name);
               var writable = fs.createWriteStream("public/video/" + name);
               readable.pipe(writable);
               writable.on('finish', function (err) {
                   if (err) console.error(err);
                   console.log(name + " : writing is completed.");
                   fs.close(Files[name].Handler, function (err) { //close fs module
                       if (err) console.error(err);
                       fs.unlink("Temp/" + name, function (err) {
                           //Moving File is Completed
                           if (err) console.error(err);
                           console.log(name + " is deleted.");
                       });
                   });
               });
           });
       }
       else if(Files[name].Data.length > 10485760){
           fs.write(Files[name].Handler, Files[name].Data, null, 'Binary', function(err, written){
               Files[name].Data = ""; //Reset The Buffer
               var Place = Files[name].Downloaded / 524288;
               var Percent = (Files[name].Downloaded / Files[name].FileSize) * 100;
               socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
           });
       } else {
           var Place = Files[name].Downloaded / 524288;
           var Percent = (Files[name].Downloaded / Files[name].FileSize) * 100;
           socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
       }
    });
  });
};
