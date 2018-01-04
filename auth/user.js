const Users = [
  {
    email: "fenn@fewlines.co",
    name: "Vincent Billey",
    id: 1
  },
  {
    id: "1395068040549027",
    name: "Vincent Billey",
    email: "vincent.billey@gmail.com"
  }
];

const findUser = function(email, password) {
  return new Promise((resolve, reject) => {
    if (email === Users[0].email && password === "1234") {
      return resolve(Users[0]);
    }
    return reject("No user found");
  });
};

const findUserByEmail = function(email) {
  return new Promise((resolve, reject) => {
    if (email === Users[0].email) {
      return resolve(User);
    }
    return reject("No user found");
  });
};

const findUserById = function(id) {
  return new Promise((resolve, reject) => {
    const user = Users.find(user => user.id === id);
    if (user) {
      return resolve(user);
    }
    return reject("No user found");
  });
};

module.exports = {
  findUser,
  findUserByEmail,
  findUserById
};
