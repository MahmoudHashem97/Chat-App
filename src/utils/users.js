const users =[]

const adduser=({id ,username ,room})=>{
// clean the data 
    username =username.trim().toLowerCase()
    room =room.trim().toLowerCase()

    //validate
    if(!username|| !room){
        return {
            error:'username and room is required'
        }
    }
    //check for existing user
    const existingUser =users.find((user)=>{
        return user.room ===room && user.username ===username
    })
    //validat user name
    if (existingUser){
        return {
            error:'username is in use'
        }
    }
    const user = {id,username,room}
    users.push(user)
    return{ user}

}


const removeUser=(id)=>{
const index =users.findIndex((user)=>user.id===id)
if (index !==-1){
    return users.splice(index,1)[0]
} 


// users = users.filter((user)=>{
//     return user.id!==id
// })

}

const getUser =(id)=>{
    const index =users.findIndex((user)=>user.id===id)
    if (index !==-1){
        return users[index]
    } 
}

const getUsersInRoom = (room)=>{
    room=room.trim().toLowerCase()
return users.filter((user)=>user.room === room)

}



module.exports={
    adduser,
    removeUser,
    getUser,
    getUsersInRoom
}




// adduser({
//     id:33,
//     username:'mahmoud',
//     room:'Egy'
// })
// adduser({
//     id:21,
//     username:'ff',
//     room:'Egny'
// })
// adduser({
//     id:231,
//     username:'ffe',
//     room:'Egmy'
// })

// res=adduser({
//     id:22,
//     username:'hashem',
//     room:'egy'
// })

// const get= getUsersInRoom('egy')
// console.log(get)

