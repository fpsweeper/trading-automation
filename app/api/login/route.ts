import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("Attempting login request");
    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    // ✅ Handle different error status codes
    if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage = "Invalid credentials";

        // If Spring Boot returns JSON (your ApiError)
        if (contentType?.includes("application/json")) {
            try {
                const errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.error("Failed to parse error response:", e);
            }
        } else {
            // If it's plain text
            const textError = await res.text();
            if (textError) {
                errorMessage = textError;
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: res.status } // ✅ Preserve the original status code
        );
    }

    const token = await res.text();

    const response = NextResponse.json({ success: true });

    // ✅ Store JWT securely
    response.cookies.set({
        name: "access_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 60 * 60, // 1 hour
    });

    return response;
}