import React,{useState,useEffect} from 'react'
import Canvas from "../canvas";
import {socket} from "../../utils/socket";

export default function Main () {
    const [playerName,setPlayerName] = useState('Dimas')
    const [preloadedMap, setPreloadedMap] = useState([])
    const [connected,setConnected] = useState(false)

    const handleChange = (e) =>{
        setPlayerName(e.target.value)
    }

    useEffect(()=>{
        socket.emit('playerName',playerName)
    },[setPlayerName])

    function connect() {
         socket.emit('preloadMap')
        socket.on('preMap',map=>{
            setPreloadedMap(map)
          setTimeout(()=>{
              setConnected(true)
          },1000)
            console.log(map)
        })


    }

    return <div>
        <input onChange={handleChange} value={playerName} placeholder="Nickname"/>
        <button onClick={connect}>Go play</button>
        {connected?<Canvas preloaded={preloadedMap} />:null}
    </div>

}