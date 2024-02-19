let users = []

const userJoin = (id, username, room) => {
    const user = {id, username, room}
    users.push(user)
    return user
}

const getUser = (id) => {
    return users.find(user => user.id === id)
}

const disconnectUser = (id) => {
    const index = users.filter(user => user.id === id)

    if(index === -1) {
        return users.splice(index, 1)[0]
    }
}

const showUsers = () => {
    for (const user of users) {
        console.log(user);
    }
}

const usersInRoom = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = { userJoin, getUser, showUsers, disconnectUser, usersInRoom}