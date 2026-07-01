const successResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (
  res,
  error = "Internal Server Error",
  statusCode = 500,
) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
