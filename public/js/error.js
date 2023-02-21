const message = document.querySelector('.success')
console.log(message.children[0].innerHTML.length);
if(message.children[0].innerHTML.length<60){
    message.style.display='none'
}
else{
 
    message.style.display='block'
    setInterval(() => {
        message.style.display='none'

    }, 3000);
}
