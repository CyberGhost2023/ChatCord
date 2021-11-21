const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

// get username and room from URL
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true});


// connect client to server....Added socket.io.js in chat.html to made it usable.
const socket=io()

// Join chatRoom

socket.emit("joinRoom",{username,room});

// receive message from server
socket.on("message",(msg)=>{
    outputMessage(msg)

    // scroll to message
    chatMessages.scrollTop = chatMessages.scrollHeight

})


// get Room And users
socket.on("roomUsers",({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
})



// Message on submit
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    // get message text
    const msg=e.target.elements.msg.value;
    // emit message to server
    socket.emit("chat-message",msg);
    // console.log(msg);

    e.target.elements.msg.value=''
    e.target.elements.msg.focus(); 
})


// output message to dom

function outputMessage(msg){
    const div= document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.message}
    </p>`;

    document.querySelector(".chat-messages").appendChild(div);

}

function outputRoomName(room){
   document.getElementById("room-name").innerText=room 
}

function outputUsers(users){
    const usersList=document.getElementById("users");
    usersList.innerHTML= `
        ${users.map(user=> `<li>${user.username}</li>`).join('')}
    `;
}