async function toggleFav(postId,e){
    console.log(postId);
   const result =await fetch("/addFavorite",{
        method:"POST",
        headers:{
            "Content-Type": "application/JSON",
        },
        body:JSON.stringify({
            postId:postId
        })
    })
    
     e.classList.toggle("isfav"); 
}