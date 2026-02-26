const express = require("express");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

/* ---------- VERIFY TELEGRAM LOGIN ---------- */
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

/* ---------- HOME ---------- */
app.get("/", (req, res) => {
  res.send("Telegram Cloud Backend Running");
});

/* ---------- LOGIN PAGE ---------- */
app.get("/login", (req, res) => {
  res.send(`
  <html>
  <head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
  body{
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    background:linear-gradient(135deg,#0088cc,#004466);
    font-family:Arial;
    color:white;
    text-align:center;
  }
  .card{
    background:white;
    color:black;
    padding:30px;
    border-radius:15px;
  }
  </style>
  <script>
  function onTelegramAuth(user) {
      window.location.href = "/auth?" + new URLSearchParams(user).toString();
  }
  </script>
  </head>
  <body>
  <div class="card">
  <h2>Login with Telegram</h2>
  <script async src="https://telegram.org/js/telegram-widget.js?22"
          data-telegram-login="Sop_Cloud_bot"
          data-size="large"
          data-onauth="onTelegramAuth(user)"
          data-request-access="write">
  </script>
  </div>
  </body>
  </html>
  `);
});

/* ---------- AUTH VERIFY ---------- */
app.get("/auth", (req, res) => {
  const data = req.query;

  if (checkTelegramAuth(data)) {
    res.send(`
      <h2>Login Successful</h2>
      <p>You can now return to the app.</p>
    `);
  } else {
    res.status(403).send("Invalid login.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));});

app.get("/", (req, res) => {
  res.send("Telegram Cloud Backend Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started"));
