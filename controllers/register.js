const handleRegister = (req, res, smartDb, bcrypt) => {
  const { name, email, password } = req.body;
  if (
    name.length < 3 ||
    email.includes("@") === false ||
    password.length === 0
  ) {
    res.status(400).json("registeration failed");
  } else {
    const hash = bcrypt.hashSync(password);
    smartDb
      .transaction((trx) => {
        trx
          .insert({
            email: email,
            hash: hash,
          })
          .into("login")
          .returning("email")

          .then((loginEmail) => {
            return trx
              .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date(),
              })
              .into("users")
              .returning("*")
              .then((user) => res.json(user[0]));
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch(() => res.status(400).json("registeration failed"));
  }
};

module.exports = {
  handleRegister: handleRegister,
};
