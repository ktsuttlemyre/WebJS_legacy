// with express 3.x
var express = require('express'); 
var app = express();
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(app.router);
app.post('/upload', function(req, res){
   if(req.files.myUpload){
     var python = require('child_process').spawn(
     'python',
     // second argument is array of parameters, e.g.:
     ["/home/me/pythonScript.py"
     , req.files.myUpload.path
     , req.files.myUpload.type]
     );
     var output = "";
     python.stdout.on('data', function(){ output += data });
     python.on('close', function(code){ 
       if (code !== 0) {  return res.send(500, code); }
       return res.send(200, output)
     });
   } else { res.send(500, 'No file found') }
});

require('http').createServer(app).listen(3000, function(){
  console.log('Listening on 3000');
});