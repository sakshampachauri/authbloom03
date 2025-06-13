import React, { useState, useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";

const App = () => {
  const [communityUrl, setCommunityUrl] = useState("");
  const [isTeamsReady, setIsTeamsReady] = useState(false);
  const [codeVerifier, setCodeVerifier] = useState("");
  const [token, setToken]= useState("")

  useEffect(() => {
    microsoftTeams.app.initialize().then(() => {
      setIsTeamsReady(true);
      console.log("running app")
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

//   const handleClick = async () => {
//     if (!isTeamsReady) return;
//     if (!communityUrl) {
//       alert("Please enter your community URL.");
//       return;
//     }

//     const verifier = base64URLEncode(crypto.getRandomValues(new Uint8Array(32)));
//     setCodeVerifier(verifier);
//     const challenge = base64URLEncode(await sha256(verifier));

//     const clientId = "Xd0YQo7MxmbM2CHDFHnFHsyjCqtmGS1SIaHNfT1tl0o";
//     const redirectUri = "https://authbloom03.onrender.com/auth-callback";

// //     const oauthUrl =  `https://persistent.bloomfire.bz/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=&state=${encodeURIComponent(
// //   communityUrl
// // )}&code_challenge=${challenge}&code_challenge_method=S256`;

// const oauthUrl = 'https://persistent.bloomfire.bz/oauth/authorize?client_id=Xd0YQo7MxmbM2CHDFHnFHsyjCqtmGS1SIaHNfT1tl0o&redirect_uri=https%3A%2F%2Fauthbloom03.onrender.com%2Fauth-callback&response_type=code&scope='
  
//      console.log("calling authentication",oauthUrl);
//     microsoftTeams.authentication.authenticate({
//       url: oauthUrl,
//       width: 600,
//       height: 535,
//       successCallback: (code) => {
//         console.log("inside success callBack")
//         fetch(`/exchange-token?code=${code}&verifier=${verifier}`)
//           .then(res => res.json())
//           .then(data => {
//             alert("Access Token: " + data.access_token);
//           }).catch(err => {
//             alert("Token exchange failed");
//             console.error(err);
//           });
//       },
//       failureCallback: (reason) => {
//         console.error("OAuth Failed:", reason);
//         alert("Sign in failed or was cancelled.");
//       }
//     });
//   };


const handleClick = async () => {
  if (!isTeamsReady) {
    alert("Microsoft Teams SDK is not ready yet.");
    return;
  }
  if (!communityUrl) {
    alert("Please enter your community URL.");
    return;
  }

  try {
    const verifier = base64URLEncode(crypto.getRandomValues(new Uint8Array(32)));
    setCodeVerifier(verifier);

    const challenge = base64URLEncode(await sha256(verifier));

    const clientId = "Xd0YQo7MxmbM2CHDFHnFHsyjCqtmGS1SIaHNfT1tl0o";
    const redirectUri = "https://authbloom03.onrender.com/auth-callback";

    const oauthUrl = `https://persistent.bloomfire.bz/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=&state=${encodeURIComponent(
      communityUrl
    )}&code_challenge=${challenge}&code_challenge_method=S256`;

    console.log("✅ OAuth URL:", oauthUrl);

    microsoftTeams.authentication.authenticate({
      url: oauthUrl,
      width: 600,
      height: 535,
      successCallback: async (code) => {
        try {
          console.log("✅ Auth success, exchanging token...");
          const res = await fetch(`/exchange-token?code=${code}&verifier=${verifier}`);
          const data = await res.json();
          if (data.access_token) {
            alert("✅ Access Token: " + data.access_token);
            setToken(data.access_token)
          } else {
            console.error("❌ Token exchange failed:", data);
            alert("Token exchange failed: " + (data.error_description || data.error));
          }
        } catch (err) {
          console.error("❌ Error during token fetch:", err);
          alert("Something went wrong during token exchange.");
        }
      },
      failureCallback: (reason) => {
        console.error("❌ OAuth Failed:", reason);
        alert("Sign in failed or was cancelled.");
      }
    });
  } catch (err) {
    console.error("❌ Unexpected error in handleClick:", err);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <div style={{ padding: 20 }}>
      <h2>Login with Bloomfire</h2>
      <input
        type="text"
        value={communityUrl}
        onChange={(e) => setCommunityUrl(e.target.value)}
        placeholder="Enter Community URL 20 time"
        style={{ width: "20%", padding: 10, margin: "auto" }}
      />
      <button onClick={handleClick} disabled={!isTeamsReady} style={{ padding: 10 }}>
        Login with Bloomfire
      </button>
      {token&& <p>{token}</p>}
    </div>
  );
};

export default App;

