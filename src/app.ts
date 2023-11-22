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
    const activeUsersInRoom =
      findUserOfSameSocietyConnected(room).sort(sortRandomly);

    io.to(room).emit("gameStarted", activeUsersInRoom);
  });

  socket.on("vote", (value, socketTurn) => {
    const room = getSocketRoom(socket);
    const society = societies.find((society) => society.name === room)!;
    const winnerSocket = value ? socket.id : socketTurn;
    society.users.find((user) => user.socketId === winnerSocket)!.points += 1;
    society.votedUsers += 1;
    socket.emit("voted"); //a voir si besoin pour confirmer le vote
    if (
      society.votedUsers ===
      findUserOfSameSocietyConnected(room).length - 1
    ) {
      society.votedUsers = 0;
      io.to(room).emit("endTurn");
    }
  });

  socket.on("endGame", () => {
    const room = getSocketRoom(socket);
    io.to(room).emit("gameEnded", findUserOfSameSocietyConnected(room));
    const society = societies.find((society) => society.name === room)!;
    society.users.forEach((user) => {
      user.socketId = "";
      user.points = 0;
    });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

httpServer.listen(3000, () => {
  console.log("listen 3000");
});
