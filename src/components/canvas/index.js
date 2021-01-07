import React, { useEffect, useRef } from 'react'
import "./style.scss"
import Sea from './Ocean.png'
import shuffleArray from "../../utils/shuffleArray";

export default function Canvas(props) {
    const sprite_size = 64
    const canvasRef = useRef(null)

    const map = []
    const map_s = 15
    for (let i=0; i<map_s*map_s;i++){
        // map.push(Math.floor(Math.random()*2))
        map.push(0)
    }
    function addStones(arr,stones){
        for(let i=0; i<stones; i++){
            arr.shift()
            arr.push(1)

        }
        console.log(arr)
        return arr
    }

    shuffleArray(addStones(map,3))

    console.log('w')

    const map_size = Math.sqrt(map.length)

    useEffect(()=>{
        const title_sheet = new Image(100,100)
        title_sheet.src=Sea

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        for (let i = 0; i<map_size; i++) {
            for (let k =0; k<map_size; k++){
                switch (map[((k*map_size)+i)]) {
                    case 0 :
                        ctx.fillStyle='green'
                        break
                    case 1:
                        ctx.fillStyle='red'
                        break
                    default:
                        return
                }
                ctx.fillRect(i*33,k*33,30,30)
            }

        }

    },[])
    

    return (
        <canvas id="canvas" ref={canvasRef} height="700px" width="1000px" ></canvas>
    )
}