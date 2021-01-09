import React,{useState} from 'react'
import Canvas from "../canvas";
import {socket} from "../../utils/socket";

export default function Main () {

    const [preloadedMap, setPreloadedMap] = useState([])
    const [connected,setConnected] = useState(false)

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
        <input placeholder="Nickname"/>
        <button onClick={connect}>Go play</button>
        {connected?<Canvas preloaded={preloadedMap} />:null}
    </div>

}