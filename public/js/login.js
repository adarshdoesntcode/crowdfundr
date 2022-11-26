const loginForm = document.querySelector(".login-form");
const signupForm = document.querySelector(".register-form");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      alertMessageCall("success", "SignUp successful. You can now login!!");
    }
    setTimeout(() => {
      location.assign("/login");
    }, 2200);
  } catch (e) {
    if (e.response.data.status === "fail") {
      alertMessageCall("error", e.response.data.message);
    }
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.querySelector(".email").value;
  const password = document.querySelector(".password").value;

  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      alertMessageCall("success", "Login successful!!");
    }

    setTimeout(() => {
      location.assign("/");
    }, 2200);
  } catch (e) {
    if (e.response.data.status === "fail") {
      alertMessageCall("error", e.response.data.message);
    }
  }
});

$(".message a").click(function () {
  $("form").animate({ height: "toggle", opacity: "toggle" }, "slow");
});
