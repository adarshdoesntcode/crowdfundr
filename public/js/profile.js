const tableBody = document.querySelector(".donation-table-body");
const myCampaignsContainer = document.querySelector(".my-campaigns-container");

const donationModal = document.querySelector(".donation-modal");
const donationModalContainer = document.querySelector(
  ".donation-modal-container"
);

const namePr = document.querySelector(".name-span");
const emailPr = document.querySelector(".email-span");
const ch = document.querySelector(".ch-span");
const ac = document.querySelector(".ac-span");
const tb = document.querySelector(".tb-span");
const tmr = document.querySelector(".tmr-span");
const ab = document.querySelector(".ab-span");
const ca = document.querySelector(".ca-span");
const wof = document.querySelector(".wof-span");

const getDateDifference = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  // console.log(end, today , end.getTi() - today.getDate());
  const diffTime = end.getTime() - today.getTime();

  if (Math.ceil(diffTime / (1000 * 3600 * 24)) <= 0) {
    return 0;
  } else {
    return Math.ceil(diffTime / (1000 * 3600 * 24));
  }
};

const addEndRoute = async (target) => {
  const res = await axios({
    method: "PATCH",
    url: `http://127.0.0.1:3000/campaigns/${target.dataset.id}`,
  });

  if (res.data.status === "fail") {
    alertMessageCall("error", "Campaign has already finishied!!");
  }
  if (res.data.status === "success") {
    alertMessageCall("success", "Campaign ended successfully!!");
    setTimeout(() => {
      location.assign("/users/profile?checked=campaign")
    }, 2500);
  }
};

const addButtonListeners = () => {
  const endCampaignButton =
    myCampaignsContainer.querySelectorAll(".end-button");
  endCampaignButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      const target = e.target.parentNode.parentNode;
      const status = target.querySelector(".status").textContent;

      if (status === "COMPLETE" || status === "ENDED") {
        alertMessageCall("error", "Campaign has already finishied!!");
      } else {
        if (confirm("You are about to end this campaign.")) {
          addEndRoute(e.target);
        }
      }
    });
  });
  const withdrawCampaignButton =
    myCampaignsContainer.querySelectorAll(".withdraw-button");
  withdrawCampaignButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const target = e.target.parentNode.parentNode;

      const status = target.querySelector(".status").textContent;
      const raised = target
        .querySelector(".total-raised-para")
        .textContent.slice(12);
      const type = target.querySelector(".start-date").textContent;
      const wstatus = target.querySelector(".wstatus").innerHTML.slice(11);

      if (wstatus === '<i class="fas fa-check-circle"></i>') {
        return alertMessageCall("error", "Already Withdrawn!!");
      }

      if (status === "FUNDING" || status === "UNVERIFIED") {
        return alertMessageCall("error", "You cannot withdraw yet!!");
      } else {
        const green = document.querySelector("#green");
        const red = document.querySelector("#red");
        const blue = document.querySelector("#blue");

        green.textContent = "रू. " + (raised*1).toFixed(2);
        if (type === "Individual") {
          red.textContent = "रू. " + (0.2 * raised).toFixed(2);
        } else {
          red.textContent = "रू. " + 0;
        }

        blue.textContent =
          "रू. " + ((parseFloat(raised) - parseFloat(red.textContent.slice(3)))).toFixed(2);

        donationModalContainer.classList.add("modal-conatainer-visible");
        donationModal.classList.add("donation-visible");

        document
          .getElementById("payment-button")
          .addEventListener("click", async () => {

            const data = blue.textContent.slice(4);
            document
          .getElementById("withdraw-text").style.visibility ="hidden";
            document
          .getElementById("payment-button").classList.add("button-loading");
            const res = await axios({
              method: "POST",
              url: `http://127.0.0.1:3000/withdraw/${id}`,
              data: {
                withdrawn: data,
                total: raised,
                type,
                commission: (type === 'Individual')? (raised*0.2).toFixed(2) : 0.00
              },
            });
            if (res.data.status === "success") {
              alertMessageCall("success", "Withdraw Successful!!");
              setTimeout(() => {
                location.assign("/users/profile?checked=campaign")
              }, 2500);
            } else {
              alertMessageCall("error", "Something went wrong! try again");
            }
          });
      }
    });
  });
};

