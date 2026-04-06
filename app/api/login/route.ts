import { NextResponse } from "next/server"

export async function POST(req: Request) {
    console.log("Attempting login request")

    const body = await req.json()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })

    if (!res.ok) {
        const contentType = res.headers.get("content-type")
        let errorMessage = "Invalid credentials"

        if (contentType?.includes("application/json")) {
            try {
                const errorData = await res.json()
                errorMessage = errorData.message || errorMessage
            } catch (e) {
                console.error("Failed to parse error response:", e)
            }
        } else {
            const textError = await res.text()
            if (textError) errorMessage = textError
        }

        return NextResponse.json({ error: errorMessage }, { status: res.status })
    }

    const token = await res.text()

    const response = NextResponse.json({ success: true, token })

    // ✅ Set the JWT as a cookie so middleware can read it
    response.cookies.set({
        name: "access_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    console.log("Login successful, cookie set")
    return response
}