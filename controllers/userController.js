const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");


exports.profilePage = async (req, res) => {
  const flag = req.query.checked;
  let config ={
    profile : "checked",
    campaign : "",
    donation: ""
  };

  if(flag == "profile"){
    config = {
      profile : "checked",
      campaign : "",
      donation: ""
    };
    return res.render("profile" , config);
  } 

  if(flag == "campaign"){
    config = {
      profile : "",
      campaign : "checked",
      donation: ""
    };

    return res.render("profile" , config);
  }

 res.render("profile" , config);
  
};


//******For Users*****
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "This route is not in used",
    },
  });
};

exports.createUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "This route is not in used",
    },
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "This route is not in used",
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      message: "This route is not in used",
    },
  });
};
