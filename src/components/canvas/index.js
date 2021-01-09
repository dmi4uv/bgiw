import React, { useEffect, useRef,useState } from 'react'
import "./style.scss"
import {socket} from "../../utils/socket";


export default function Canvas(props) {
    const [box_size, setBox_size] = useState(30)
    const mapCanvasRef = useRef(null)
    const [gameMap,setGameMap] = useState(props.preloaded)
    const map_size = Math.sqrt(gameMap.length)

    let bez = gameMap
    //не работает при скролле


    const onRightClick = (e) => {
        e.preventDefault()
        const x = e.clientX - e.target.offsetLeft
        const y = e.clientY - e.target.offsetTop
        socket.emit('right click', [x,y])
    }
    const onLeftClick = (e) => {
        const x = e.clientX - e.target.offsetLeft
        const y = e.clientY - e.target.offsetTop
        socket.emit('left click',[x,y])
    }

    let scale = 1

    const giveMap = (e)=> {
        console.log(e.deltaY)
        console.log(scale)
        if (e.deltaY<0){
            scale += .01
        } else {
            scale -= .01
        }
            const mapCanvas = mapCanvasRef.current.getContext('2d')
            // mapCanvas.clearRect(0, 0, mapCanvasRef.current.width, mapCanvasRef.current.height)
        mapCanvas.scale(1,1)
            mapCanvas.scale(scale,scale)
    }

    useEffect(()=>{
       setInterval(()=>{
           draw(bez)
       },1000/60)

    },[])

    useEffect(()=>{

        draw(bez)
    },[setBox_size])

    function draw(map) {
        const mapCanvas = mapCanvasRef.current.getContext('2d')
        mapCanvas.imageSmoothingEnabled=false
        mapCanvas.clearRect(0, 0, mapCanvasRef.current.width, mapCanvasRef.current.height)
        for (let i = 0; i<map_size; i++) {
            for (let k =0; k<map_size; k++){
                switch (map[((k*map_size)+i)].type) {
                    case undefined :
                        mapCanvas.fillStyle='#58b3f9'
                        break
                    case "Ground" :
                        mapCanvas.fillStyle='#7d5a2e'
                        break
                    case "Pink" :
                        mapCanvas.fillStyle='#df97e5'
                        break
                    case "Player":
                        mapCanvas.fillStyle='#ef41ff'
                        break
                    default:
                        return
                }
                mapCanvas.fillRect(i*box_size,k*box_size,box_size-1,box_size-1)
            }
        }
    }

    socket.on('map',(data)=>{
        bez = data
    })

    return (<div id="game">
        <button >hey</button>
        <canvas onWheel={giveMap} onContextMenu={onRightClick}
    onClick={onLeftClick}
    id="mapCanvas"
    className="canvas"
    ref={mapCanvasRef}
    height="700px"
    width="1200px" />
    </div>

    )
}