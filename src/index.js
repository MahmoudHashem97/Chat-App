
const path = require('path')
const http =require('http')
const express =require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {getUser,getUsersInRoom,removeUser,adduser}=require('./utils/users')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {generateMessages,generateMessagesLocations }=require('./utils/messages')
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))


// let count =0  
io.on('connection',(socket)=>{
    console.log('new web socket connection')

   



    socket.on('join',({username ,room},callback)=>{

        const{error,user} = adduser({id:socket.id,username,room} )
        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message',generateMessages('admin','Welcome'))
        socket.broadcast.to(user.room).emit('message',generateMessages('admin',user.username+' has joined'))//emit here will send the message to all except the one whoo owne the socket 
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)

        })
        callback()
    })

    socket.on('sendMessage',(message,callback)=>{
        const user =getUser(socket.id)
        if(user){
            const filter= new Filter()
        if(filter.isProfane(message)){
            return callback('not allowed language')
        }
        io.to(user.room).emit('message',generateMessages(user.username,message))
        callback()
        }
        
    })



  
    socket.on('disconnect',()=>{
       const user = removeUser(socket.id)

       if(user){
            io.to(user.room).emit('message',generateMessages('Admin',user.username+'  has left'))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)

            })
       }
       
    })



    socket.on('sendlocation',( coordinates,callback)=>{
        const user =getUser(socket.id)
        if(user){
            io.to(user.room).emit('locationmessage',generateMessagesLocations(user.username,`https://google.com/maps?q=${coordinates.long},${coordinates.latit}`))
            // callback('locations delevered')
       }
       callback()
    })
})


server.listen(port,()=>{
    console.log('server is up on port ' + port)
})