import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        console.log("Attempting password change request");
        const body = await req.json();

        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Not authenticated" },
                { status: 401 }
            );
        }

        console.log("Using token:", token);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/change-password`, {
            method: "POST",
            //credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                //"Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const contentType = res.headers.get("content-type");
            let errorMessage = "Failed to change password";

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
            message: message || "Password changed successfully"
        });

    } catch (error) {
        console.error("Change password error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}