const socket = io()

const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})


// function outputRoomName(room) {
//   document.title = `Chat Room - ${room}`;
//   roomName.innerText = room;
// }


console.log(username); console.log(room);

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on("message", (message) => {
    console.log(message);
    outputMessage(message)

    chatMessages.scrollTop = chatMessages.scrollHeight
})

chatForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    console.log(msg);

    socket.emit("chatMessage", (msg))
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()
})

function outputMessage (message) {
    const div = document.createElement("div")
    div.classList.add("message")
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p> <p class="text"> ${message.message} </p>`

    document.querySelector(".chat-messages").appendChild(div)
}

function outputRoomName(room) {
  document.title = `Chat Room - ${room}`;
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});