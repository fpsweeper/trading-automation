// Next.js API route example
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code, state } = req.query;

    // Validate state to prevent CSRF
    const savedState = req.cookies["x_oauth_state"];
    if (state !== savedState) {
        return res.status(400).json({ error: "Invalid state" });
    }

    const codeVerifier = req.cookies["x_code_verifier"]; // retrieve codeVerifier securely

    // Exchange code for access token
    const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${Buffer.from("SXZEREwxWkdkVEJSVmRvOEVpbzU6MTpjaQ:9GtW9EC1E2H7AW6wEuTdq_8ed37yLGVgEWYe5wYWfp5lv7LxZi").toString("base64")}`
        },
        body: new URLSearchParams({
            code: code as string,
            grant_type: "authorization_code",
            client_id: "SXZEREwxWkdkVEJSVmRvOEVpbzU6MTpjaQ",
            redirect_uri: "https://yourdomain.com/api/twitter/callback",
            code_verifier: codeVerifier as string
        })
    });


    const tokenData = await tokenRes.json();

    // Right after tokenData = await tokenRes.json()
    const accessToken = tokenData.access_token;

    const userRes = await fetch("https://api.twitter.com/2/users/me", {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });

    const userData = await userRes.json();
    console.log("X user info:", userData);

    // tokenData contains access_token, refresh_token, etc.
    // You can use access_token to get user info and link it in your DB
    res.status(200).json({ ...tokenData, userData });
}
