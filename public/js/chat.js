const socket =io() 
//elements
const $messageForm =document.querySelector("#message-form")
const $messageFormInput=$messageForm.querySelector("input")
const $messageFormButton=$messageForm.querySelector("button")
const $sendlocationButton =document.querySelector("#send-location")
const $messages =document.querySelector("#messages")

//templetes
const messagesTemplet=document.querySelector("#message-templete").innerHTML
const messagesLocation=document.querySelector("#message-location").innerHTML
const sidebarTemplate =document.querySelector("#sidebar-template").innerHTML

//options query
const { username, room } = Object.fromEntries(new URLSearchParams(location.search));

const autoScroll=()=>{
    //new meesage element 
    const $newMessage =$messages.lastElementChild
    // height of message 
    const newMessageStyle =getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight =$newMessage.offsetHeight + newMessageMargin
    //visable height
    const visableHeight =$messages.offsetHeight

    //height of message container 
    const containerHeuight =$messages.scrollHeight
    //how far have i scroll
    const scrollOfset =$messages.scrollTop+visableHeight
    if(containerHeuight -newMessageHeight<=scrollOfset){
        $messages.scrollTop =$messages.scrollHeight
    }


}

socket.on('message',(message)=>{
    console.log(message)
    const html =Mustache.render(messagesTemplet,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})


socket.on('locationmessage',(url)=>{
    console.log(url)
    const html =Mustache.render(messagesLocation,{
        username:url.username,
        url: url.url,
        createdAt:moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('roomData',({room,users})=>{
    const html =Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})

$messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    //disappled
    $messageFormButton.setAttribute('disabled','disabled')

    const message =e.target.elements.messageDone.value
    socket.emit('sendMessage',message ,(eror)=>{

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value= ' '
        $messageFormInput.focus()
        if(eror){
            return console.log(eror)
        }
        console.log('delevered')
    })
})


//this the hard coded send location 

$sendlocationButton.addEventListener('click',(e)=>{
   $sendlocationButton.setAttribute('disabled','disabled')
   socket.emit('sendlocation' ,{long:29.995514,latit:31.148310 }  ,()=>{
    $sendlocationButton.removeAttribute('disabled')
   
   return console.log('locations delevered')
     } 
   )
})

//this the real send location 

// $sendlocationButton.addEventListener('click', () => {
//     if (!navigator.geolocation) {
//         return alert('Geolocation is not supported by your browser.')
//     }

//     $sendlocationButton.setAttribute('disabled', 'disabled')

//     navigator.geolocation.getCurrentPosition((position) => {
//         socket.emit('sendLocation', {
//             latit: position.coords.latitude,
//             long: position.coords.longitude
//         }, () => {
//             $sendlocationButton.removeAttribute('disabled')
//             console.log('Location shared!')  
//         })
//     })
// })



socket.emit('join',{username,room},(eror)=>{
    if(eror){
        alert(eror)
        location.href='/'
    }
})