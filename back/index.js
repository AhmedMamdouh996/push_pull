const http = require("http");

const server = http.createServer();

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

io.on("connection", async (socket) => {
  console.log("New connection: " + socket.id);
  const usersIDs = await io
    .allSockets()
    .then((data) => socket.emit("allUsers", [...data]));

  console.log(usersIDs);
  socket.on("message", (data) => {
    socket.broadcast.emit("replyMessage", data);
  });

  socket.on("privateMessage", (data) => {
    const [messageBody, user] = data;
    socket.broadcast.to(user).emit("replyMessage", messageBody);
  });
  socket.on("joinRoom", (data) => {
    socket.join(data);
  });

  socket.on("messageRoom", (data) => {
    const [messageBody, room] = data;
    socket.to(room).emit("replyMessage", messageBody);
  });
  socket.on("disconnect", (socket) => {});
});

server.listen(3000, () => {
  console.log("Server Started on port 3000");
});
