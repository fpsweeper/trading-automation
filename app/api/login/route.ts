import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("Attempting login request");
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include", // ✅ Important: receive cookies from Spring Boot
    });

    if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage = "Invalid credentials";

        if (contentType?.includes("application/json")) {
            try {
                const errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.error("Failed to parse error response:", e);
            }
        } else {
            const textError = await res.text();
            if (textError) {
                errorMessage = textError;
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: res.status }
        );
    }

    const token = await res.text();

    const response = NextResponse.json({ success: true, token: token });

    // Set cookie for Next.js frontend
    response.cookies.set({
        name: "access_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days to match Spring Boot
    });

    // ✅ Forward Spring Boot's Set-Cookie header if present
    const springCookie = res.headers.get("set-cookie");
    if (springCookie) {
        console.log("Forwarding Spring Boot cookie:", springCookie);
    }

    return response;
}