import io from "socket.io-client";

export const socket = io("https://heros-quest-be.vercel.app", { path: "/api/socket" });
