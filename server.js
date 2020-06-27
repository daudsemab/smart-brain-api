const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const { handleRegister } = require("./controllers/register");
const { handleSignin } = require("./controllers/signin");
const { handleUploadImage } = require("./controllers/uploadImage");
const { handleEnteries } = require("./controllers/enteries");
const { handleApiCall } = require("./controllers/imageUrl");

const app = express();

const smartDb = knex({
  client: "pg",
  connection: {
    host: "postgresql-metric-10468",
    port: "4000",
    user: "postgres",
    password: "psqlpassword",
    database: "smartbrain",
  },
});

const PORT = process.env.PORT || 8000;

// --- CONST(S) FOR BROWSE OR UPLOAD FILE route = /upload/image --- STARTS

const storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
}).single("file");

// ---CONST(S) FOR BROWSE OR UPDATE FILE --- END


// --- MIDLEWARES STARTS

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("./public"));

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

app.post("/upload/image", (req, res) => handleUploadImage(req, res, upload));

app.get("/images/:name", (req, res) => {
  const { name } = req.params;
  res.sendFile(__dirname + `/public/uploads/${name}`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
