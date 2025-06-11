import React from "react";
const App = () => {
  const handleClick = () => {
    window.open("https://internal.bloomfire.bs/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=https://authbloom03.onrender.com/oauth/callback&response_type=code&scope=openid profile email", "_blank", "width=500,height=600");
  };
  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Welcome to AuthBloom03</h2>
      <button onClick={handleClick}>Login with Bloomfire</button>
    </div>
  );
};
export default App;
