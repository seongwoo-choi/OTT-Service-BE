require("dotenv").config();
const { s3Uploadv3 } = require("../aws/s3");
const Movie = require("../models/movies");
const Episode = require("../models/episode");
const User = require("../models/user")


exports.upload = async (req, res, next) => {
    try {
        const user = await User.findOne({where: { id: req.userId, status: true, isAdmin: true }});
        if (!user) {
            const error = new Error("Unauthorized user")
            error.statusCode = 403;
            throw error;
        }
        const results = await s3Uploadv3(req.files);
        console.log(results)
        return res.status(200).json({ status: "success" });
    } catch (error) {
        next(error);
    }
};

exports.videoUpload = async (req, res, next) => {
    try{
        const user = await User.findOne({where: { id: req.userId, status: true, isAdmin: true}});
        if (!user) {
            const error = new Error("Unauthorized user")
            error.statusCode = 403;
            throw error;
        }
        const { title, rank, genre, type, video, duration, desc, trailer, thumbnail, cast, isSeries, limit } = req.body;
        const Video = await Movie.create({
            title, rank, genre, type, video, duration, desc, trailer, thumbnail, cast, isSeries, limit
        })

        res.status(201).json({
            msg: "Create successful", 
            id : Video.id
        })

    } catch (error){
        next(error);
    }
}

exports.episodeUpload = async (req, res, next) => {
    try{
        const user = await User.findOne({ where: { id: req.userId, status: true, isAdmin: true }});
        if (!user) {
            const error = new Error("Unauthorized user")
            error.statusCode = 403;
            throw error;
        }
        const { title, epi_info, duration, video, thumbnail, movie_title } = req.body;
        const movie = await Movie.findOne({ where: { title: movie_title }})
        if (!movie) {
            const error = new Error("Not Found Movie!");
            error.statusCode = 404;
            throw error;
        }
        const episode = await Episode.create({
            title, epi_info, duration, video, thumbnail, movieId: movie.id
        });

        res.status(201).json({ msg: "Episode created successfully", id: episode.id});
    } catch (error) {
        next(error);
    }
}