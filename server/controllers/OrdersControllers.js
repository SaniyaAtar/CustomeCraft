// orderController.js
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Use environment variable for secret key
const prisma = new PrismaClient();

export const addOrder = async (req, res) => {
  try {
    const { gigId } = req.body;

    if (!gigId) {
      return res.status(400).send("Gig ID is required.");
    }

    const gig = await prisma.gigs.findUnique({ where: { id: gigId } });

    if (!gig) {
      return res.status(404).send("Gig not found.");
    }

    return res.status(200).json({ gig });
  } catch (err) {
    console.error("Error fetching gig:", err);
    return res.status(500).send("Internal server error");
  }
};

export const createOrder = async (req, res) => {
  try {
    const { gigId } = req.body;

    if (!gigId) {
      return res.status(400).send("Gig ID is required.");
    }

    const gig = await prisma.gigs.findUnique({ where: { id: gigId } });

    if (!gig) {
      return res.status(404).send("Gig not found.");
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100, // Amount in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    await prisma.orders.create({
      data: {
        paymentIntent: paymentIntent.id,
        price: gig.price,
        buyer: { connect: { id: req.userId } },
        gig: { connect: { id: gig.id } },
      },
    });

    return res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating order:", err);
    return res.status(500).send({ message: "Internal Server Error", error: err.message });
  }
};

export const confirmOrder = async (req, res) => {
  try {
    const { paymentIntent } = req.body;

    if (!paymentIntent) {
      return res.status(400).send("PaymentIntent is required.");
    }

    await prisma.orders.update({
      where: { paymentIntent },
      data: { isCompleted: true },
    });

    return res.status(200).send("Order confirmed.");
  } catch (err) {
    console.error("Error confirming order:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getBuyerOrders = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).send("User ID is required.");
    }

    const orders = await prisma.orders.findMany({
      where: { buyerId: req.userId, isCompleted: true },
      include: { gig: true },
    });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching buyer orders:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).send("User ID is required.");
    }

    const orders = await prisma.orders.findMany({
      where: {
        gig: {
          createdBy: { id: req.userId },
        },
        isCompleted: true,
      },
      include: {
        gig: true,
        buyer: true,
      },
    });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    return res.status(500).send("Internal Server Error");
  }
};
