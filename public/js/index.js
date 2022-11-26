const startCampaignButton = document.querySelector("#start-campaign");
const cardsContainer = document.querySelector(".cards-container");

const campaignsBacked = document.querySelector("#caba");
const moneyRaised = document.querySelector("#mora");
const peopleContributed = document.querySelector("#peco");

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

startCampaignButton.addEventListener("click", async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/campaignform",
    });
    if (res) {
      location.assign("/campaignform");
    }
  } catch (e) {
    if (e.response.data.status === "fail") {
      alertMessageCall("error", "You must be Logged In !!");
    }
    setTimeout(() => {
      location.assign("/login");
    }, 2200);
  }
});

const loadPopularCards = async () => {
  let campaignCards;
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/popularcampaigns?limit=5",
    });
    campaignCards = res.data.data.campaigns
      .map((Campaign) => {
        return `
        <div data-aos="fade-left">
    <div class="card" data-id="${Campaign.campaign._id}">

    <div class="card-image">
      <img
        src="${Campaign.campaign.campaignImage}"
      />
    </div>

    <div class="card-title">
      <p class="card-title-status">FUNDING</p>
      <p class="card-title-title">${Campaign.campaign.campaignTitle}</p>
    </div>
    <div class="card-description">
    ${Campaign.campaign.description}
    </div>


    <div class="progress">
    <span>${Campaign.campaign.campaignType}</span>

      <div class="progress-stats">
        <p>रू ${Campaign.donations
          .reduce(function (sum, current) {
            return sum + current.amount;
          }, 0)
          .toLocaleString("hi-IN")} raised</p>
        <p>${Math.round(
          (Campaign.donations.reduce(function (sum, current) {
            return sum + current.amount;
          }, 0) /
            Campaign.campaign.goalAmount) *
            100
        )}%</p>
      </div>
      <div class="progress-bar" style="width: ${
        Math.round(
          (Campaign.donations.reduce(function (sum, current) {
            return sum + current.amount;
          }, 0) /
            Campaign.campaign.goalAmount) *
            100
        ) <= 100
          ? Math.round(
              (Campaign.donations.reduce(function (sum, current) {
                return sum + current.amount;
              }, 0) /
                Campaign.campaign.goalAmount) *
                100
            )
          : 100
      }%"></div>
      <div class="days-left">⏰ ${getDateDifference(
        Campaign.campaign.campaignDuration
      )} days left</div>
    </div>

  </div>
  </div>
    `;
      })
      .join(" ");
    cardsContainer.innerHTML =
      campaignCards +
      `<div class="all-campaigns-container">
  <div class="all-campaigns">all.</div>
</div>`;
  } catch (e) {
    console.log(e);
  }

  addcardListeners();
};

const loadAchievements = async () => {
  const res = await axios({
    method: "GET",
    url: "http://127.0.0.1:3000/achievements",
  });

  const data = res.data.data;

  peopleContributed.innerHTML = data.peopleContributed;
  campaignsBacked.innerHTML = data.campaignsBacked;
  moneyRaised.innerHTML = "रू " + data.totalSum.toLocaleString("hi-IN");
};

loadPopularCards();
loadAchievements();

const addcardListeners = () => {
  const cards = cardsContainer.querySelectorAll(".card");
  if (cards) {
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        location.assign(`/campaigns/${id}`);
      });
    });
  }
  const allCampaignsButton = document.querySelector(".all-campaigns");

  allCampaignsButton.addEventListener("click", () => {
    location.assign("/explore?checked=popular");
  });
};
