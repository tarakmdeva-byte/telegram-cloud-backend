const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

function checkTelegramAuth(data) {
  const secret = crypto.createHash("sha256")
                       .update(BOT_TOKEN)
                       .digest();

  const checkString = Object.keys(data)
    .filter(key => key !== "hash")
    .sort()
    .map(key => `${key}=${data[key]}`)
    .join("\n");

  const hmac = crypto.createHmac("sha256", secret)
                     .update(checkString)
                     .digest("hex");

  return hmac === data.hash;
}

app.post("/auth", (req, res) => {
  const data = req.body;

  if (checkTelegramAuth(data)) {
    res.send("Login successful!");
  } else {
    res.status(403).send("Invalid login.");
  }
});

app.get("/", (req, res) => {
  res.send("Telegram Cloud Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));
