const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
require("dotenv").config();

const nodemailer = require("nodemailer");

const User = require("../models/user");

const EMAIL = "hibogo789@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    type: "OAuth2",
    user: EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
    expires: 1484314697598,
  },
});

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Invalid Data");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const { email, password } = req.body;

    // SELECT `id`, `email`, `password`, `createdAt`, `updatedAt` FROM `users` AS `user` WHERE `user`.`email` = 'test@example.com'
    const checkEmail = await User.findOne({ where: { email } });

    if (checkEmail) {
      const error = new Error(`${email} is already registered`);
      error.statusCode = 422;
      throw error;
    }

    const signupToken = await bcrypt.hash(email, 10);

    transporter.sendMail({
      to: email,
      from: EMAIL,
      subject: "authorization your account to theotter🦦",
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <title>authorization your account to theotter🦦</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        </head>
        <style>
          #otter {
            background-image:url("https://mblogthumb-phinf.pstatic.net/MjAxOTExMDhfMjYw/MDAxNTczMjAxOTM1MzY5.S3zKV2zpuUaa0tc8ItmGL_h5m0CVrtmYZxsOUc_ihA0g.aaQ_rpUcCyrw6ur8oa8XJbHFPFl2xrweecEdUu6GtLYg.JPEG.naverschool/GettyImages-1162414574.jpg?type=w800")
          }
        </style>
        <body style="margin: 0; padding: 0;">
          <table border="1" cellpadding="0" cellspacing="0" width="100%">
            <tr id="otter" height="200" >
              <td align="center" bgcolor="#70bbd9" style="padding: 40px 0 30px 0; background-image: url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvDipaTkKf8PosrXzcmEZZ7-CIhjbE-ifEOg&usqp=CAU)">
              </td>
            </tr>
            <tr>
              <td bgcolor="#70bbd9">
                <h2 align="center"><a href=${process.env.SERVER}/auth/signupToken/?token=${signupToken}>Click</a> to verify your email</h2>
              </td>
            </tr>
          </table>
        </body>
      </html>
      `,
    });

    const curr = new Date() + 3600000;
    // const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
    // const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
    // const kr_curr = new Date(utc + KR_TIME_DIFF);

    const hashPwd = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashPwd,
      signupToken: signupToken,
      signupTokenExpiration: curr,
    });

    res.status(201).json({ id: user.id, msg: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

exports.authorizeUser = async (req, res, next) => {
  try {
    console.log(req.query);
    const signupToken = req.query.token;
    const user = await User.findOne({ where: { signupToken } });
    
    if (!user) {
      const error = new Error("Invalid signup token provided");
      error.statusCode = 403;
      throw error;
    }

    await user.update({ status: true });

    res.redirect(process.env.FRONT_SERVER_LOGIN_URL)
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    const status = user.status;

    if (!user) {
      const error = new Error("User Not Found");
      error.statusCode = 403;
      throw error;
    }

    const isPwd = await bcrypt.compare(password, user.password);

    if (!isPwd) {
      const error = new Error("Invalid password");
      error.statusCode = 403;
      throw error;
    }

    const token = jwt.sign(
      { email: email, userId: user.id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ msg: "login successful", token: token, userId: user.id, status });
  } catch (err) {
    next(err);
  }
};