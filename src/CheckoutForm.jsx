import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useHyper,
  useWidgets,
} from "@juspay-tech/react-hyper-js";

export default function CheckoutForm() {
  const hyper = useHyper();
  const elements = useWidgets();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!hyper) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    hyper.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [hyper]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hyper || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await hyper.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000",
      },
    });

    if (error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
    wallets: {
      walletReturnUrl: "http://localhost:3000/complete",
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !hyper || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
