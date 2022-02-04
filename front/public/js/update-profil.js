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

  if (params.email[0] !== params.email[1]) {
    return console.log("email invalide");
  }
  if (params.pass[0] !== params.pass[1]) {
    return console.log("password invalide");
  }

  params.email.pop();
  params.email = params.email.toString();
  params.pass.pop();
  params.pass = params.pass.toString();

  const options = {
    method: "post",
    url: "http://localhost:3000/user/updateProfil",
    data: { email: localStorage.getItem("emailUser"), user: params },
  };
  try {
    const rep = await axios(options);
    if (rep.data.email) {
      localStorage.setItem("emailUser", rep.data.email);
    }
  } catch (err) {
    console.log(err.message);
  }
});
