require("dotenv").config();
const Movie = require("../models/movies");
const Episode = require("../models/episode");
const User = require("../models/user");

const Sequelize = require("sequelize");

exports.getMovie = async (req, res, next) => {
    try {
        const movieId = req.params.id;
        const movie = await Movie.findOne({ where: { id: movieId } , include: Episode })
        if(!movie) {
            const error = new Error("do not have a movie with " + movieId);
            error.statusCode = 403;
            throw error;
        }
        res.status(200).json({ movie })

    } catch (error) {
        next(error);
    }
}

exports.getRandomMovies = async (req, res, next) => {
    try{
        const type = req.query.type;
        let movie;
        if (type === "movie"){
            movie = await Movie.findAll({ where: { type } })
        } else {
            // type = series, movie 
            movie = await Movie.findAll({ where: { type: "series" } })
        } 

        const rn = Object.keys(movie).length;
        const ro = Object.values(movie)[Math.ceil(Math.random() * rn)-1];
        
        res.status(200).json({ ro });
    } catch (error) {
        next(error)
    }
}