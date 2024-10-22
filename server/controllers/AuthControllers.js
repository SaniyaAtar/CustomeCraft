import { Prisma, PrismaClient } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";
import path from "path";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Helper function to generate hashed password
const generatePassword = async (password) => {
  const salt = await genSalt();
  return await hash(password, salt);
};

// JWT configuration
const maxAge = 3 * 24 * 60 * 60; // 3 days
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

// Signup function
export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await prisma.user.create({
        data: {
          email,
          password: await generatePassword(password),
        },
      });
      return res.status(201).json({
        user: { id: user?.id, email: user?.email },
        jwt: createToken(email, user.id),
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).send("Email Already Registered");
      }
    } else {
      return res.status(500).send("Internal Server Error");
    }
  }
};

// Login function
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        return res.status(404).send("User not found");
      }

      const auth = await compare(password, user.password);
      if (!auth) {
        return res.status(400).send("Invalid Password");
      }

      return res.status(200).json({
        user: { id: user?.id, email: user?.email },
        jwt: createToken(email, user.id),
      });
    } else {
      return res.status(400).send("Email and Password Required");
    }
  } catch (err) {
    return res.status(500).send("Internal Server Error");
  }
};

// Get user info function
export const getUserInfo = async (req, res, next) => {
  try {
    if (req?.userId) {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
      });
      return res.status(200).json({
        user: {
          id: user?.id,
          email: user?.email,
          image: user?.profileImage,
          username: user?.username,
          fullName: user?.fullName,
          description: user?.description,
          isProfileSet: user?.isProfileInfoSet,
        },
      });
    }
    return res.status(401).send("User not authenticated.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Set user info function
export const setUserInfo = async (req, res, next) => {
  try {
    if (!req?.userId) {
      return res.status(401).send("User not authenticated.");
    }

    const { userName, fullName, description } = req.body;

    if (!userName || !fullName || !description) {
      return res.status(400).send("Username, Full Name, and Description should be included.");
    }

    // Check if username is already taken
    const userNameValid = await prisma.user.findUnique({
      where: { username: userName },
    });

    if (userNameValid) {
      return res.status(400).json({ userNameError: true });
    }

    // Update user information
    await prisma.user.update({
      where: { id: req.userId },
      data: {
        username: userName,
        fullName,
        description,
        isProfileInfoSet: true,
      },
    });

    return res.status(200).send("Profile data updated successfully.");
  } catch (err) {
    console.error(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).json({ userNameError: true });
      }
    }
    return res.status(500).send("Internal Server Error");
  }
};

// Set user image function
export const setUserImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("Image not included.");
    }

    if (!req.userId) {
      return res.status(401).send("User not authenticated.");
    }

    const date = Date.now();
    const fileName = `${date}-${req.file.originalname}`;
    const dir = path.join("uploads", "profiles");
    const filePath = path.join(dir, fileName);

    // Ensure directory exists
    await fs.mkdir(dir, { recursive: true });

    // Move the uploaded file to the desired location
    await fs.rename(req.file.path, filePath);

    // Update the user profile image in the database
    await prisma.user.update({
      where: { id: req.userId },
      data: { profileImage: filePath },
    });

    return res.status(200).json({ img: filePath });

  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
