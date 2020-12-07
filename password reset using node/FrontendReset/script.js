var url = 'http://localhost:3000'

function resetPassword(){
    document.getElementById('box-1').style.display="none"
    document.getElementById('box-2').style.display="block"

}
let closeBox=()=>{
    document.getElementById('box-1').style.display="block"
    document.getElementById('box-2').style.display="none"
}
let verifyEmail = () =>{
    let email = document.getElementById('email').value
    fetch(url+'/forgot-password',{
        method:'POST',
        headers:{
            'content-type' : 'application/json'
        },
        body: JSON.stringify({
            email
        })
    })
    .then(response=>{
        return response.json()
    })
    .then((result)=>{
        alert(result.message)
    })
}