import prisma from "@packages/libs/prisma";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const isAuthenticated = async(req: any, res:Response, next:NextFunction) => {
    try {
        const token = req.cookies["access_token"] || req.cookies["seller-access-token"] || req.headers.authorization?.split(" ")[1];
        if(!token) return res.status(401).json({
            message: "Unauthorized! Token missing.",
            success: false,
        })

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {id: string, role: "User" | "Seller"};
        if(!decoded) return res.status(401).json({
            message: "Unauthorized! Invalid token.",
            success: false,
        })

        let account;
        if(req.role === "User") {
            account = await prisma.users.findUnique({
                where: {id: decoded.id}
            });
            req.user = account;
        } else if (req.role === "Seller") {
            account = await prisma.sellers.findUnique({
                where: {id: decoded.id},
                include: {shop: true},
            });
            req.seller = account;
        }

        if(!account) return res.status(401).json({
            message: "Unauthorized! User not found.",
            success: false,
        })

        req.role = decoded.role;

        return next();
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
        })
    }
}

export default isAuthenticated;