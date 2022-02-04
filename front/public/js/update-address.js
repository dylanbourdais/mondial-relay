const axios = require("axios");

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  params = {};
  params.street = e.target.address.value;
  params.compl = e.target.address2.value;
  params.zip = e.target.zip.value;
  params.city = e.target.City.value;

  console.log(params);

  const options = {
    method: "post",
    url: "http://localhost:3001/user/updateAddress",
    data: { email: localStorage.getItem("emailUser"), address: params },
  };
  try {
    const rep = await axios(options);
    console.log(rep);
  } catch (err) {
    console.log(err.message);
  }
});
