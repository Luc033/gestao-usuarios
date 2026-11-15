const AppError = require("../errors/AppError");

function errorHandler(error, req, res, next) {
  console.error(error);

  const isAppError = error instanceof AppError;

  const statusCode = isAppError ? error.statusCode : 500;

  const response = {
    message: isAppError
      ? error.message
      : "Ocorreu um erro interno no servidor.",
  };

  if (isAppError && error.errors.length > 0) {
    response.errors = error.errors;
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      message: "JSON inválido. Verifique o formato do corpo da requisição.",
    });
  }

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;
