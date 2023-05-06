const express = require("express");
const { users } = require("../data/users.json");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    data: users,
  });
});

router.post("/", async (req, res) => {
  let user = await req.body;
  console.log(user);
  const user_present = users.find((item) => item.id === user.id);
  if (user_present) {
    res.status(404).json({
      success: false,
      message: "user already exists",
    });
  } else {
    users.push(user);
    res.status(201).json({
      success: true,
      message: "user added succesfully",
    });
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    res.status(404).json({
      success: false,
      message: "user not found",
    });
  } else {
    res.status(200).json({
      success: true,
      message: user,
    });
  }
});

router.put("/:id", (req, res) => {
  let { id } = req.params;
  const user_updated = users.find((item) => item.id === id);
  if (user_updated) {
    let body = req.body;
    for (let key in body) {
      for (let keys in user_updated) {
        if (key === keys) {
          user_updated[keys] = body[key];
        }
      }
    }
    res.status(200).json({
      success: true,
      message: "user updated succesfully",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
});

router.delete("/:id", (req, res) => {
  let { id } = req.params;
  const user_deleted = users.find((item) => item.id === id);
  if (user_deleted) {
    const user_index = users.indexOf(user_deleted);
    users.splice(user_index, 1);
    res.status(200).json({
      success: true,
      message: "user deleted succesfully",
    });
  } else {
    res.status(404).json({
      success: false,
      message: "user not found",
    });
  }
});

router.get("/subscription-details/:id", (req, res) => {
  const { id } = req.params;

  const user = users.find((user) => user.id === id);

  if (!user) {
    res.status(404).json({                    
      success: false,
      message: "user not found"
    });
  }
  
  const dateInDays = (data = "") => {
    let date;
    if (data === "") {
      date = new Date();
    } else {
      date = new Date(data);
    }
    // console.log(date);
    let days = Math.floor(date / (1000 * 60 * 60 * 24));
    return days;
  }
  // console.log(dateInDays("01/10/2021"));

  const subscriptionType = (date) => {
    if (user.subscriptionType === "Basic") {
      date += 90;
    } else if (user.subscriptionType === "Standard") {
      date += 180;
    } else if (user.subscriptionType === "Premium") {
      date += 365;
    }
    return date;
  }  

  const return_date = dateInDays(user.returnDate);
  const current_date = dateInDays();
  const subscription_date = dateInDays(user.subscriptionDate);
  const subscription_expiry = subscriptionType(subscription_date);

  console.log(subscription_expiry);
  console.log(current_date);
  const data = {
    ...user,
    subscriptionExpired:
      subscription_expiry < current_date,
    daysleftForExpiry:
      subscription_expiry <= current_date
        ? 0
        : subscription_expiry - current_date,
    fine:
      return_date < current_date
        ? subscription_expiry < current_date
          ? 200
          : 100
        : 0,
  }
  res.status(200).json({
    success: true,
    data 
  });
});

module.exports = router;