import './App.css';
import Main from "./components/main/Main";
import {useEffect,useRef,useState} from 'react'
import {socket} from "./utils/socket";

function App() {
  const [isOnline,setIsOnline] = useState(false)
  const [onlineMembers,setOnlineMembers] = useState(0)

  const appRef = useRef(null)

  const preventDefault = e => {
    e.preventDefault()
  }

  useEffect(()=>{
    appRef.current.addEventListener('wheel',preventDefault)
    socket.on('connect',()=>{
      setIsOnline(true)
    })
    socket.on('online',(data)=>{
      setOnlineMembers(data)
    })
    socket.on('disconnect',()=>{
      setIsOnline(false)
      setOnlineMembers(0)
    })
    },[])

  return (
    <div className="App" ref={appRef}>
      <p>Online members: {onlineMembers}</p>
      <p>Server status: {isOnline?'on':'off'}</p>
      <Main/>
    </div>
  );
}

export default App;
