//Imports
const path=require('path'); //Library to manage paths
const express=require('express'); //Library to set up the server
var WebSocketServer = require('websocket').server;
var WebSocketClient = require('websocket').client;

const app=express(); //Instance an express server

//settings
app.set('port', process.env.PORT || 1337); ////Set the default port  or port 1337
app.set('view engine', 'ejs'); //Set an engine to render the views (Webs pages)

//Static files
app.use(express.static(path.join(__dirname,'public')));/* Set the public folder
                                                           all the CSS and javascript files belong 
                                                           to this folder */
//Routes
app.get('/',(req,res)=>{
    res.render('index');
});

//Start server
const server=app.listen(app.get('port'),()=>{       //Server start to listen in PORT
    console.log('Server on port ',app.get('port'));
});

/* ******************************************
                Web Sockets
   ****************************************** */

wsServer = new WebSocketServer({
    httpServer:server
});

var sensor;
//Store all the clients who log in
var client=[];

//Broadcas the message to all de clients
broadcastMessage=(message)=>{
  client.forEach(element => {
    element.sendUTF(message);
  });
};

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);    
  console.log("Nueva conexion");

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) { 
      //the format of message         
      if (message.type === 'utf8') {        
        var json;
        try {
          console.log(message.utf8Data);   
          //Convert the message to json 
          json = JSON.parse(message.utf8Data);
          console.log(json.message);
        } catch (e) {
          /*console.log('This doesn\'t look like a valid JSON: ');
              sensor=connection;
            broadcastMessage('{"origin":"sensor","type":"update","message":"established connection"}');*/
            var dis=message.utf8Data;
            dis=dis.replace(/\r/g, '');
            broadcastMessage('{"origin":"sensor","type":"distance","message":"'+dis+'"}');  
          return;
        }
        // process WebSocket message
        switch (json.origin) {
          case 'sensor':
            if(json.type==="connection"){
              sensor=connection;
              broadcastMessage('{"origin":"sensor","type":"update","message":"established connection"}');
            }else if(json.type==="update"){
              broadcastMessage('{"origin":"sensor","type":"distance","message":"'+json.message+'"}');
            }
            break;
          case 'client':
            if(json.type==="connection"){
              client.push(connection);
              connection.sendUTF('{"origin":"server","message":"established connection"}');
            }else if(json.type==="update"){              
              sensor.sendUTF(json.message);
            }
            break;

          default:
            var dis=message.utf8Data;
            dis=dis.replace(/\r/g, '');
            broadcastMessage('{"origin":"sensor","type":"distance","message":"'+dis+'"}');
            //broadcastMessage('{"origin":"sensor","message":"established connection"}');
            break;
        }      
      }
  });

  connection.on('close', function(connection) {
    // close user connection
  });
});