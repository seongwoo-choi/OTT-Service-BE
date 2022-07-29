const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/database");

module.exports = sequelize.define(
    "movie",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            // movie, drama
            type: DataTypes.STRING,
            allowNull: false,
        },
        isSeries: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        video: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        trailer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cast: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }
);