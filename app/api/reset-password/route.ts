import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        console.log("Attempting reset password request");
        const body = await req.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const contentType = res.headers.get("content-type");
            let errorMessage = "Failed to reset password";

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
            message: message || "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}