import React, { useEffect, useRef,useState } from 'react'
import "./style.scss"
import {socket} from "../../utils/socket";


export default function Canvas(props) {

    const mapCanvasRef = useRef(null)
    const [gameMap,setGameMap] = useState(props.preloaded)
    const map_size = Math.sqrt(gameMap.length)

    let bez = gameMap
    //не работает при скролле
    const onRightClick = (e) => {
        e.preventDefault()
        console.log("Map:SIZE", map_size)
        const x = e.clientX - e.target.offsetLeft
        const y = e.clientY - e.target.offsetTop
        const itemIndex = ((Math.floor(x/32)))+Math.floor(y/32)*map_size
        const newMap = gameMap
        let i = 0
        if(newMap[itemIndex]==0){
            newMap[itemIndex] = 1
            i=1
        } else {
            newMap[itemIndex] = 0
            i = 0
        }
        socket.emit('right click',{
            message: [itemIndex,i]
        })
    }
    const onLeftClick = (e) => {

        const x = e.clientX - e.target.offsetLeft
        const y = e.clientY - e.target.offsetTop
        const itemIndex = ((Math.floor(x/32)))+Math.floor(y/32)*map_size
        const newMap = gameMap
        let i = 0
        if(newMap[itemIndex]!==2){
            newMap[itemIndex] = 2
            i = 2
        } else {
            newMap[itemIndex] = 0
            i = 0
        }

        socket.emit('left click',{
            message: [itemIndex,i]
        })
    }

    const giveMap = ()=> {
       draw(bez)
    }

    useEffect(()=>{
       setInterval(()=>{
           draw(bez)
       },1000/25)

    },[])

    function draw(map) {
        const mapCanvas = mapCanvasRef.current.getContext('2d')
        mapCanvas.imageSmoothingEnabled=false
        for (let i = 0; i<map_size; i++) {
            for (let k =0; k<map_size; k++){
                switch (map[((k*map_size)+i)]) {
                    case 0 :
                        mapCanvas.fillStyle='#58b3f9'
                        break
                    case 1:
                        mapCanvas.fillStyle='#7d5a2e'
                        break
                    case 2:
                        mapCanvas.fillStyle='#e366a2'
                        break
                    default:
                        return
                }
                mapCanvas.fillRect(i*32,k*32,30,30)
            }
        }
    }

    socket.on('map',(data)=>{
        bez = data
    })

    return (<div id="game">
        <button onClick={giveMap}>hey</button>
        <canvas onContextMenu={onRightClick}
    onClick={onLeftClick}
    id="mapCanvas"
    className="canvas"
    ref={mapCanvasRef}
    height="600px"
    width="900px" />
    </div>

    )
}