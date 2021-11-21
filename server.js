const express = require("express")
const path=require("path");
const http = require("http");
const socketio = require("socket.io")
const formatMessage= require("./utils/messages")
const {getRoomUsers,userLeave,getCurUser,userJoin}= require("./utils/users")


//work socketio a server is must. that's why we created http server.
// createserver(Request_handler)....app function works as request listener function here.
const app=express()
const server= http.createServer(app);

//set static folder
app.use(express.static(path.join(__dirname,"public")))

//create websocket for server
const io=socketio(server);

const chatBot ="ChatCord Bot";


//run whenever client connects
io.on('connection',socket=>{
    socket.on("joinRoom",({username,room})=>{
        const user=  userJoin(socket.id, username,room)

        socket.join(user.room);


 // broadcast when user connects to the user
 socket.emit("message",formatMessage(chatBot,`Welcome to the ${user.room} room`));

 // broadcast when user connects to all other users
     socket.broadcast.to(user.room).emit("message",formatMessage(chatBot,`${user.username} has entered the chat`));
    //  
     io.to(user.room).emit("roomUsers",{
        room:user.room,
        users:getRoomUsers(user.room)
    })
    
    })

    

   
    
    // listen chat-message from client
    socket.on("chat-message",(msg)=>{
        const user = getCurUser(socket.id);
        io.to(user.room).emit("message",formatMessage(user.username,msg));
    })

    // send when user leave the chat
    socket.on("disconnect",()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit("message",formatMessage(chatBot,`${user.username} has left the chat`));
            
            // get all users in the room
            io.to(user.room).emit("roomUsers",{
                room:user.room,
                usersList:getRoomUsers(user.room)
            })
        }

    })
})

const Port = process.env.PORT || 5000;

server.listen(Port,()=>{
    console.log("server started");
})


// io.emit() is used to send to all 
// socket.broadcast.emit() is used to send to all except the one who send it.
// socket.emit() to send msg to particular client.