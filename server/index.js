const express = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch"); // npm install node-fetch@2

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from client/dist
const distDir = path.join(__dirname, "../client/dist");
app.use(express.static(distDir));

// Health check for Render
app.get("/health", (req, res) => {
  res.send("OK");
});

// OAuth callback: Token exchange with Bloomfire
app.get("/auth-callback", async (req, res) => {
  const code = req.query.code;
  const state = req.query.state;

  if (!code) {
    return res.status(400).send("Missing authorization code.");
  }

  const tokenUrl = "https://internal.bloomfire.bs/oauth/token";

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://authbloom03.onrender.com/auth-callback",
        client_id: "CqtmGS1SIaHNfT1tl0o",
        client_secret: "-U3yXp9CY"
      })
    });

    const data = await response.json();

    if (data.access_token) {
      // Send token back to Teams via JS
      res.send(`
        <script>
          window.opener.microsoftTeams.authentication.notifySuccess(${JSON.stringify(JSON.stringify(data))});
          window.close();
        </script>
      `);
    } else {
      res.send(`
        <script>
          window.opener.microsoftTeams.authentication.notifyFailure("Token error: ${data.error || 'unknown'}");
          window.close();
        </script>
      `);
    }
  } catch (error) {
    console.error("Token Exchange Error:", error);
    res.send(`
      <script>
        window.opener.microsoftTeams.authentication.notifyFailure("Server error");
        window.close();
      </script>
    `);
  }
});

// Serve index.html for React/Teams tab
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
