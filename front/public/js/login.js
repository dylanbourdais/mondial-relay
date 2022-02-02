const axios = require("axios");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const params = {};
  params.email = e.target.mail.value;
  params.pass = e.target.pass.value;

  console.log(params);
  let rep = "";

  try {
    const options = {
      method: "post",
      url: "http://localhost:3001/login",
      data: params,
    };
    rep = await axios(options);
    localStorage.setItem.token = rep.data.token;
  } catch (err) {
    console.log(err.message);
  }
  if (rep.status === 200) {
    console.log("connected");
    document.location.href = `http://localhost:1234/profil.html`;
  }
});
