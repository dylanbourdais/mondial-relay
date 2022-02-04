const verifyUser = require("./modules/verifyUser");

const user = async () => {
  const user = await verifyUser();
  document.querySelector("#staticfirstName").value = user.firstName;
  document.querySelector("#staticLastname").value = user.lastName;
  document.querySelector("#staticEmail").value = user.email;

  if (user.address) {
    document.querySelector("#staticaddress").value = user.address.street;
    if (user.address.compl) {
      document.querySelector("#staticaddress2").value = user.address.compl;
    }
    document.querySelector("#staticZip").value = user.address.zip;
    document.querySelector("#staticCity").value = user.address.city;
  }
};
user();
