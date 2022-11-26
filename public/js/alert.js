const alertBox = document.querySelector(".alert-box");

const alertMessageCall = (status, message) => {
  alertBox.textContent = message;
  alertBox.className = "alert-box alert--visible";

  if (status) {
    alertBox.classList.add(`alert--${status}`);
  }

  setTimeout(() => {
    alertBox.classList.remove("alert--visible");
  }, 2000);
};
