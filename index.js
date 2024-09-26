
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./src/db/dbconnection");
const config = require("./src/config/config");
const cors = require("cors");
const routes = require("./src/routes/v1");
const path = require("path");
// require("./src/helpers/cron");
// require("./src/middlewares/upload");
// const { Server } = require("socket.io");
// const socketIO = require('socket.io');
const app = express();

const server = http.createServer(app);
// const io = socketIO(server);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));


app.use(bodyParser.json());

app.use(cors());
app.options("*", cors());



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectDB();

server.listen(config.port, () => {
  console.log("server listing the port " + config.port);
});
