const axios = require("axios");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const params = {
    email: [],
    pass: [],
  };
  params.firstName = e.target.firstName.value;
  params.lastName = e.target.lastName.value;
  params.email.push(e.target.mail.value);
  params.email.push(e.target.mailConfirm.value);
  params.pass.push(e.target.pass.value);
  params.pass.push(e.target.passConfirm.value);

  const newUser = {
    firstName: params.firstName,
    lastName: params.lastName,
    email: params.email[0],
    password: params.pass[0],
  };
  const options = {
    method: "post",
    url: "http://localhost:3001/register/",
    headers: {
      "Content-Type": "application/json",
    },
    data: newUser,
  };

  try {
    const rep = await axios(options);
    console.log("NewUser Send");
  } catch (err) {
    console.log(err.message);
  }
});
