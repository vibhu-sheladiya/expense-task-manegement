
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { connectDB } = require("./src/db/dbconnection");
const config = require("./src/config/config");
const cors = require("cors");
const routes = require("./src/routes/v1");
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
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

// Load the Swagger YAML file
// const swaggerDocument = YAML.load(path.join(__dirname, 'swagger/swagger.yaml'));

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.listen(config.port, () => {
  console.log("server listing the port " + config.port);
});
