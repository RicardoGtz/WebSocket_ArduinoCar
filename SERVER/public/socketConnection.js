let socketStatus=document.getElementById('socketStatus');
let sensorStatus=document.getElementById('sensorStatus');
let distance=document.getElementById('distance');
let btnSed= document.getElementById("btnSend");
let inDistance=document.getElementById("inDistance");
 
 // if user is running mozilla then use it's built-in WebSocket
 //window.WebSocket = window.WebSocket || window.MozWebSocket;

 //Change for the IP and port of your socket
 //var connection = new WebSocket('ws://192.168.43.159:1337');
 var connection = new WebSocket('ws://192.168.1.66:1337');

 connection.onopen = function () {
   // connection is opened and ready to use
   connection.send('{"origin":"client","type":"connection","message":"connecting..."}');
 };

 connection.onerror = function (error) {
   // an error occurred when sending/receiving data
 };

 connection.onmessage = function (message) {
   // handle incoming message
   // try to decode json (I assume that each message
   // from server is json)
   var json;
   try {
    console.log(message.data);    
     json = JSON.parse(message.data);
     console.log(json.message);
   } catch (e) {
     console.log('This doesn\'t look like a valid JSON: ',
         message.data);
     return;
   }
   if(json.origin==="server"){
      socketStatus.innerHTML=json.message;
   }else if(json.origin==="sensor"){
      if(json.type==="update")
        sensorStatus.innerHTML=json.message;
      else if(json.type==="distance")
        distance.innerHTML="Distance: "+json.message;
   }
   
 };

 btnSed.onclick=()=>{
   if(inDistance.value!==null){
      if(connection.readyState===WebSocket.OPEN){
        connection.send('{"origin":"client","type":"update","message":"'+inDistance.value+'"}');
      }
   }else{
    alert("Empty Input");
   }
 }
