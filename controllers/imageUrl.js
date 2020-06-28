const handleApiCall = (req, res, faceApp) => {
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
