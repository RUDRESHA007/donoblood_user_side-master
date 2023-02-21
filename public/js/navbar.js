const bars = document.querySelector('.fa-bars')
const xmark = document.querySelector('.fa-xmark')
var navbar = document.querySelector('.navbar')
console.log(navbar);
bars.addEventListener('click',()=>{
    xmark.style.display='block';
    bars.style.display='none';
navbar.style.right='0px'
xmark.style.animation= "xmark .5s "

    
})
xmark.addEventListener('click',()=>{
    xmark.style.display='none';
    bars.style.display='block'
    navbar.style.right='-400px'


})