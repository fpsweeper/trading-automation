import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({
                isAuthenticated: false,
                username: "",
                email: "",
                role: "USER",
            });
        }

        const token = authHeader.substring(7);

        const payload = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString("utf-8")
        );

        return NextResponse.json({
            id: payload.sub || "unknown",
            isAuthenticated: true,
            username: payload.username || "",
            email: payload.email || "",
            role: payload.role || "USER",   // ← new
        });

    } catch (err) {
        console.error("Failed to decode JWT:", err);
        return NextResponse.json({
            isAuthenticated: false,
            username: "",
            email: "",
            role: "USER",
        });
    }
}