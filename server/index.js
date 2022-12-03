const express = require("express")
const app = express()
const http = require("http")
const cors = require("cors")
const {Server} = require("socket.io")

app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
	cors : {
		origin : "http://localhost:5173",
		methods : ["GET", "POST", "PUT", "DELETE"]
	}
})

io.on("connection", (socket)=>{
	console.log(`User connected at ${socket.id} `)

	socket.on("join_room", (data)=> {
		socket.join(data)
	})

	socket.on("send_message", (data)=>{
		console.log(data)
		socket.to(data.roomID).emit("received_message", data)
	})

	socket.on("disconnect", ()=>{
		console.log(`User disconnect at ${socket.id} `)
	})
})

server.listen(3000, ()=>{
	console.log("Server is Running")
})