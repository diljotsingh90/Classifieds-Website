async function toggleFav(csrf,postId,e){
    console.log(postId);
   const result =await fetch("/addFavorite",{
        method:"POST",
        headers:{
            "Content-Type": "application/JSON",
        },
        body:JSON.stringify({
            postId:postId,
            _csrf:csrf
        })
    })
    
     e.classList.toggle("isfav"); 
}