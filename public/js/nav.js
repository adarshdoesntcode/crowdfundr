const loginButton = document.querySelector(".login-nav");
const logoutButton = document.querySelector(".logout-menu");
const profileButton = document.querySelector(".profile-menu");

const homeButton = document.querySelector(".logo");
const exploreButton = document.querySelector(".discover-nav");

const menuBarIcon = document.querySelector(".menu-bar-icon");
const dropdownMenu = document.querySelector(".dropdown-menu");

const logout = async ()=>{
  try{
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/users/logout",
    })
  if(res.data.status === 'success'){
    location.assign('/')
  }

  }catch(e){
    console.log(e);
    alertMessageCall('error', "Something went wrong !!")
  }


}

if(loginButton){
  loginButton.addEventListener("click", () => {
    location.assign("/login");
  });
};

if(menuBarIcon){
  menuBarIcon.addEventListener("click",()=>{
    if(dropdownMenu.classList.contains('show')){
      dropdownMenu.classList.remove('show');
    }else{
      dropdownMenu.classList.toggle('show');
    }
  })
};

if(logoutButton){
  logoutButton.addEventListener('click',logout);
}

if(profileButton){
  profileButton.addEventListener("click",()=>{
    location.assign("/users/profile?checked=profile");
  })
}


homeButton.addEventListener("click", () => {
  location.assign("/");
});

exploreButton.addEventListener("click", () => {
  location.assign("/explore?checked=all");
});

window.addEventListener("click",(e)=>{
if(dropdownMenu){
  if(e.target.classList.contains("menu-bar-icon") && dropdownMenu.classList.contains('show')){
    dropdownMenu.classList.add("show");
  }else{
    dropdownMenu.classList.remove("show");

  }
}

})
