import { AuthError } from "@packages/error-handler";
import { NextFunction, Response } from "express";

export const isSeller = (req:any, res: Response, next: NextFunction) => {
    if(req.role !== "Seller") return next(new AuthError("Access Denied. Only seller allowed"))
}

export const isUser = (req:any, res: Response, next: NextFunction) => {
    if(req.role !== "User") return next(new AuthError("Access Denied. Only user allowed"))
}