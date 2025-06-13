const express = require("express");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 10000;

const distDir = path.join(__dirname, "../client/dist");
app.use(express.static(distDir));

app.get("/health", (req, res) => {
  res.send("OK");
});

app.get("/auth-callback", (req, res) => {
  console.log("value of auth callback",res)
  const code = req.query.code;
  const state = req.query.state;

  res.send(`
    <script>
      window.opener.microsoftTeams.authentication.notifySuccess("${code}");
      window.close();
    </script>
  `);
});

app.get("/exchange-token", async (req, res) => {
  const code = req.query.code;
  const verifier = req.query.verifier;

  try {
    const tokenUrl = "https://internal.bloomfire.bs/oauth/token";
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://authbloom03.onrender.com/auth-callback",
        client_id: "Xd0YQo7MxmbM2CHDFHnFHsyjCqtmGS1SIaHNfT1tl0o",
        code_verifier: verifier
      })
    });

    const data = await tokenResponse.json();
    res.json(data);
  } catch (err) {
    console.error("Token exchange error", err);
    res.status(500).send("Token exchange failed");
  }
});

app.get("*", (req, res) => {
  const indexPath = path.join(distDir, "index.html");
  fs.access(indexPath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(503).send("React build not ready");
    } else {
      res.sendFile(indexPath);
    }
  });
});

app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
