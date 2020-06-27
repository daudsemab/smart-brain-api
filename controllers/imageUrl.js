const Clarifai = require("clarifai");

const faceApp = new Clarifai.App({
  apiKey: "ebf0698a2da74baa8eb0d2532b745d0c",
});

const handleApiCall = (req, res) => {
  faceApp.models
    .predict(Clarifai.DEMOGRAPHICS_MODEL, req.body.url)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => res.status(400).json("unable to work with API"));
};

module.exports = {
  handleApiCall: handleApiCall,
};
