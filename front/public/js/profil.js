const axios = require("axios");

let token = localStorage.getItem("token");
if (!token) {
  return (document.querySelector("body").innerHTML = `
  <h1>ERROR 403 FORBIDDEN</h1>
  `);
}
token = token.replace(/"/g, "");

const verifyUser = async (token) => {
  try {
    const options = {
      method: "post",
      url: "http://localhost:3001/profil",
      headers: {
        "x-auth-token": token,
      },
    };
    rep = await axios(options);
    console.log(rep.data);
  } catch (err) {
    console.log(err.message);
  }
};

verifyUser(token);

const signOut = document.querySelector("#signOut");

signOut.addEventListener("click", (e) => {
  localStorage.removeItem("token");
  document.location.href = "http://localhost:1234/login.html";
});
