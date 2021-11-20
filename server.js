const express = require("express")
const path=require("path");
const http = require("http");
const socketio = require("socket.io")

//work socketio a server is must. that's why we created http server.
// createserver(Request_handler)....app function works as request listener function here.
const app=express()
const server= http.createServer(app);

//set static folder
app.use(express.static(path.join(__dirname,"public")))

//create websocket for server
const io=socketio(server);

//run whenever client connects
io.on('connection',socket=>{
    console.log("New WS Connection");
})

const Port = process.env.PORT || 5000;

server.listen(Port,()=>{
    console.log("server started");
})