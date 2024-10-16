/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

   const io = new Server(server, {
     cors: {
       origin: "*", 
       methods: ["GET", "POST"], 
       credentials: true,
     },
   });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    socket.on("message", (msg) => {
      console.log("Message received:", msg);
      io.emit("message", msg);
    });

    socket.on("scan-code", ({ user, clientId, token }) => {
      console.log(
        `Scan success event received. UserID: ${user.id}, Token: ${token}`,
      );
      io.emit("scan-code", { user, clientId, token });
    });
  });

  // Mulai server
  const PORT = process.env.PORT ?? 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
