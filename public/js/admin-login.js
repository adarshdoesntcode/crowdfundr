

const loginButton = document.querySelector(".btn");
const emailInput = document.querySelector("#login-name");
const passwordInput = document.querySelector("#login-pass");


loginButton.addEventListener("click",async ()=>{
  const email = emailInput.value;
  const password =passwordInput.value;

  try{
    const res = await axios({
      method:"POST",
      url:"http://127.0.0.1:3000/admin/login",
      data:{
        email,
        password
      }
    })

  if(res.data.status === "success"){
    alertMessageCall("success","Login Successful !!")
    location.assign("/admin/adminPortal#dashboard")
  }

  }catch(e){
    alertMessageCall("error",e.response.data.message)
  }
})