const addcampaignListeners = () => {
  const campaigns = myCampaignsContainer.querySelectorAll(
    ".campaign-info-section"
  );
  if (campaigns) {
    campaigns.forEach((campaign) => {
      campaign.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        location.assign(`/campaigns/${id}`);
      });
    });
  }
  addButtonListeners();
};

const loadDonations = async () => {
  const res = await axios({
    method: "GET",
    url: "http://127.0.0.1:3000/transactionsDetails",
  });

  let transactionHTML = res.data.data.userTransactionDetailsWithTitle
    .map((transaction) => {
      let date = new Date(transaction.transaction.createdAt);
      return `               
      <tr>
      <td>${transaction.title}</td>
      <td>${date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}</td>
      <td>रू ${transaction.transaction.amount.toLocaleString("hi-IN")}</td>
      <td>Complete</td>
    </tr>

  `;
    })
    .join(" ");
  tableBody.innerHTML = transactionHTML;

  // console.log(res);
};

const loadProfile = async () => {
  const res = await axios({
    method: "GET",
    url: "http://127.0.0.1:3000/users/profileDetails",
  });
  const data = res.data.data;
  // console.log(data);
  namePr.textContent = data.name;
  emailPr.textContent = data.email;
  tb.textContent = data.campaignTransactionDetails.donations.length;
  tmr.textContent = "रू. " + (data.campaignTransactionDetails.donationSum*1).toFixed(2);
  ab.textContent = "रू. " + (data.availableBalance*1).toFixed(2);
  ca.textContent = "रू. " + (data.ChargeFromIndiviualCampaign*1).toFixed(2);
  wof.textContent = "रू. " + (data.withdrawnSum*1).toFixed(2);
};

const loadProfileCampaigns = async () => {
  const res = await axios({
    method: "GET",
    url: "http://127.0.0.1:3000/profileCampaigns",
  });

  const data = res.data.data.campaignDetails;
  ch.textContent = data.length;
  let count = 0;
  let campaignsHTML = data
    .map((campaign) => {
      let date = new Date(campaign.campaign.createdAt);
      if (campaign.campaign.campaignStatus === "FUNDING") {
        count++;
      }
      return `               
    <div class="my-campaign ${campaign.campaign.campaignStatus}" >
    <div class="campaign-info-section" data-id="${campaign.campaign._id}">
      <div class="campaign-status"><p class="campaign-title-para">${
        campaign.campaign.campaignTitle
      }</p><p class="start-date">${campaign.campaign.campaignType}</p></div>
      <div class="campaign-title"><p class="status">${
        campaign.campaign.campaignStatus
      }</p> <p class="wstatus">Withdrawn: ${
        campaign.campaign.withdrawn
          ? '<i class="fas fa-check-circle"></i>'
          : '<i class="fas fa-times"></i>'
      }</p> <p class="days-left">${getDateDifference(
        campaign.campaign.campaignDuration
      )} days left</p></div>
      <div class="total-raised"> <div class="goal-amount">Goal: रू. ${
        campaign.campaign.goalAmount
      }</div><p class="total-raised-para">Raised: रू. ${campaign.donations.reduce(
        (accumulator, value) => {
          return accumulator + value;
        },
        0
      )}</p><p class="total-number-backers">${
        campaign.donations.length
      } Backers</p></div>
    </div>
    <div class="campaign-button-section">
      <div class="withdraw-button" data-id="${
        campaign.campaign._id
      }">Withdraw</div>
      <div class="end-button" data-id="${campaign.campaign._id}">End</div>
    </div>
  </div>
  `;
    })
    .join(" ");
  ac.textContent = count;
  myCampaignsContainer.innerHTML = campaignsHTML;
  addcampaignListeners();
};

loadProfileCampaigns();
loadDonations();
loadProfile();

window.onclick = function (event) {
  if (event.target == donationModalContainer) {
    donationModal.classList.remove("donation-visible");
    donationModalContainer.classList.remove("modal-conatainer-visible");
  }
};
