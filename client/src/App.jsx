import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

const App = () => {
  const [communityUrl, setCommunityUrl] = useState("");
  const [isTeamsReady, setIsTeamsReady] = useState(false);
  const [codeVerifier, setCodeVerifier] = useState("");

  useEffect(() => {
    microsoftTeams.app.initialize().then(() => {
      setIsTeamsReady(true);
    }).catch(err => {
      console.error("Teams SDK failed to initialize", err);
    });
  }, []);

  const base64URLEncode = (str) => {
    return btoa(String.fromCharCode(...new Uint8Array(str)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await crypto.subtle.digest('SHA-256', data);
  };

  const handleClick = async () => {
    if (!isTeamsReady) return;
    if (!communityUrl) {
      alert("Please enter your community URL.");
      return;
    }

    const verifier = base64URLEncode(crypto.getRandomValues(new Uint8Array(32)));
    setCodeVerifier(verifier);
    const challenge = base64URLEncode(await sha256(verifier));

    const clientId = "Xd0YQo7MxmbM2CHDFHnFHsyjCqtmGS1SIaHNfT1tl0o";
    const redirectUri = "https://authbloom03.onrender.com/auth-callback";

    const oauthUrl = `https://persistent.bloomfire.bz/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=`;

    microsoftTeams.authentication.authenticate({
      url: oauthUrl,
      width: 600,
      height: 535,
      successCallback: (code) => {
        fetch(`/exchange-token?code=${code}&verifier=${verifier}`)
          .then(res => res.json())
          .then(data => {
            alert("Access Token: " + data.access_token);
          }).catch(err => {
            alert("Token exchange failed");
            console.error(err);
          });
      },
      failureCallback: (reason) => {
        console.error("OAuth Failed:", reason);
        alert("Sign in failed or was cancelled.");
      }
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login with Bloomfire</h2>
      <input
        type="text"
        value={communityUrl}
        onChange={(e) => setCommunityUrl(e.target.value)}
        placeholder="Enter Community URL"
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />
      <button onClick={handleClick} disabled={!isTeamsReady} style={{ padding: 10 }}>
        Login with Bloomfire
      </button>
    </div>
  );
};

export default App;

