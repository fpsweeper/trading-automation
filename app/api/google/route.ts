import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorData = await res.text();
            console.error("Google auth failed:", errorData);
            return NextResponse.json(
                { error: "Google authentication failed" },
                { status: 401 }
            );
        }

        const data = await res.json();

        const response = NextResponse.json({
            success: true,
            accessToken: data.accessToken, // ✅ Return token to store in localStorage
            user: data.user
        });

        // ✅ Also set cookie for middleware
        response.cookies.set({
            name: "access_token",
            value: data.accessToken,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error("Google auth error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}