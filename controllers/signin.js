const handleSignin = (req, res, smartDb, bcrypt) => {
  const { email, password } = req.body;
  if (email.includes("@") === false || password.length === 0) {
    res.status(400).json("signin failed");
  } else {
    smartDb
      .transaction((trx) => {
        trx("login")
          .returning("hash, email")
          .where({
            email: email,
          })
          .then((login) => {
            const isRightUser = bcrypt.compareSync(password, login[0].hash);
            if (isRightUser) {
              return trx("users")
                .returning("*")
                .where({ email: login[0].email })
                .then((user) => {
                  res.json(user[0]);
                });
            } else {
              res.status(400).json("signin failed");
            }
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch(() => {
        res.status(400).json("signin failed");
      });
  }
};

module.exports = {
  handleSignin: handleSignin,
};
