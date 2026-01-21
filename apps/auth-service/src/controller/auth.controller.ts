import { Request, Response, NextFunction } from "express";
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequests, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-12-15.clover",
})

export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistrationData(req.body, "user");
        const { name, email } = req.body;

        const exisitngUser = await prisma.users.findUnique({ where: { email } });

        if (exisitngUser) next(new ValidationError("User already exists with this email"));

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, "user-activation-mail");

        res.status(200).json({
            message: "OTP send to email. Please verify your account.",
        })
    } catch (error) {
        return next(error);
    }
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, password, name } = req.body;

        if (!email || !otp || !password || !name) next(new ValidationError("Missing required fields."));

        const exisitngUser = await prisma.users.findUnique({ where: { email } });
        if (exisitngUser) next(new ValidationError("User already exists with this email"));

        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        })

        res.status(201).json({
            message: "User registered successfully.",
            success: true,
        })
    } catch (error) {
        return next(error);
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return next(new ValidationError("Email and password are required."));

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return next(new AuthError("User doesn't exists."));

        // Verifying password
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) return next(new AuthError("Invalid email or password."));

        // Tokenization
        const accessToken = jwt.sign({ id: user.id, role: "user" }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: user.id, role: "user" }, process.env.REFRESH_TOKEN_SECRET as string, { expiresIn: "7d" });

        setCookie(res, "refresh-token", refreshToken);
        setCookie(res, "access-token", accessToken);

        res.status(200).json({
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email },
            success: true,
        })
    } catch (error) {
        return next(error);
    }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies["refresh_token"] || req.cookies["seller-refresh-token"] || req.headers.authorization?.split(" ")[1];

        if (!refreshToken) return new ValidationError("Unauthorized! No refresh token found.");

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string, role: string };

        if (!decoded || !decoded.id || !decoded.role) return next(new AuthError("Forbidden! Invalid refresh token."));

        let account;
        if(decoded.role === "user") account = await prisma.users.findUnique({ where: { id: decoded.id } });
        else if (decoded.role === "seller") account = await prisma.sellers.findUnique({
            where : {id: decoded.id},
            include: {shop: true},
        });

        if (!account) return new AuthError("Forbidden! Account not found.");

        const newAccessToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: "15m" });

        if(decoded.role === "user") setCookie(res, "access_token", newAccessToken);
        else if (decoded.role === "seller") setCookie(res, "seller-access-token", newAccessToken);

        return res.status(201).json({
            success: true,
            message: "Refresh token generated successfully.",
        })
    } catch (error) {
        return next(error)
    }
}

export const getUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        res.status(201).json({
            success: true,
            user,
            message: "User fetched successfully.",
        })
    } catch (error) {
        return next(error);
    }
}

export const userForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await handleForgotPassword(req, res, next, "user");
}

export const verifyUserForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) return next(new ValidationError("Email and OTP are required."));

        await verifyOtp(email, otp, next);

        res.status(200).json({
            message: "OTP verified successfully. You can now reset your password.",
            success: true,
        })
    } catch (error) {
        return next(error);
    }
}

export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) return next(new ValidationError("Email and new password are required."));

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) return next(new AuthError("User not found with this email."));

        const isSamePassword = await bcrypt.compare(newPassword, user.password!);
        if (isSamePassword) return next(new ValidationError("New password cannot be same as old password."));

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { email },
            data: { password: hashedPassword }
        })

        res.status(200).json({
            message: "Password reset successfully.",
            success: true,
        })
    } catch (error) {
        return next(error);
    }
}

// Seller
export const registerSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, email} = req.body;

        const existingSeller = await prisma.sellers.findUnique({ where: { email } });
        if (existingSeller) throw new ValidationError("Seller already exists with this email.");

        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        await sendOtp(name, email, "seller-activation-mail");

        res.status(200).json({
            message: "OTP sent successfully to your email. Please verify your account."
        })
    } catch (error) {
        next(error)
    }
}

export const verifySeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, password, name, phone_number, country } = req.body;
        if (!email || !otp || !password || !name || !phone_number || !country)
            return next(new ValidationError("All fields are required."))

        const existingSeller = await prisma.sellers.findUnique({ where: { email } })
        if (existingSeller) return next(new ValidationError("Seller already exists with this email."))

        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);

        const seller = await prisma.sellers.create({
            data: {
                name,
                email,
                password: hashedPassword,
                country,
                phone_number,
            },
        })

        res.status(201).json({
            seller,
            message: "Seller registered successfully."
        })
    } catch (error) {
        next(error)
    }
}

export const createShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, bio, address, opening_hours, website, category, sellerId } = req.body;
        if (!name || !address || !category || !sellerId || !bio || !opening_hours) return next(new ValidationError("All fields are required."));

        const shopData: any = { name, bio, address, opening_hours, category, sellerId }
        if (website && website.trim() !== "") shopData.website = website;

        const shop = await prisma.shops.create({ data: shopData })

        res.status(201).json({
            success: true,
            shop,
        })
    } catch (error) {
        next(error)
    }
}

// Stripe
export const createStripeConnectLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sellerId } = req.body;
        if (!sellerId) return next(new ValidationError("Seller ID is required."));

        const seller = await prisma.sellers.findUnique({
            where: { id: sellerId }
        });
        if (!seller) return next(new ValidationError("Seller is not available with given id"));

        const account = await stripe.accounts.create({
            type: "express",
            email: seller?.email,
            country: "SG",
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        })

        await prisma.sellers.update({
            where: {id: sellerId},
            data: {stripeId: account.id},
        });

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `http://localhost:3000/success`,
            return_url: `http://localhost:3000/success`,
            type: "account_onboarding",
        });

        res.json({url: accountLink.url});
    } catch (error) {
        return next(error);
    }
}

export const loginSeller = async(req: Request, res:Response, next:NextFunction) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) return next(new ValidationError("Email and password are required."));

        const seller = await prisma.sellers.findUnique({where: {email}});
        if(!seller) return next(new ValidationError("Invalid email or password"));

        const isMatch = await bcrypt.compare(password, seller.password!);
        if(!isMatch) return next(new ValidationError("Invalid email or password."));

        const accessToken = jwt.sign(
            {id: seller.id, role: "seller"},
            process.env.ACCESS_TOKEN_SECRET as string,
            {expiresIn: "15m"}
        );

        const refreshToken = jwt.sign(
            {id: seller.id, role: "seller"},
            process.env.REFRESH_TOKEN_SECRET as string,
            {expiresIn: "7d"}
        );

        setCookie(res, "seller-refresh-token", refreshToken);
        setCookie(res, "seller-access-token", accessToken);

        res.status(200).json({
            message: "Login successful",
            seller: {id: seller.id, email: seller.email, name: seller.name},
        });
    } catch (error) {
        next(error);
    }
}

export const getSeller = async(req: any, res:Response, next:NextFunction) => {
    try {
        const seller = req.seller;
        res.status(201).json({
            success: true,
            seller,
        })
    } catch (error) {
        next(error);
    }
}
