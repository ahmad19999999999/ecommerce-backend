class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;

    // لحفظ مكان ظهور الخطأ في الستاك
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
