const verifyUser = require("./modules/verifyUser");

const userInfo = async () => {
  const user = await verifyUser();
  console.log(user);
  document.querySelector(
    "h1"
  ).textContent = `Welcome ${user.firstName} ${user.lastName}`;
};

userInfo();

const signOut = document.querySelector("#signOut");

signOut.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("emailUser");
  document.location.href = "http://localhost:1234/login.html";
});
