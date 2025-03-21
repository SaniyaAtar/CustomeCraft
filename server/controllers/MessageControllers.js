import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addMessage = async (req, res, next) => {
  try {
    const { userId, body, params } = req;
    const { recipentId, message } = body;
    const { orderId } = params;

    if (!userId || !recipentId || !orderId || !message) {
      return res.status(400).send("userId, recipentId, orderId, and message are required.");
    }

    const newMessage = await prisma.message.create({
      data: {
        sender: { connect: { id: userId } },
        recipient: { connect: { id: recipentId } },
        order: { connect: { id: orderId } },
        text: message,
      },
    });

    return res.status(201).json({ message: newMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { userId, params } = req;
    const { orderId } = params;

    if (!orderId || !userId) {
      return res.status(400).send("Order id and user id are required.");
    }

    const messages = await prisma.message.findMany({
      where: { orderId },
      orderBy: { createdAt: "asc" },
    });

    await prisma.message.updateMany({
      where: { orderId, recipientId: userId, isRead: false },
      data: { isRead: true },
    });

    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: { gig: true },
    });

    let recipentId;
    if (order?.buyerId === userId) {
      recipentId = order.gig.userId;
    } else if (order?.gig.userId === userId) {
      recipentId = order.buyerId;
    }

    return res.status(200).json({ messages, recipentId });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUnreadMessages = async (req, res, next) => {
  try {
    const { userId } = req;

    if (!userId) {
      return res.status(400).send("User id is required.");
    }

    const messages = await prisma.message.findMany({
      where: { recipientId: userId, isRead: false },
      include: { sender: true },
    });

    return res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { userId, params } = req;
    const { messageId } = params;

    if (!userId || !messageId) {
      return res.status(400).send("User id and message id are required.");
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    return res.status(200).send("Message marked as read.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};