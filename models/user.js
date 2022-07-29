const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database/database");

// 회원 가입을 할 때 => 이메일로 암호화된 토큰을 전송 => 내 서버주소/auth/signup/{token} => 사용자 인증이 되서 회원가입이 완료

// status: false => true

module.exports = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signupToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signupTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
