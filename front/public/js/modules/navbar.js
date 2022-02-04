module.exports = () => {
  let token = localStorage.getItem("token");
  if (token) {
    const login = document.querySelector("#loginProfil");
    login.href = "profil.html";
    login.textContent = "Profil";
    document.querySelector("#signUp").remove();
  }
};
