const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/oauth/callback", (req, res) => {
  res.send("<h2>OAuth callback received. Implement token exchange here.</h2>");
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
app.listen(PORT, () => console.log("Server running on port", PORT));
