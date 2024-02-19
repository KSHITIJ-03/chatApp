const moment = require("moment")

function messageFromat (username, message) {
    return {
        username,
        message,
        time : moment().format("h:mm a")
    }
}

module.exports = messageFromat