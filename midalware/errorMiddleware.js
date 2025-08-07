import ErrorHandler from "../utils/ErrorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  // إذا الخطأ عبارة عن ErrorHandler استخدم كود الحالة الخاص فيه
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if(err.name==='CastError'){
    const message=`this error invalide resorce ${err.path}`;
    err=new ErrorHandler(404,message)
  }
//duplicate err
  if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        const message = `The ${field} "${value}" is already registered. Please login to continue.`;
        err = new ErrorHandler(message, 409);
    }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
