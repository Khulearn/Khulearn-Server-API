window.addEventListener("load", Ready);

function Ready(){
    if(window.File && window.FileReader){ //These are the relevant HTML5 objects that we are going to use
        document.getElementById('UploadButton').addEventListener('click', StartUpload);
        document.getElementById('FileBox').addEventListener('change', FileChosen);
    }
    else
    {
        document.getElementById('UploadArea').innerHTML = "Your Browser Doesn't Support The File API Please Update Your Browser";
    }
}

let SelectedFile;
function FileChosen(evnt) {
  console.log('filechosen');
  SelectedFile = evnt.target.files[0];
  document.getElementById('NameBox').value = SelectedFile.name;
}

const socket = io.connect('http://localhost:3000');
function StartUpload(){
  console.log('upload clicked');
  let fileReader;
  if(document.getElementById('FileBox').value != "") {
        fileReader = new FileReader();
        console.log(SelectedFile.type);
        const name = document.getElementById('NameBox').value;
        let Content = "<span id='NameArea'>Uploading " + SelectedFile.name + " as " + name + "</span>";
        Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
        document.getElementById('UploadArea').innerHTML = Content;
        fileReader.onload = function(event){
          let data;
            if(!event){
               data = fileReader.content;
            }else{
               data = event.target.result;
            }
            socket.emit('Upload', { 'Name' : name, Data : data });
        }
        socket.emit('Start', { 'Name' : name, 'Size' : SelectedFile.size });
    }else{
        alert("Please Select A File");
    }

    socket.on('MoreData', function (data){
      const Place = data['Place'] * 524288; //The Next Blocks Starting Position
      let NewFile; //The Variable that will hold the new Block of Data
      if(SelectedFile.slice())
          NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
      else
          NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
      fileReader.readAsBinaryString(NewFile);
    });
}
