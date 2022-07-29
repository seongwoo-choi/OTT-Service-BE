const express = require("express");

const router = express.Router();

const movieController = require("../controller/movieController")
const isAuth = require("../middleware/isAuth")

router.get("/randoms", isAuth, movieController.getRandomMovies);

// localhost/movies/1
// req.params.id = 1
router.get("/find/:id", isAuth, movieController.getMovie);

module.exports = router;