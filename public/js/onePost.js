const images =document.querySelectorAll(".item");
function setActive(ele){
     images.forEach((element)=>{
        element.classList.remove("active");
    })
    ele.classList.add("active"); 
    console.log(images);
}