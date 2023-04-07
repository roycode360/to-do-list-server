// packages
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
require("./db/mongoose");

// routers
const userRouter = require("./routers/userRouter");

// server & socket
const port = process.env.PORT || 5000;
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

// middlewares
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(cors());
app.use((req, res, next) => {
  req.io = io;
  next();
});

// - add routers here
app.use(userRouter);

// start server
server.listen(port, () => console.log(`server up on port ${port}`));
