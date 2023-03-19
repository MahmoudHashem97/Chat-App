const generateMessages =(username,text)=>{
    return {
        username,
        text ,
        createdAt:new Date().getTime()

    }
}


const generateMessagesLocations =(username,url)=>{
    return {
        username:username,
        url ,
        createdAt:new Date().getTime()

    }
}
module.exports ={
    generateMessages,
    generateMessagesLocations
}