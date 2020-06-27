const Clarifai = require("clarifai");

const faceApp = new Clarifai.App({
  apiKey: "ebf0698a2da74baa8eb0d2532b745d0c",
});

const handleUploadImage = (req, res, upload) => {
  upload(req, res, (err) => {
    if (err) {
    } else if (req.file === undefined) {
      res.status(400).json({ msg: "no image selected" });
    } else {
      faceApp.models
        .predict(
          Clarifai.DEMOGRAPHICS_MODEL,
          __dirname + `../public/uploads/${req.file.originalname}`
        )
        .then((response) => {
          res.send({
            imageName: req.file.originalname,
            msg: "clarifai success",
            data: response,
          });
        })
        .catch((err) =>
          res
            .status(400)
            .json({ imageName: req.file.originalname, msg: "clarifai failed" })
        );
    }
  });
};

module.exports = {
  handleUploadImage: handleUploadImage,
};
