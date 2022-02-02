const axios = require("axios");

let rep = "";

const x = async (token) => {
  const options = {
    method: "get",
    url: "http://localhost:3001/profil",
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  try {
    rep = await axios.get(options);
  } catch (err) {
    console.log(err.message);
  }
  console.log(rep);
};
