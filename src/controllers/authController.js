// required main dependencies
const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("../config/index");
const pluck = require("arr-pluck");
const { Op } = require("sequelize");

// required logger and handler
const Logger = require("../utils/logger");
const logger = new Logger();
const pathFile = logger.getLabel(__filename);
const Handler = require("../utils/handler");
const handler = new Handler(logger, pathFile);
const status = require("../utils/status");

// required model
const { User } = require("../models");

// required utils
const { findUserRelation } = require("../utils/getUserRelation");

// initial messages validator
const messages = {
  username: {
    "string.base": `USERNAME_STIRNG`,
    "string.empty": `USERNAME_EMPTY`,
    "string.min": `USERNAME_MIN`,
    "string.max": `USERNAME_MAX`,
    "any.required": `USERNAME_REQUIRED`,
  },
  password: {
    "string.base": `PASSWORD_STIRNG`,
    "string.empty": `PASSWORD_EMPTY`,
    "string.min": `PASSWORD_MIN`,
    "string.max": `PASSWORD_MAX`,
    "any.required": `PASSWORD_REQUIRED`,
  },
  password_confirmation: {
    "string.base": `PASSWORD_CONFIRMATION_STIRNG`,
    "string.empty": `PASSWORD_CONFIRMATION_EMPTY`,
    "any.required": `PASSWORD_CONFIRMATION_REQUIRED`,
    "any.only": `PASSWORD_CONFIRMATION_NOTMATCH`,
  },
  email: {
    "string.base": `EMAIL_STIRNG`,
    "string.email": `EMAIL_NOTVALID`,
    "string.empty": `EMAIL_EMPTY`,
    "string.min": `EMAIL_MIN`,
    "string.max": `EMAIL_MAX`,
    "any.required": `EMAIL_REQUIRED`,
  },
};

// Method login
const Login = async (req, res) => {
  try {
    // validate input
    const schema = Joi.object({
      username: Joi.string().min(1).max(255).required().messages(messages.username),
      password: Joi.string().min(1).max(255).required().messages(messages.password),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const pluckMessage = pluck(error.details, "message");
      return handler.validate(res, pluckMessage, "");
    }

    const { username, password } = req.body;

    // find already user in database
    const options = {
      where: { username },
    };
    const user = await User.findOne(options);
    if (_.isEmpty(user)) return handler.error(res, status.Unauthorized, "USER_NOTFOUND");

    // check password match
    const match = await bcrypt.compare(password, user.password);
    if (!match) return handler.error(res, status.Unauthorized, "PASSWORD_NOTMATCH");

    // everything is ok, then generate token
    const userRelation = await findUserRelation(res, username);
    const payload = _.omit(userRelation, ["id"]);

    const accessToken = jwt.sign({ UserInfo: payload }, config.auth.access_token_secret, { expiresIn: config.auth.access_token_expire });
    const refreshToken = jwt.sign({ username: userRelation.username }, config.auth.refresh_token_secret, { expiresIn: config.auth.refresh_token_expire });

    // store refresh token
    await User.update({ refreshToken }, { where: { id: userRelation.id } });

    // response
    res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
    return handler.success(res, status.Success, "LOGIN_SUCCESS")({ accessToken });
  } catch (error) {
    return handler.error(res, status.ServerError, "CATCH_LOGIN", error);
  }
};

// Method Register
const Register = async (req, res) => {
  try {
    // validate input
    const schema = Joi.object({
      username: Joi.string().min(1).max(255).required().messages(messages.username),
      password: Joi.string().min(8).max(255).required().messages(messages.password),
      password_confirmation: Joi.string().equal(Joi.ref("password")).required().messages(messages.password_confirmation),
      email: Joi.string().email().min(1).max(255).required().messages(messages.email),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const pluckMessage = pluck(error.details, "message");
      return handler.validate(res, pluckMessage, "");
    }

    const { username, email, password } = req.body;

    // find already user in database
    const options = {
      where: {
        [Op.or]: [{ username }, { email }],
      },
    };
    const user = await User.findOne(options);
    if (!_.isEmpty(user)) return handler.error(res, status.Conflict, "USER_CONFLICT");

    // everything is ok, then create new user
    // encrypt the password
    const hashedPwd = bcrypt.hashSync(password, config.auth.saltRounds);

    const newUser = { username, password: hashedPwd, email };
    const createdUser = await User.create(newUser);
    if (_.isNull(createdUser)) return handler.error(res, status.ServerError, "ERROR_WHILE_CREATE");

    return handler.success(res, status.Success, "USER_CREATED")({ username: createdUser.username, email: createdUser.email });
  } catch (error) {
    return handler.error(res, status.ServerError, "CATCH_REGISTER", error);
  }
};

const LogOut = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return handler.error(res, status.Unauthorized, "DONT_HAVE_TOKEN");
    const refreshToken = cookies.jwt;

    // is refreshToken in db?
    const options = {
      where: { refreshToken },
    };
    const foundUser = await User.findOne(options);
    if (!foundUser) return handler.error(res, status.Forbidden, "USER_NOTFOUND");

    // remove token from database
    await User.update({ refreshToken: null }, { where: { id: foundUser.id } });

    // clear cookies
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return handler.success(res, status.Success, "LOGOUT_SUCCESS")({});
  } catch (error) {
    return handler.error(res, status.ServerError, "CATCH_LOGOUT", error);
  }
};

module.exports = {
  Login,
  Register,
  LogOut,
};
