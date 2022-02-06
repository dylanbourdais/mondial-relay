// on change la barre de navigation selon si l'utilisateur est connecté à son compte ou non

module.exports = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const login = document.querySelector("#loginProfil");
    login.href = "profil.html";
    login.textContent = "Profil";
    document.querySelector("#signUp").remove();
  }
};
