const { UnprocessableEntity } = require("./status");
const _ = require("lodash");

class Handler {
  constructor(logger, from) {
    this.logger = logger;
    this.from = from;
  }

  validate(res, err, errorMessage) {
    if (err) {
      this.logger.log(
        `[${this.from}] Error in validating request : ${errorMessage}`,
        "warn"
      );
    }
    return res
      .status(UnprocessableEntity.status)
      .json(dtoValidate(UnprocessableEntity, err));
  }

  success(res, handlerType, message) {
    this.logger.log(
      `[${
        this.from
      }] Request has been made and proccessed successfully at: ${new Date()}`,
      "info"
    );
    return (data) =>
      res
        .status(handlerType.status)
        .json(dtoSuccess(handlerType, message, data));
  }

  error(res, handlerType, message, error = {}) {
    if (_.isNil(error.message)) error.message = message;
    this.logger.log(
      `[${this.from}] Error during processing request with message: ${error.message}`,
      "error"
    );
    return res.status(handlerType.status).json(dtoError(handlerType, message));
  }
}

const dtoSuccess = (handlerType, message, data) => {
  return {
    status: handlerType.status,
    type: handlerType.error,
    message,
    data,
  };
};

const dtoError = (handlerType, message) => {
  return {
    status: handlerType.status,
    type: handlerType.error,
    message,
  };
};

const dtoValidate = (handlerType, message) => {
  return {
    status: handlerType.status,
    type: handlerType.error,
    message,
  };
};

module.exports = Handler;
