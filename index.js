require("dotenv").config();

const express = require("express");
const cors = require("cors");
const router = require("./Routes/router");
const middleware = require("./Middleware/authMiddlesware");

require("./DB/connection");

const bankServer = express();

bankServer.use(cors());

bankServer.use(express.json());

bankServer.use(middleware.appMiddleware);

bankServer.use(router);

const PORT = 3000 || process.env.PORT;

bankServer.listen(PORT, () => {
   console.log(`Server started and running at port ${PORT}`);
});

bankServer.get("/", (req, res) => {
   res.status(200).send(`<h1>Bank Server Started</h1>`);
});
