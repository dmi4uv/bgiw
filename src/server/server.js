const express = require('express')
const app = express()
const socketIo = require('socket.io')
const db = "mongodb://localhost/game";
const mongoose = require('mongoose')
const PORT = 2070
const mapGenerator = require( "./mapGenerator")
let playerName = 'default'
const cfg = require('./mapConfig')
console.log(mapGenerator())
let playerPos = 42
let gameMap = mapGenerator()
let playerGround = 0
const playerColor = "Pink"
gameMap[42] = {
    type: "Player"
}
gameMap[43] = {
    type: "Ground"
}
gameMap[41] = {
    type: "Ground"
}

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

    socket.on('playerName',payload =>{
        playerName = payload
    })

    socket.on('left click', payload => {
        const itemIndex = ((Math.floor(payload[0]/30)))+Math.floor(payload[1]/30)*cfg.map_size
        const temp = gameMap


        if(
            (
                (itemIndex==playerPos+1)||
                (itemIndex==playerPos-1)||
                (itemIndex+cfg.map_size==playerPos)||
                (itemIndex-cfg.map_size==playerPos)
            )
            &&
            (temp[itemIndex].type=="Ground")
        ){

            temp[itemIndex].type = "Player"
            temp[playerPos].type = "Ground"
            playerPos = itemIndex
        } else if(
            (
                (itemIndex==playerPos+1)||
                (itemIndex==playerPos-1)||
                (itemIndex+cfg.map_size==playerPos)||
                (itemIndex-cfg.map_size==playerPos)
            )
            &&
            (temp[itemIndex].type==playerColor)
        ){

            temp[itemIndex].type = "Player"
            temp[playerPos].type = playerColor
            playerPos = itemIndex
        } else return


        //     if(temp[itemIndex].type!=="Player"){
        //     temp[itemIndex].type = "Player"
        // } else {
        //     temp[itemIndex].type = "Sea"
        // }


        mapUpdate()
        console.log("Left click event")
    })

    socket.on('right click',payload => {
        const itemIndex = ((Math.floor(payload[0]/30)))+Math.floor(payload[1]/30)*cfg.map_size
        const temp = gameMap

        if(
            (
                (itemIndex==playerPos+1)||
                (itemIndex==playerPos-1)||
                (itemIndex+cfg.map_size==playerPos)||
                (itemIndex+cfg.map_size+1==playerPos)||
                (itemIndex-cfg.map_size-1==playerPos)||
                (itemIndex-cfg.map_size==playerPos)
            )
            &&
            (temp[itemIndex].type=="Ground"||temp[itemIndex].type==playerColor)
        ){
            temp[itemIndex] = 0
            playerGround++
        } else if ((playerGround)&&(
            (itemIndex==playerPos+1)||
            (itemIndex==playerPos-1)||
            (itemIndex+cfg.map_size==playerPos)||
            (itemIndex-cfg.map_size==playerPos)
        ))
        {
            temp[itemIndex] = {
                owner: playerName,
                type: playerColor
            }
            playerGround--
        }

        // if(temp[itemIndex].type!=="Ground"){
        //     temp[itemIndex] = {
        //         type:"Ground",
        //         owner: playerName
        //     }
        // } else {
        //     temp[itemIndex] = 0
        // }

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

