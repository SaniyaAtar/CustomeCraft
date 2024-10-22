import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { CREATE_ORDER, CREATE_UPI_ORDER } from "../utils/constants";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../components/CheckoutForm";
import { useRouter } from "next/router";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
<<<<<<< HEAD
=======

>>>>>>> origin/main

function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [upiOrderId, setUpiOrderId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { gigId } = router.query;

  useEffect(() => {
    const createOrderIntent = async () => {
      if (!gigId) return;

      try {
        const { data } = await axios.post(
          CREATE_ORDER,
          { gigId },
          { withCredentials: true }
        );
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating order:", error);
        setError("Failed to create order. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    createOrderIntent();
  }, [gigId]);

  const handleUPIPayment = async () => {
    if (!gigId) return;

    try {
      const { data } = await axios.post(
        CREATE_UPI_ORDER,
        { gigId },
        { withCredentials: true }
      );
      setUpiOrderId(data.upiOrderId);
    } catch (error) {
      console.error("Error creating UPI order:", error);
      setError("Failed to initiate UPI payment. Please try again.");
    }
  };

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-[80vh] max-w-full mx-20 flex flex-col gap-10 items-center">
      <h1 className="text-3xl">Please complete the payment to place the order.</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}

export default Checkout;
