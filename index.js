const express = require("express");
const app     = express();
const server  = require("http").createServer(app);
const io      = require("socket.io").listen(server);
const port    = process.env.PORT || 8888;




app.use(express.static(`${__dirname}/public`))



server.listen(port, () => console.log(`Express is listening on port ${port}`));

io.on("connection", socket => {
  console.log("new connection");

  socket.on("move", msg => {
    console.log(msg);
    socket.broadcast.emit("move", msg)
  });
});
