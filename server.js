const express = require("express")
const app = express()
const path = require("path")
const http = require("http")

const server = http.createServer(app)

const socketio = require("socket.io")

const io = new socketio.Server(server)

const messageFormat = require("./utils/messages")

app.use(express.static(path.join(__dirname, "public")))

const {userJoin, getUser, showUsers, disconnectUser, usersInRoom} = require("./utils/users")
const { Socket } = require("socket.io-client")

io.on("connection", (socket) => {

    socket.on("joinRoom", ({username, room}) => {
        const user = userJoin(socket.id, username, room)

        socket.join(user.room)

        showUsers()

        io.to(user.room).emit("roomUsers", {
            room : user.room,
            users : usersInRoom(user.room)
        })

        console.log("new user connected");
        socket.emit("message", messageFormat("chatBot", "welcome to the chat")) // this is emmtied form server to user
        socket.broadcast.to(user.room).emit("message", messageFormat("chatBot", `${user.username} has joined the chat`))
    })
    

    //The distinction between socket.emit() and io.emit() lies in their targets:
    //socket.emit() sends a message only to the specific socket/connection it's called on.
    //io.emit() sends a message to all connected sockets/clients.
    
    socket.on("disconnect", () => {
        const user = getUser(socket.id)
        console.log(user);
        io.to(user.room).emit("roomUsers", {
            room : user.room,
            users : usersInRoom(user.room)
        })
        disconnectUser(socket.id)
        console.log("a user is disconnected");
        io.to(user.room).emit("message", messageFormat("chatBot", `${user.username} has left the chat`))
    })

    socket.on("chatMessage", (msg) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("message", messageFormat(user.username, msg))
    })
})


app.get("/", (req, res) => {
    res.send("hello from the server")
})

const PORT = 8000
server.listen(PORT, () => { 
    // here server is to be listened, app.listen will also work, but
    // server is explicitly made to use socket.io methods and this chat server "io" is made by
    // server which is made by http.createServer method
    console.log("sever started at port : " + PORT);
})

