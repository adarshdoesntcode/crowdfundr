const donationAmount = document.getElementById("donation-amount");
const donationName = document.getElementById("donation-name");
const donationMessage = document.getElementById("donation-message");
const donationCampaignTitle = document.querySelector(
  ".campaign-title-for-khalti"
);
const productIdentity = document.querySelector(".description-section");

let config;
let checkout;
let btn;

window.addEventListener("DOMContentLoaded", () => {
  config = {
    publicKey: "test_public_key_bc29bf31d1a94744906ae1f1518d66ab",
    productIdentity: productIdentity.dataset.id,
    productName: donationCampaignTitle.innerText,
    productUrl: window.location.href,
    paymentPreference: [
      "KHALTI",
      "EBANKING",
      "MOBILE_BANKING",
      "CONNECT_IPS",
      "SCT",
    ],
    eventHandler: {
      async onSuccess(payload) {
        // hit merchant api for initiating verfication
        console.log(payload);
        console.log(donationName.value, donationMessage.value);
        axios
          .post("http://127.0.0.1:3000/campaign/donate", {
            donarName: donationName.value,
            donarMessage: donationMessage.value,
            payload,
          })
          .then(function (response) {
            console.log(response);
            if (response.data.state.name === "Completed") {
              donationModal.classList.remove("donation-visible");
              donationModalContainer.classList.remove(
                "modal-conatainer-visible"
              );
              setTimeout(function () {
                confetti.start();
              });
              alertMessageCall("success", "Thank you for your Donation");
              setTimeout(function () {
                confetti.stop();
              }, 2000);
              setTimeout(function () {
                location.reload(true);
              }, 5500);
            }
          })
          .catch(function (error) {
            alertMessageCall("error", "Something went Wrong!!");
            console.log(error);
            // location.reload(true);
          });
      },
      onError(error) {
        alertMessageCall("error", "Something went Wrong!!");
        console.log(error);
        // location.reload(true);
      },
      onClose() {
        console.log("widget is closing");
        location.reload();
      },
    },
  };
  checkout = new KhaltiCheckout(config);
  btn = document.getElementById("payment-button");
  text = document.getElementById("donate-via-khalti");
  btn.onclick = function () {
    // minimum transaction amount must be 10, i.e 1000 in paisa.

    if (donationAmount.value) {
      text.style.visibility = "hidden";
      btn.classList.add("button-loading");
      checkout.show({ amount: donationAmount.value * 100 });
    } else {
      alertMessageCall("error", "Amount cannot be empty.");
    }
  };
});

// startConfetti();
