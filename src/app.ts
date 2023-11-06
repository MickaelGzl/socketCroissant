import * as http from "http";
import { Server } from "socket.io";
import { findUserOfSameSocietyConnected } from "./helpers/findUserOfSameSocietyConnected";
import { societies } from "./datas/societies";
import { getSocketRoom } from "./helpers/getUserRoom";

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: "*",
    methods: ["GET", "POST"],
  },
});

function sortRandomly(a: any, b: any) {
  return Math.random() - 0.5;
}

io.on("connection", (socket) => {
  //   console.log("connected");
  const token: string = socket.handshake.auth.token;
  const society = societies.find(
    (company) => company.name === token.split("*|*")[0]
  );
  if (!society) {
    socket.emit("error", "Aucune société pour l'identifiant fournis");
    socket.disconnect();
    return;
  }
  const userConnected = society.users.find((user) => user.token === token);
  if (!userConnected) {
    socket.emit("error", "Aucun utilisateur pour l'identifiant fournis");
    socket.disconnect();
    return;
  }
  const room = society.name;
  socket.join(room);
  //update user with his socketId to know that it's connected
  userConnected.socketId = socket.id;
  const userInRoom = findUserOfSameSocietyConnected(room);
  //send wait event, and user's rome for displaying or not the button
  //also send to room new user is connected
  socket.emit("waitingInRoom", userConnected.role);
  io.to(room).emit("newUserInRoom", userInRoom);

  //   console.log("always here");
  socket.on("startGame", () => {
    // console.log("receive");
    const room = getSocketRoom(socket);
    const userInRoom = societies
      .find((company) => company.name === room)!
      .users.sort(sortRandomly);

    // io.to(room).emit("gameStarted", userInRoom);
    socket.emit("gameStarted", userInRoom);
  });

  socket.on("vote", (value, socketTurn) => {
    if (value) {
      console.log(value);
    }
  });
});

httpServer.listen(3000);

//
