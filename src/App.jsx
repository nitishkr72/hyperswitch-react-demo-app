import React, { useState, useEffect } from "react";
import { loadHyper } from "@juspay-tech/hyper-js";
import { Elements } from "@juspay-tech/react-hyper-js";

import CheckoutForm from "./CheckoutForm";
import "./App.css";

// use your hyperswitch publishable key here
const hyperPromise = loadHyper("publishable_key");

export default function App() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // fetch clientsecret form server using order details
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ product_id: "A113", }] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((_)=>{setClientSecret("error")});
  }, []);

  // background color to match sdk theme
  const backgroundColor = (theme) => {
    if (theme === "brutal") return "#ff00c533";
    else if (theme === "midnight") return "#1A1F36";
    else if (theme === "soft") return "#3E3E3E";
    else return "#ddd8d812";
  };

  const appearance = {
    theme: "default", // * Theme - default, soft, brutal, midnight, none, charcoal
  };

  document.body.style.background = backgroundColor(appearance.theme);

  const options = {
    clientSecret,
    appearance,
    loader:"auto"
  };

  return (
    <div className="App">
      { clientSecret &&clientSecret!="error"&& (
        <Elements options={options} stripe={hyperPromise}>
          <CheckoutForm />
        </Elements>
      )}{
      clientSecret=="error" && <div id="user-message">{"Please provide valid Api key in server.js and Publishable key in App.jsx"}</div>}
    </div>
  );
}
