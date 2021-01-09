import io from 'socket.io-client'
const socket = io('http://localhost:2070', {transports: ['websocket','io', 'polling', 'flashsocket']})
export {socket}