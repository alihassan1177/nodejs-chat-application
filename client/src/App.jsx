import {useState, useEffect} from "react"
import io from "socket.io-client"

const socket = io.connect("http://localhost:3000")

export default function App(){

  const [username, setUsername] = useState("")
  const [room, setRoom] = useState("")
  const [roomJoined, setRoomJoined] = useState(false)
  const [message, setMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  function joinRoom(){
    if(username !== "" && username.length > 2 && room !== ""){
      socket.emit("join_room", room)
      setRoomJoined(true)
    }
  }

  async function sendMessage(){
    if(message !== ""){
      const messageData = {
        roomID : room,
        author : username,
        message : message,
        time : new Date().toLocaleTimeString()
      }
      await socket.emit("send_message", messageData)
      setMessageList((list) => [...list, messageData]);
      console.log(messageList)
    }
    setMessage("")
  }

  useEffect(()=>{
    socket.on('received_message', (data)=>{
      setMessageList((list) => [...list, data]);
      console.log("Message Sent")
    })
  }, [])

  return <div className="h-screen bg-gray-900 grid place-items-center">
    <div className="max-w-[400px] w-full min-h-[400px] overflow-hidden bg-gray-600 rounded-md">
      {
        !roomJoined  
          ? <LoginComponent 
              username={username}
              setUsername={setUsername} 
              setRoom={setRoom}
              room={room}
              joinRoom={joinRoom}
            />
          : <ChatComponent 
              socket={socket}
              username={username}
              room={room}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              setMessageList={setMessageList}
              messageList={messageList}
            />
      }
    </div>
  </div>
}

function LoginComponent({username, setUsername, room, setRoom, joinRoom }){
 return <div className="flex flex-col gap-3 p-6">
 <h1 className="text-white font-bold text-2xl">Join Chat Room with Room ID and Username</h1>
   <div className="flex flex-col gap-1">
     <label className="font-semibold text-white text-md">Username</label>
     <input className="p-2 rounded-md" value={username} onChange={(e)=>setUsername(e.target.value)} type="text" />
   </div>
   <div className="flex flex-col gap-1">
     <label className="font-semibold text-white text-md">Room ID</label>
     <input value={room} className="p-2 rounded-md" onChange={(e)=>setRoom(e.target.value)} type="text" />
   </div>
   <button onClick={joinRoom} className="bg-gray-900 text-white p-3 hover:bg-gray-700 rounded-md transition-colors p-2">Join Room</button>
 </div> 
}

function ChatComponent({socket, username, room, message, setMessage, sendMessage, setMessageList, messageList}){

  return <div className="relative h-full">
    <h1 className="font-bold p-3 text-white text-2xl bg-gray-800">Live Chat</h1>
    <div className="h-[300px] overflow-y-scroll p-3 flex flex-col gap-3">
      {/* messageList.map((msg, index) => {
        return   <p key={index} data-name={msg.author}  className={msg.author == username ? "msg self" : "msg away"}>
            {msg.message}
      </p>   
      }) */}

    </div>
    <div className="bg-gray-700 flex p-2 gap-1">
      <textarea onChange={(e)=>setMessage(e.target.value)} value={message}  className="rounded-md p-1" cols="22" rows="1"></textarea>
      <button onClick={sendMessage} className="w-[200px] bg-gray-800 text-white font-semibold p-2 hover:bg-gray-600 hover:text-gray-900 transition-colors rounded-md">Send Message</button>
    </div>
  </div> 
}