// const handleApiCall =
// };

const handleEnteries = (req, res, smartDb) => {
  const { email } = req.body;
  smartDb("users")
    .where({ email: email })
    .returning("*")
    .increment("enteries", 1)
    .then((user) => {
      res.json(user[0]);
    })
    .catch(() => res.status(400));
};

module.exports = {
  handleEnteries: handleEnteries,
};
