"use client"

import React from "react";

const LinkXButton = () => {

    const generateCodeVerifier = (length = 128) => {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
        let codeVerifier = "";
        for (let i = 0; i < length; i++) {
            codeVerifier += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return codeVerifier;
    };

    const generateCodeChallenge = async (codeVerifier: string) => {
        const encoder = new TextEncoder();
        const data: any = encoder.encode(codeVerifier);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const base64 = btoa(String.fromCharCode(...hashArray))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, ""); // base64-url
        return base64;
    };

    const handleLinkX = async () => {
        const clientId = "SXZEREwxWkdkVEJSVmRvOEVpbzU6MTpjaQ"; // your X app client ID
        const redirectUri = encodeURIComponent("https://yourdomain.com/api/twitter/callback");
        const scope = encodeURIComponent("tweet.read users.read offline.access");
        const state = encodeURIComponent(Math.random().toString(36).substring(2)); // CSRF protection

        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        // Save codeVerifier + state to sessionStorage
        sessionStorage.setItem("x_code_verifier", codeVerifier);
        sessionStorage.setItem("x_oauth_state", state);

        const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        window.location.href = authUrl;
    };

    return (
        <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleLinkX}
        >
            Link X Account
        </button>
    );
};

export default LinkXButton;
