const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from client/dist
const distDir = path.join(__dirname, "../client/dist");
app.use(express.static(distDir));

// Health check (optional for Render)
app.get("/health", (req, res) => {
  res.send("OK");
});

// OAuth callback route
app.get("/oauth/callback", (req, res) => {
  res.send("<h2>✅ OAuth callback received. You can now implement token exchange here.</h2>");
});

// Catch-all to serve index.html (for React routes or Teams tab)
app.get("*", (req, res) => {
  const indexPath = path.join(distDir, "index.html");
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(503).send("⚠️ React build not ready. Try again shortly.");
    } else {
      res.sendFile(indexPath);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
