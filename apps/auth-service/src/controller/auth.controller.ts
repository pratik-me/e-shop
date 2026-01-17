import { Request, Response, NextFunction } from "express";
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequests, validateRegistrationData, verifyOtp } from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { setCookie } from "../utils/cookies/setCookie";

export const userRegistration = async(req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistrationData(req.body, "user");
        const {name, email} = req.body;

        const exisitngUser = await prisma.users.findUnique({where: { email }});

        if(exisitngUser) next(new ValidationError("User already exists with this email"));

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

export const verifyUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, otp, password, name} = req.body;

        if(!email || !otp || !password || !name) next(new ValidationError("Missing required fields."));

        const exisitngUser = await prisma.users.findUnique({where: { email }});
        if(exisitngUser) next(new ValidationError("User already exists with this email"));

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

export const loginUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) return next(new ValidationError("Email and password are required."));

        const user = await prisma.users.findUnique({where: {email}});
        if(!user) return next(new AuthError("User doesn't exists."));

        // Verifying password
        const isMatch = await bcrypt.compare(password, user.password!);
        if(!isMatch) return next(new AuthError("Invalid email or password."));

        // Tokenization
        const accessToken = jwt.sign({id: user.id, role: "user"}, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "15m"});
        const refreshToken = jwt.sign({id: user.id, role: "user"}, process.env.REFRESH_TOKEN_SECRET as string, {expiresIn: "7d"});

        setCookie(res, "refresh-token", refreshToken);
        setCookie(res, "access-token", accessToken);

        res.status(200).json({
            message: "Login successful",
            user: {id: user.id, name: user.name, email: user.email},
            success: true,
        })
    } catch (error) {
        return next(error);
    }
}

export const refreshToken = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if(!refreshToken) return new ValidationError("Unauthorized! No refresh token found.");

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as {id: string, role: string};

        if(!decoded || !decoded.id || !decoded.role) return new JsonWebTokenError("Forbidden! Invalid refresh token.");

        const user = await prisma.users.findUnique({where: {id: decoded.id}});

        if(!user) return new AuthError("Forbidden! User not found.");

        const newAccessToken = jwt.sign({id: decoded.id, role: decoded.role}, process.env.ACCESS_TOKEN_SECRET as string, {expiresIn: "15m"});

        setCookie(res, "access_token", newAccessToken);

        return res.status(201).json({
            success: true,
            message: "Refresh token generated successfully.",
        })
    } catch (error) {
        return next(error)
    }
}

export const getUser = async(req: any, res: Response, next: NextFunction) => {
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

export const userForgotPassword = async(req: Request, res: Response, next: NextFunction) => {
    await handleForgotPassword(req, res, next, "user");
}

export const verifyUserForgotPassword = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, otp} = req.body;

        if(!email || !otp) return next(new ValidationError("Email and OTP are required."));

        await verifyOtp(email, otp, next);

        res.status(200).json({
            message: "OTP verified successfully. You can now reset your password.",
            success: true,
        })
    } catch (error) {
        return next(error);
    }
}

export const resetUserPassword = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, newPassword} = req.body;

        if(!email || !newPassword) return next(new ValidationError("Email and new password are required."));

        const user = await prisma.users.findUnique({where: {email}});
        if(!user) return next(new AuthError("User not found with this email."));

        const isSamePassword = await bcrypt.compare(newPassword, user.password!);
        if(isSamePassword) return next(new ValidationError("New password cannot be same as old password."));

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: {email},
            data: {password: hashedPassword}
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