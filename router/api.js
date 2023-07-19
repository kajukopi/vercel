const express = require("express");
const router = express.Router();

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

const fs = require("fs");
const axios = require("axios");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/upload/tmp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

async function profile(profile, filePath) {
  const { sub, name, given_name, family_name, picture, email } = profile;

  // Download Picture
  const picturePath = `./public/img/users/${name}.jpg`;
  const response = await axios.get(picture, { responseType: "stream" });
  response.data.pipe(fs.createWriteStream(picturePath));
  return new Promise((resolve, reject) => {
    response.data.on("end", () => {
      resolve({ sub, name, given_name, family_name, picture, email });
    });
    response.data.on("error", (err) => {
      reject(err);
    });
  });
  // Save Data
}

const uploadFile = upload.fields([
  { name: "filewanita", maxCount: 1 },
  { name: "filepria", maxCount: 1 },
  { name: "galeri", maxCount: 8 },
]);

router.post("/upload/:id", uploadFile, (req, res) => {
  const file = {
    id: req.params.id,
    wanita: "img/upload/tmp/" + req.files["filewanita"][0].filename,
    pria: "img/upload/tmp/" + req.files["filepria"][0].filename,
    galeri: [],
  };
  req.files["galeri"].forEach((item) => {
    file.galeri.push("img/upload/tmp/" + item.filename);
  });
  console.log(Object.assign(req.body, file));
  res.json({ status: true, content: file });
});

router.post("/:ref", (req, res) => {
  const ref = req.params.ref;
  console.log(ref);
  res.json({ status: true, content: "" });
});

router.post("/page/signin", async (req, res) => {
  const { credential, clientId } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: clientId,
  });

  profile(ticket.getPayload())
    .then((payload) => {
      req.session.users = payload;
      res.json({ status: true, content: payload });
    })
    .catch((error) => {
      res.json({ status: false, content: error });
    });
});

module.exports = router;
