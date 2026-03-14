import prisma from "packages/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies["access_token"] ||
      req.cookies["seller-access-token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized! Token missing.",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string;
      role: "user" | "seller";
    };

    let account;
    if (decoded.role === "user") {
      account = await prisma.users.findUnique({ where: { id: decoded.id } });
      req.user = account;
    } else if (decoded.role === "seller") {
      account = await prisma.sellers.findUnique({ where: { id: decoded.id } });
      req.seller = account;
    }

    if (!account) {
      return res.status(401).json({
        message: `Unauthorized! ${decoded.role} not found.`,
        success: false,
      });
    }

    req.role = decoded.role;
    return next();

  } catch (error: any) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {     // 401 for authorization related errors
      return res.status(401).json({
        message: "Unauthorized! Token expired or invalid.",
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      success: false,
    });
  }
};

export default isAuthenticated;