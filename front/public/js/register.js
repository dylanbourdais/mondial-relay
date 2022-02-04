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
  } else if (params.pass[0] !== params.pass[1]) {
    return console.log("password invalide");
  } else {
    const newUser = {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email[0],
      password: params.pass[0],
    };
    const options = {
      method: "post",
      url: "http://localhost:3000/user/register/",
      headers: {
        "Content-Type": "application/json",
      },
      data: newUser,
    };

    try {
      const rep = await axios(options);
      console.log(rep);
      localStorage.setItem("token", rep.data.token);
      localStorage.setItem("emailUser", rep.data.emailUser);
      document.location.href = "profil.html";
    } catch (err) {
      console.log(err.message);
    }
  }
});
