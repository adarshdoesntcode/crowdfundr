const campaignForm = document.querySelector("#campaign-form");
const acceptTerm = document.querySelector(".terms-accept");
const declineTerm = document.querySelector(".terms-decline");

document.querySelector(".terms").style.display = "block";

campaignForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const campaignTitle = document.getElementById("campaignTitle").value;
  const description = document.getElementById("description").value;
  const campaignDuration = document.getElementById("campaignDuration").value;
  const campaignType = document.getElementById("campaignType").value;
  const goalAmount = document.getElementById("goalAmount").value;
  const campaignImage = document.getElementById("campaignImage").value;
  const campaignAddress = document.getElementById("campaignAddress").value;
  const reasonBehindCampaign = document.getElementById("reasonBehindCampaign").value;
  const contactEmail = document.getElementById("contactEmail").value;
  const organizerName = document.getElementById("organizerName").value;
  const contactNumber = document.getElementById("contactNumber").value;
  const socialMediaLink = document.getElementById("socialMediaLink").value;

  document.querySelector(".btnText").style.visibility = "hidden";

  document.querySelector(".nextBtn").classList.add("button-loading");

  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/campaigns",
      data: {
        campaignTitle,
        description,
        campaignDuration,
        campaignType,
        goalAmount,
        campaignImage,
        campaignAddress,
        reasonBehindCampaign,
        contactEmail,
        organizerName,
        contactNumber,
        socialMediaLink,
      },
    });

    setTimeout(() => {
      if (res.data.status === "success") {
        alertMessageCall("success", "Campaign submitted for verification ✅");
      }
      campaignForm.reset();
      document.querySelector(".btnText").style.visibility = "visible";
      document.querySelector(".nextBtn").classList.remove("button-loading");
      setTimeout(() => {
        location.assign("/users/profile?checked=campaign");
      }, 2500);
    }, 2000);
  } catch (e) {
    // alertMessageCall("error", e);
    alertMessageCall("error", "Something went wrong");
    document.querySelector(".btnText").style.visibility = "visible";
    document.querySelector(".nextBtn").classList.remove("button-loading");
  }
});

acceptTerm.addEventListener("click", () => {
  document.querySelector(".terms").style.display = "none";
});

declineTerm.addEventListener("click", () => {
  location.assign("/");
});
