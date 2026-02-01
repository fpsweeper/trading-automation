// app/api/logout/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const response = NextResponse.json({ success: true });

    // ✅ Clear the cookie
    response.cookies.set({
        name: "access_token",
        value: "",      // empty value
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0)
    });

    return response;
}
