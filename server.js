const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const { handleRegister } = require("./controllers/register");
const { handleSignin } = require("./controllers/signin");
const { handleEnteries } = require("./controllers/enteries");
const { handleApiCall } = require("./controllers/imageUrl");

const app = express();


const smartDb = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  },
});

const PORT = process.env.PORT || 8000;


// --- MIDLEWARES STARTS

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// --- MIDLEWARES ENDS


app.get('/', (req, res) => res.send("it is working."))


// ---REGISTER

app.post("/register", (req, res) => handleRegister(req, res, smartDb, bcrypt));

// ---SIGNIN

app.post("/signin", (req, res) => handleSignin(req, res, smartDb, bcrypt));

// ---HADLE IMAGE URL

app.post("/handleUrl", (req, res) => handleApiCall(req, res));

// ---UPDATE USER ENTERIES

app.put("/entry", (req, res) => handleEnteries(req, res, smartDb));

// ---SERVER DEALS WITH CHOSE FILE


app.get("/images/:name", (req, res) => {
  const { name } = req.params;
  res.sendFile(__dirname + `./public/uploads/${name}`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
