const express = require("express");
const router = express.Router();
const db = require("../db");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

const fs = require("fs");
const axios = require("axios");
const sharp = require("sharp");

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

router.post("/upload/:id", uploadFile, async (req, res) => {
  const file = {
    id: req.params.id,
    wanita: "img/upload/" + req.files["filewanita"][0].filename,
    pria: "img/upload/" + req.files["filepria"][0].filename,
    galeri: [],
  };
  req.files["galeri"].forEach(async (item) => {
    const galeri = await sharp(item.path)
      .resize(800)
      .toFile("public/img/upload/" + item.filename);
    fs.unlink("public/img/upload/tmp/" + item.filename, (error) => {
      if (error) {
        console.error("Error deleting file:", error);
      } else {
        console.log("File deleted successfully");
      }
    });
    file.galeri.push("img/upload/" + item.filename);
  });
  const wanita = await sharp(req.files["filewanita"][0].path)
    .resize(800)
    .toFile("public/img/upload/" + req.files["filewanita"][0].filename);
  fs.unlink("public/img/upload/tmp/" + req.files["filewanita"][0].filename, (error) => {
    if (error) {
      console.error("Error deleting file:", error);
    } else {
      console.log("File deleted successfully");
    }
  });
  const pria = await sharp(req.files["filepria"][0].path)
    .resize(800)
    .toFile("public/img/upload/" + req.files["filepria"][0].filename);
  fs.unlink("public/img/upload/tmp/" + req.files["filepria"][0].filename, (error) => {
    if (error) {
      console.error("Error deleting file:", error);
    } else {
      console.log("File deleted successfully");
    }
  });
  // console.log(Object.assign(req.body, file));
  db.ref("pernikahan").post(Object.assign(req.body, file));
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
