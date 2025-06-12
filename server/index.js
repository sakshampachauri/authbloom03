const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;

const distDir = path.join(__dirname, "../client/dist");
app.use(express.static(distDir));

app.get("/oauth/callback", (req, res) => {
  res.send("<h2>OAuth callback received. Implement token exchange here.</h2>");
});

app.get("*", (req, res) => {
  const indexPath = path.join(distDir, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send("Build not ready. Please try again shortly.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
