function updatePwd(){
    let url = window.location.href
    console.log(url)
    let arr = url.split("?")
    let str = arr[1]
    let password = document.getElementById('pwd').value
    console.log(password)
    fetch('http://localhost:3000/resetpassword/'+str,{
        method: "PUT",
        headers:{
            "content-type" : "application/json",
        },
        body:JSON.stringify({password})
    })
    .then((res)=>{
        if(res.status==200){
            console.log('pwd updated')
            return res.json()
            
        }
    })
    
    
}