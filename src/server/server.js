const express = require('express')
const app = express()
const socketIo = require('socket.io')
const db = "mongodb://localhost/game";
const mongoose = require('mongoose')
const PORT = 2070

let gameMap = [
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,1,2,1,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0
]


mongoose.connect(db, {useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
    .then(() => console.log("Mongo....   OK"))
    .catch(err => console.log("Mongo.... ERROR"));

const expressServer =  app.listen(PORT,()=>{
    console.log("Server....  OK", PORT)
})

const io = socketIo(expressServer)
let onlineMembers = 0

io.on('connection',(socket)=>{

    onlineMembers++

    io.emit('online',onlineMembers)

    console.log("Socket....  OK")

    socket.on("disconnect",()=>{
        console.log("Socket.... Disconnected")
        onlineMembers--
        io.emit('online',onlineMembers)
    })

    socket.on('left click',msg => {
        const temp = gameMap
        temp[msg.message[0]] = msg.message[1]
        gameMap = temp
        console.log("Left click event")
        mapUpdate()
    })

    socket.on('right click',msg => {
        const temp = gameMap
        temp[msg.message[0]] = msg.message[1]
        gameMap = temp
        console.log("Right click event")
        mapUpdate()
    })

    socket.on('give map' , map => {
        io.emit('map',gameMap)
        console.log("Give map event")
    })

    socket.on('preloadMap',map => {
        socket.emit('preMap',gameMap)
    })


    function mapUpdate() {
        io.emit('map',gameMap)
    }
})

