import express, { Response, Request } from "express";
import mongoose from "mongoose";
import client from "./Redis/redisClient";
import authRoutes from "./routes/AuthRoutes";
import nodeCron from "node-cron";
import messagesRoutes from "./routes/Message.routes";
import verifyToken from "./middleware/verifyToken";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);
app.use("/message", verifyToken, messagesRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // React uygulamasının çalıştığı yer
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("New Client connected", socket.id);
    socket.on("sendMessage", (data) => {
        console.log("Message received:", data);
        io.emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("Client Disconnected");
    });
});

(async () => {
    try {
        const response = await mongoose.connect("mongodb+srv://eren28:28eren57@cluster0.n2gcnhz.mongodb.net/chatAppDb?retryWrites=true&w=majority&appName=Cluster0");
        if (response.STATES.connected === 1) {
        server.listen(5000, () => { // Burada server.listen kullanıyoruz
            console.log("Server running on port 5000");
        });
        }
    } catch (err) {
        console.error("Database connection error:", err);
    }
})();
