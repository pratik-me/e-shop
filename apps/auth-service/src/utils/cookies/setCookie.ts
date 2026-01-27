import { Response, CookieOptions } from "express";

export const setCookie = (
    res: Response, 
    name: string, 
    value: string, 
    durationInMs: number = 7 * 24 * 60 * 60 * 1000
) => {
    const options: CookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: durationInMs,
        path: "/",
    };

    res.cookie(name, value, options);
};