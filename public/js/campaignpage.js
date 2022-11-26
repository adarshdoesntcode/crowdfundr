const backThisCampaign = document.querySelector(".back-campaign-button");
const donationModal = document.querySelector(".donation-modal");
const donationModalContainer = document.querySelector(".donation-modal-container");
const descriptionSection = document.querySelector(".description-section");
const donationContainer = document.querySelector(".render-donations");
const topContainer = document.querySelector(".top-donars-container");
const story = document.querySelector(".story");
const campaignStatus = document.querySelector("#camp-stat");
const urlButton = document.querySelector(".fa-link");

backThisCampaign.addEventListener("click", async () => {
  if (campaignStatus.innerText === "FUNDING") {
    try {
      const res = await axios({
        method: "GET",
        url: "http://127.0.0.1:3000/campaignform",
      });
      if (res.status === 200) {
        donationModalContainer.classList.add("modal-conatainer-visible");
        donationModal.classList.add("donation-visible");
      }
    } catch (e) {
      if (e.response.data.status === "fail") {
        alertMessageCall("error", "You must be Logged In !!");
      }
    }
  } else {
    alertMessageCall("error", "Campaign is not taking any donations !!");
  }
});

const renderSupporters = (donations) => {
  let transactions = donations.data.data.transaction;

  let suppporterHTML = transactions
    .map((transaction) => {
      let date = new Date(transaction.createdAt);
      return `                <div class="donation-card">
    <div class="message-sec">
      <p class="name">${transaction.name}</p>
      <div class="donate-date">${date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</div>
      <p class="message">${transaction.message}</p>

    </div>
    <div class="amount-sec"><p class="amount">रू ${transaction.amount.toLocaleString(
      "hi-IN"
    )}</p></div>
  </div>`;
    })
    .join(" ");
  donationContainer.innerHTML = suppporterHTML;
};

const renderTopSupporters = (donations) => {
  if (donations.data.data.transaction.length === 0) {
    return;
  }

  const sorted = donations.data.data.transaction.sort(
    (a, b) => b.amount - a.amount
  );

  let loop = 3;
  const newArray = [];

  if (sorted.length < 3) {
    loop = sorted.length;
  }

  for (let i = 0; i < loop; i++) {
    newArray[i] = sorted[i];
  }
  let count = 0;
  let topHTML = newArray
    .map((top) => {
      count++;
      return `
     <div class="${count}">
       <img src="/img/${count}.png">
       <div class="top-name">${top.name}</div>
       <div class="top-amount">रू ${top.amount.toLocaleString("hi-IN")}</div>
     </div>
    `;
    })
    .join(" ");

  topContainer.innerHTML =
    `<div class="head">Top Supporters 🏆</div>` + topHTML;
};

const formatStory = () => {
  let unformatted = story.innerText;
  story.innerHTML = unformatted;
};

const loadTransactions = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:3000/transactions/${descriptionSection.dataset.id}`,
    });
    renderSupporters(res);
    renderTopSupporters(res);
    formatStory();
  } catch (e) {
    console.log(e);
    alertMessageCall("error", "Could not load donations !");
  }
};

loadTransactions();

urlButton.addEventListener("click", () => {
  const url = window.location.href;
  console.log(url);
  navigator.clipboard.writeText(url);
  alertMessageCall("success", "Copied to clipboard!");
});

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const bar = document.querySelector(".progress-done");
    const width = bar.dataset.width;
    bar.style.width = width + "%";
  }, 500);
});

window.onclick = function (event) {
  if (event.target == donationModalContainer) {
    donationModal.classList.remove("donation-visible");
    donationModalContainer.classList.remove("modal-conatainer-visible");
  }
};
