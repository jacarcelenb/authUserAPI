const express = require("express");
const app = express();
const cors = require("cors");

const admin = require("firebase-admin");

const serviceAccount = require("./secretKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 8000;

app.post("/users", async (req, res) => {
  const user = await admin.auth().getUserByEmail(req.body.email);
  const updateUser = await admin
    .auth()
    .updateUser(user.uid, {
      email: req.body.newemail,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      photoURL: user.photoURL,
      disabled: user.disabled,
    })
    .then((response) => {
      return response.email === user.email;
    })
    .catch((error) => {
      return error;
    });
  res.json({ updated: updateUser });
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
