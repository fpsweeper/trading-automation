import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        console.log("Attempting forgot password request");
        const body = await req.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/forgot-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const contentType = res.headers.get("content-type");
            let errorMessage = "Failed to send reset code";

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

        const message = await res.text();

        return NextResponse.json({
            success: true,
            message: message || "Password reset code sent to your email"
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}