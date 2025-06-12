import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

const App = () => {
  const [communityUrl, setCommunityUrl] = useState("");
  const [isTeamsReady, setIsTeamsReady] = useState(false);

  useEffect(() => {
    microsoftTeams.app
      .initialize()
      .then(() => {
        console.log("✅ Microsoft Teams SDK initialized");
        setIsTeamsReady(true);
      })
      .catch((err) => {
        console.error("❌ Failed to initialize Teams SDK:", err);
        alert("Failed to initialize Microsoft Teams SDK");
      });
  }, []);

  const handleClick = () => {
    if (!isTeamsReady) {
      alert("Please wait, Microsoft Teams SDK is initializing...");
      return;
    }

    if (!communityUrl) {
      alert("Please enter your community URL.");
      return;
    }

    const clientId = "Xd0YQo7MxmbM2CHDFHnFHsyjCqtmGS1SIaHNfT1tl0o";
    const redirectUri = "https://authbloom03.onrender.com/auth-callback";

    const oauthUrl = `https://internal.bloomfire.bs/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=openid profile email&state=${encodeURIComponent(
      communityUrl
    )}`;

    microsoftTeams.authentication.authenticate({
      url: oauthUrl,
      width: 600,
      height: 535,
      successCallback: (result) => {
        console.log("✅ OAuth Success:", result);
        alert("Signed in successfully!");
      },
      failureCallback: (reason) => {
        console.error("❌ OAuth Failed:", reason);
        alert("Sign in failed or was cancelled.");
      },
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Welcome to AuthBloom03</h2>
      <input
        type="text"
        placeholder="Enter Community URL"
        value={communityUrl}
        onChange={(e) => setCommunityUrl(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />
      <button
        onClick={handleClick}
        style={{ padding: "10px 20px" }}
        disabled={!isTeamsReady}
      >
        Login with Bloomfire
      </button>
    </div>
  );
};

export default App;
