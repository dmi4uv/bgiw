import React, { useEffect, useRef,useState } from 'react'
import "./style.scss"
import Sea from './Ocean.png'
import shuffleArray from "../../utils/shuffleArray";
import player from "./player";


export default function Canvas(props) {
    const mapCanvasRef = useRef(null)
    const [gameMap,setGameMap] = useState([
        0,0,0,0,0,
        0,0,0,0,0,
        0,0,1,1,1,
        0,0,0,0,0,
        0,0,0,0,0
    ])
    const map = []
    const map_s = 5
    for (let i=0; i<map_s*map_s;i++){
        // map.push(Math.floor(Math.random()*2))
        map.push(0)
    }
    function addStones(arr,stones){
        for(let i=0; i<stones; i++){
            arr.shift()
            arr.push(1)
        }

        return arr
    }
    //не работает при скролле
    const onMapClick = (e) => {
        const x = e.clientX - e.target.offsetLeft
        const y = e.clientY - e.target.offsetTop
        const itemIndex = ((Math.floor(x/32)))+Math.floor(y/32)*map_s
        console.log(itemIndex)
        const newMap = gameMap
        if(newMap[itemIndex]==0){
            newMap[itemIndex] = 1
        } else {
            newMap[itemIndex] = 0
        }


        console.log(newMap[itemIndex])
        setGameMap(newMap)
        console.log(newMap)
        console.log('X:' + x, 'Y:'+ y)
    }

    const Player = new player(100,100,-1)


    const map_size = Math.sqrt(map.length)

    useEffect(()=>{

        setInterval(() => {
            draw();
        }, 1000 / 60);
    },[])


    function draw() {
        const title_sheet = new Image(100,100)
        title_sheet.src=Sea

        const mapCanvas = mapCanvasRef.current.getContext('2d')
        mapCanvas.imageSmoothingEnabled=false
        for (let i = 0; i<map_size; i++) {
            for (let k =0; k<map_size; k++){
                switch (gameMap[((k*map_size)+i)]) {
                    case 0 :
                        mapCanvas.fillStyle='#58b3f9'
                        break
                    case 1:
                        mapCanvas.fillStyle='#7d5a2e'
                        break
                    default:
                        return
                }
                mapCanvas.fillRect(i*32,k*32,30,30)
            }
        }
    }


    return (<div id="game">

        <canvas onClick={onMapClick} id="mapCanvas" className="canvas" ref={mapCanvasRef} height="600px" width="900px" ></canvas>
    </div>

    )
}