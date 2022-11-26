const cardsContainerAll = document.querySelector(".cards-container-all");
const cardsContainerPopular = document.querySelector(
  ".cards-container-popular"
);
const cardsContainerSearch = document.querySelector(".cards-container-search");

const searchField = document.querySelector(".search-field");
const searchForm = document.querySelector(".search-form");

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

const loadAllCards = async () => {
  let campaignCards;
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/campaigns",
    });
    campaignCards = res.data.data.campaigns
      .map((Campaign) => {
        return `
        <div data-aos="fade-up">
    <div class="card" data-id="${Campaign.campaign._id}" data-aos="fade-up">

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
    <span>${Campaign.campaign.campaignType}</span>
    </div>
    <div class="progress">
      <div class="progress-stats">
        <p>रू ${Campaign.donations.reduce(function (sum, current) {
          return sum + current.amount;
        }, 0)} raised</p>
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
    cardsContainerAll.innerHTML = campaignCards;
  } catch (e) {
    console.log(e);
  }

  addcardListenersAll();
};

const loadPopularCards = async () => {
  let campaignCards;
  try {
    const res = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/popularcampaigns",
    });
    console.log(res);
    campaignCards = res.data.data.campaigns
      .map((Campaign) => {
        return `
        <div data-aos="fade-up">
    <div class="card" data-id="${Campaign.campaign._id}" data-aos="fade-up">

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
    <span>${Campaign.campaign.campaignType}</span>
    </div>
    <div class="progress">
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
    cardsContainerPopular.innerHTML = campaignCards;
  } catch (e) {
    console.log(e);
  }

  addcardListenersPopular();
};

const loadSearchCards = async (keyword) => {
  let campaignCards;
  try {
    const res = await axios({
      method: "GET",
      url: `http://127.0.0.1:3000/searchcampaigns/${keyword}`,
    });
    console.log(res);
    campaignCards = res.data.data.campaigns
      .map((Campaign) => {
        return `
        <div data-aos="fade-up">
    <div class="card" data-id="${Campaign.campaign._id}" >

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
    <span>${Campaign.campaign.campaignType}</span>
    </div>
    <div class="progress">
      <div class="progress-stats">
        <p>रू ${Campaign.donations.reduce(function (sum, current) {
          return sum + current.amount;
        }, 0)} raised</p>
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
    cardsContainerSearch.innerHTML = campaignCards;
  } catch (e) {
    console.log(e);
  }

  addcardListenersSearch();
};

loadAllCards();
loadPopularCards();

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = searchField.value;
  loadSearchCards(keyword);
});

const addcardListenersAll = () => {
  const cards = cardsContainerAll.querySelectorAll(".card");
  if (cards) {
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        location.assign(`/campaigns/${id}`);
      });
    });
  }
};

const addcardListenersPopular = () => {
  const cards = cardsContainerPopular.querySelectorAll(".card");
  if (cards) {
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        location.assign(`/campaigns/${id}`);
      });
    });
  }
};

const addcardListenersSearch = () => {
  const cards = cardsContainerSearch.querySelectorAll(".card");
  if (cards) {
    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        location.assign(`/campaigns/${id}`);
      });
    });
  }
};
