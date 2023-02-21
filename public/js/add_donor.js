const old_donate_date = document.querySelector(".old_donate_date").style;
old_donate_date.display ="none";

const a = document.querySelector('input[value="yes"]');
a.addEventListener("click", () => {
    old_donate_date.display="block"
})

const b = document.querySelector('input[value="no"]');
b.addEventListener("click", () => {
    old_donate_date.display="none"

})




//hospital section make read only or writable through dynamic value
const program_location = document.querySelector('.program_location')
const options = document.querySelectorAll('.option');
console.log(program_location.innerHTML==='');
if(program_location.innerHTML===''){
    console.log("red");
}
else{
    console.log(options);
    options.forEach(opt => {
        opt.style.display="none"
        program_location.setAttribute("selected","")
        
    });
    


}