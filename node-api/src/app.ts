import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { router } from "./routes";
import bodyParser from "body-parser";

const app = express();

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, { cors: { origin: "*" } });

io.on("connection", (socket) => console.log(`Usuário conectado no socket ${socket.id}`));

app.use(express.json());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Content-type", "application/json");
  next();
});
app.use(cors());
app.use(bodyParser.json());
app.use("/sistemati-api", router);

// SERVER FRONT REACT
// const path = require('path');
// app.use(express.static(path.resolve(__dirname, '../front')));
// app.get('/*', function (req, res) {
//   res.sendFile(path.resolve(__dirname, '../front', 'index.html'))
// })
// app.get('/', (req, res) => {
//  res.sendFile(path.resolve(__dirname, '../front', 'index.html'));
// });

export { serverHttp, io };
