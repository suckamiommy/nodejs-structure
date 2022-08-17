const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const RequestHandler = require("../utils/RequestHandler");
const Logger = require("../utils/logger");
const BaseController = require("../controllers/BaseController");
const stringUtil = require("../utils/stringUtil");
const email = require("../utils/email");
const config = require("../config/appconfig");
const auth = require("../utils/auth");

const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const tokenList = {};
