import { NextResponse } from "next/server";

export async function GET(req: Request) {
    // Get the cookie from the request headers
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
        cookieHeader
            .split(";")
            .map(c => c.trim().split("="))
            .map(([k, v]) => [k, decodeURIComponent(v)])
    );

    const accessToken = cookies["access_token"];
    if (!accessToken) {
        return NextResponse.json({ isAuthenticated: false, username: "" });
    }

    let username = "";
    try {
        // Decode JWT payload
        const payload = JSON.parse(
            Buffer.from(accessToken.split(".")[1], "base64").toString("utf-8")
        );
        username = payload.username || "";
    } catch (err) {
        console.error("Failed to decode JWT:", err);
        return NextResponse.json({ isAuthenticated: false, username: "" });
    }

    return NextResponse.json({ isAuthenticated: true, username });
}
