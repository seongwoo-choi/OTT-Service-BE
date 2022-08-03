const tracer = require('dd-trace').init({
    appsec: true
})
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const xss = require("xss-clean");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

require("dotenv").config();

const sequelize = require("./database/database");
const User = require("./models/user");
const Movie = require("./models/movies");
const Episode = require("./models/episode");

const authRoute = require("./routes/authRoute");
const mediaRoute = require("./routes/mediaRoute");
const listRoute = require("./routes/listRoute");
const movieRoute = require("./routes/movieRoute");
const signedUrlRoute = require("./routes/signedURLRoute");

const app = express();

const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});

app.use(express.json());
app.use(helmet());
app.use(morgan("combined", { stream: logStream }));
app.use(cors());
app.use(xss());

app.use("/auth", authRoute);
app.use("/media", mediaRoute);
app.use("/signedUrl", signedUrlRoute);
app.use("/lists", listRoute);
app.use("/movies", movieRoute);
// app.use("/", (req, res, next) => {
//   res.status(200).json({ msg: "health check" });
// })
app.get("/health", (req, res, next) => {
  res.status(200).json({ msg: "health check" });
})

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const msg = error.message;
  const data = error.data;

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "file is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "File limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be an image",
      });
    }
  }

  res.status(status).json({ status, data, msg });
});

Episode.belongsTo(Movie, { constraints: true, onDelete: "CASCADE"});
Movie.hasMany(Episode);

const start = async () => {
  try {
    await sequelize.sync();
    // await sequelize.sync({ force: true });
    app.listen(process.env.PORT || 8080);
  } catch (err) {
    console.log(err);
  }
};

start();
