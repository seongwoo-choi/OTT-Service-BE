const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const Movie = require("../models/movies");
const Episode = require("../models/episode");
require("dotenv").config();


const distUrl = 'https://d24g4g3n4eb20o.cloudfront.net';
//const s3Key = 'puppuy_bbori/Default/puppuy_bboriFILE-GROUP-MP4-720.mp4';
//const cfAccessKeyId = process.env.CF_PUBLIC_KEY; 
const cfAccessKeyId = process.env.CF_ACCESS_KEY_ID;
// let cfPrivateKey = fs.readFileSync(path.join(__dirname, 'private_key.pem'));
let cfPrivateKey = process.env.SIGNED_URL_PRIVATE_KEY;
const signer = new AWS.CloudFront.Signer(cfAccessKeyId, cfPrivateKey)
const twoHours = 30*1000;


exports.getSignedUrl = async(req, res, next) => {
    try{
        console.log(new Date().getTime() / 1000);
        const movieId = req.query.movieId;
        const episodeId = req.query.episodeId;
        let media;
        if (movieId) {
            if (episodeId) {
                media = await Episode.findOne({where: { id: episodeId, movieId: movieId }})
            } else {
                media = await Movie.findOne({where: { id: movieId }})
            }
        }//res.status(200).json({ media })
        const s3Key = media.video;
        let cfObjectUrl = distUrl + '/' + s3Key;
        const signedUrl = signer.getSignedUrl({
            url: cfObjectUrl,
            expires: Math.floor((Date.now() + twoHours)/1000)
        })
        console.log(signedUrl)
        res.status(201).json({ signedUrl })

    }catch (error){
        next(error);
    }
}
